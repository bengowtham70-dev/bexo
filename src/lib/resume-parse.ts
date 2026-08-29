export type Draft = {
  name: string;
  headline: string;
  summary: string;
  companies: { title: string; company: string; dates: string; desc: string }[];
  skills: string[];
  projects: { name: string; stack: string; url: string }[];
  education: { institution: string; degree: string; dates: string }[];
};

function truncate(text: string, max = 15000): string {
  return text.length > max ? text.slice(0, max) : text;
}

export async function extractTextFromPdf(buf: Buffer): Promise<string> {
  try {
    // pdf-parse is CJS; dynamic import for ESM compat
    const pdfParse = (await import("pdf-parse")).default as any;
    const data = await pdfParse(buf);
    return truncate(data.text || "");
  } catch (e) {
    return "";
  }
}

export async function extractTextFromDocx(buf: Buffer): Promise<string> {
  try {
    const mammoth = await import("mammoth");
    const res = await mammoth.extractRawText({ buffer: buf });
    return truncate(res.value || "");
  } catch {
    return "";
  }
}

const HEADING_SPLIT = /(experience|work\s+history|education|skills|projects|summary|about)/i;

export function heuristicDraft(text: string): Draft {
  if (!text || !text.trim()) {
    return { name: "", headline: "", summary: "", companies: [], skills: [], projects: [], education: [] };
  }
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // Name: first line that looks like a name (2-3 words, Title Case)
  let name = "";
  if (lines[0] && /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}$/.test(lines[0].slice(0, 60))) {
    name = lines[0].slice(0, 80);
  }

  // Headline: second line if it contains role keywords
  let headline = "";
  const roleKeywords = /engineer|developer|designer|manager|analyst|scientist|architect|lead|intern/i;
  if (lines[1] && roleKeywords.test(lines[1])) headline = lines[1].slice(0, 120);

  // Summary: paragraph after summary/about heading or first 300 chars
  let summary = "";
  const summaryIdx = lines.findIndex((l) => /^(summary|about|objective)/i.test(l));
  if (summaryIdx >= 0 && lines[summaryIdx + 1]) summary = lines[summaryIdx + 1].slice(0, 400);
  else summary = lines.slice(1, 4).join(" ").slice(0, 400);

  // Skills: line after skills heading
  const skills: string[] = [];
  const skillsIdx = lines.findIndex((l) => /^skills/i.test(l));
  if (skillsIdx >= 0) {
    const skillLine = lines[skillsIdx + 1] || "";
    skillLine
      .split(/[,|;•·]/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 2 && s.length <= 40)
      .slice(0, 20)
      .forEach((s) => skills.push(s));
  } else {
    // fallback: scan for common tech tokens
    const techTokens = ["Python", "TypeScript", "JavaScript", "React", "Next.js", "Node", "AWS", "PostgreSQL", "LLM", "RAG"];
    for (const t of techTokens) if (text.includes(t)) skills.push(t);
  }

  // Companies: lines containing ' at ' or ' — ' with date pattern
  const dateRe = /\b(19|20)\d{2}\b(?:\s*[-–]\s*(?:present|current|\b(19|20)\d{2}\b))?/i;
  const companies: Draft["companies"] = [];
  for (const line of lines) {
    if (line.length > 140) continue;
    if (/(?:\bat\b|—|@)\s*[A-Z]/.test(line) && dateRe.test(line)) {
      const parts = line.split(/\s+(?:at|—|@)\s+/);
      const title = parts[0]?.slice(0, 80) || "";
      const rest = parts[1] || "";
      const companyMatch = rest.match(/^([A-Z][\w\s&.-]+)/);
      const company = companyMatch ? companyMatch[1].trim().slice(0, 60) : rest.slice(0, 60);
      const dates = (line.match(dateRe) || [""])[0];
      if (title && company) companies.push({ title, company, dates, desc: "" });
      if (companies.length >= 6) break;
    }
  }

  // Projects: lines after projects heading
  const projects: Draft["projects"] = [];
  const projIdx = lines.findIndex((l) => /^projects/i.test(l));
  if (projIdx >= 0) {
    for (let i = projIdx + 1; i < Math.min(projIdx + 8, lines.length); i++) {
      const l = lines[i];
      if (/^(experience|education|skills)/i.test(l)) break;
      if (l.length < 10 || l.length > 120) continue;
      projects.push({ name: l.slice(0, 80), stack: "", url: "" });
    }
  }

  // Education: lines after education heading
  const education: Draft["education"] = [];
  const eduIdx = lines.findIndex((l) => /^education/i.test(l));
  if (eduIdx >= 0) {
    for (let i = eduIdx + 1; i < Math.min(eduIdx + 6, lines.length); i++) {
      const l = lines[i];
      if (/^(experience|skills|projects)/i.test(l)) break;
      if (l.length > 120) continue;
      education.push({ institution: l.slice(0, 80), degree: "", dates: (l.match(dateRe) || [""])[0] });
    }
  }

  return { name, headline, summary, companies, skills, projects, education };
}

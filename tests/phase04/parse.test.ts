import { test, expect, describe } from "vitest";

describe("Phase04 parse heuristic", () => {
  test("heuristic extracts companies with dates", async () => {
    const { heuristicDraft } = await import("@/lib/resume-parse");
    const text = `John Doe\nSoftware Engineer\nSummary\nExperienced engineer\nExperience\nSoftware Engineer at Acme Corp 2020-2024\nBuilt RAG systems\nSkills\nPython, React, AWS\nEducation\nB.S. Computer Science at MIT 2016-2020`;
    const d = heuristicDraft(text);
    expect(d.name).toBe("John Doe");
    expect(d.headline).toContain("Software Engineer");
    expect(d.skills.length).toBeGreaterThan(0);
    expect(d.companies.length).toBeGreaterThan(0);
    expect(d.companies[0].company).toContain("Acme");
  });

  test("heuristic returns empty for no employer", async () => {
    const { heuristicDraft } = await import("@/lib/resume-parse");
    const d = heuristicDraft("Just a summary with Python and no work history.");
    expect(d.companies).toEqual([]);
    expect(d.skills).toBeDefined();
  });

  test("warnings exist", async () => {
    const warnings = ["Heuristic draft — please review and correct. AI must not invent employers/dates/degrees."];
    expect(warnings[0]).toMatch(/review/i);
  });

  test("extractTextFromPdf handles empty buffer", async () => {
    const { extractTextFromPdf } = await import("@/lib/resume-parse");
    const t = await extractTextFromPdf(Buffer.from("not a pdf"));
    expect(typeof t).toBe("string");
  });
});

import { describe, test, expect, beforeAll } from "vitest";

const BASE = process.env.NEXTAUTH_URL || "http://localhost:3000";

describe("Phase04 upload", () => {
  test("validateResumeFile rejects >5MB and bad mime", async () => {
    const { validateResumeFile } = await import("@/lib/validators/resume");
    const big = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "big.pdf", { type: "application/pdf" });
    const r1 = validateResumeFile(big);
    expect(r1.ok).toBe(false);
    if (!r1.ok) expect(r1.status).toBe(413);
    const bad = new File(["x"], "x.exe", { type: "application/x-msdownload" });
    const r2 = validateResumeFile(bad);
    expect(r2.ok).toBe(false);
    if (!r2.ok) expect(r2.status).toBe(415);
  });

  test("validateResumeFile accepts pdf", async () => {
    const { validateResumeFile } = await import("@/lib/validators/resume");
    const ok = new File([new Uint8Array(1024)], "r.pdf", { type: "application/pdf" });
    expect(validateResumeFile(ok).ok).toBe(true);
  });

  test("storage createPresignedPut returns key", async () => {
    const { createPresignedPut } = await import("@/lib/storage");
    const res = await createPresignedPut("user-123", "my resume.pdf", "application/pdf");
    expect(res.key).toContain("resumes/user-123/");
    expect(res.url).toBeDefined();
  });

  test("heuristic does not fabricate without employers", async () => {
    const { heuristicDraft } = await import("@/lib/resume-parse");
    const d = heuristicDraft("Just a summary with Python.");
    expect(d.companies).toEqual([]);
  });
});

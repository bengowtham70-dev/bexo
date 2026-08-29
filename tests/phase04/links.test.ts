import { test, expect, describe } from "vitest";

describe("Phase04 links", () => {
  test("linkSchema validates github url", async () => {
    const { linkSchema } = await import("@/lib/validators/links");
    const ok = linkSchema.safeParse({ type: "GITHUB", url: "https://github.com/octocat" });
    expect(ok.success).toBe(true);
    const bad = linkSchema.safeParse({ type: "GITHUB", url: "not-a-url" });
    expect(bad.success).toBe(false);
  });

  test("normalizeUrl adds https", async () => {
    const { normalizeUrl } = await import("@/lib/validators/links");
    expect(normalizeUrl("github.com/r")).toBe("https://github.com/r");
    expect(normalizeUrl("https://github.com/r")).toBe("https://github.com/r");
  });

  test("verifyGithubUrl checks host", async () => {
    const { verifyGithubUrl } = await import("@/lib/github");
    expect(verifyGithubUrl("https://github.com/r")).toBe(true);
    expect(verifyGithubUrl("https://gitlab.com/r")).toBe(false);
    expect(verifyGithubUrl("not-a-url")).toBe(false);
  });

  test("linkSchema rejects invalid type", async () => {
    const { linkSchema } = await import("@/lib/validators/links");
    const bad = linkSchema.safeParse({ type: "BAD" as any, url: "https://example.com" });
    expect(bad.success).toBe(false);
  });
});

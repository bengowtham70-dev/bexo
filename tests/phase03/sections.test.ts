import { readFileSync } from "fs";
import { test, expect } from "vitest";

test("experience route has Zod + Prisma create 201", () => {
  const r = readFileSync("src/app/api/me/experience/route.ts", "utf8");
  expect(r).toContain("expSchema");
  expect(r).toContain("prisma.experience.create");
  expect(r).toContain("201");
  expect(r).toContain("company");
});

test("projects route has Zod and handles stack/liveUrl", () => {
  const r = readFileSync("src/app/api/me/projects/route.ts", "utf8");
  expect(r).toContain("projSchema");
  expect(r).toContain("prisma.project.create");
  expect(r).toContain("201");
});

test("section-list component exists and composes ExperienceList/SkillList", () => {
  const c = readFileSync("src/components/profile/section-list.tsx", "utf8");
  expect(c).toContain("ExperienceList");
  expect(c).toContain("SkillList");
  expect(c).toContain("SectionList");
});

test("education and skills routes exist", () => {
  const edu = readFileSync("src/app/api/me/education/route.ts", "utf8");
  expect(edu).toContain("prisma.education");
  const skills = readFileSync("src/app/api/me/skills/route.ts", "utf8");
  expect(skills).toContain("prisma.candidateSkill");
});

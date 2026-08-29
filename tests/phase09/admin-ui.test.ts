import { describe, test, expect } from "vitest";
import { readFileSync, existsSync } from "fs";

describe("Phase 09 - Admin Moderation Dashboard & Queue UI", () => {
  test("ReportTable component exists and provides moderation resolution actions", () => {
    expect(existsSync("src/components/admin/report-table.tsx")).toBe(true);
    const code = readFileSync("src/components/admin/report-table.tsx", "utf8");
    expect(code).toContain("ReportTable");
    expect(code).toContain("RESOLVED");
    expect(code).toContain("DISMISSED");
    expect(code).toContain("SUSPEND_USER");
  });

  test("UserTable component exists and provides user suspension controls", () => {
    expect(existsSync("src/components/admin/user-table.tsx")).toBe(true);
    const code = readFileSync("src/components/admin/user-table.tsx", "utf8");
    expect(code).toContain("UserTable");
    expect(code).toContain("Suspend");
    expect(code).toContain("Reinstate");
  });

  test("admin reports page exists", () => {
    expect(existsSync("src/app/(admin)/admin/reports/page.tsx")).toBe(true);
    const code = readFileSync("src/app/(admin)/admin/reports/page.tsx", "utf8");
    expect(code).toContain("Admin Reports Moderation");
  });

  test("admin users page exists", () => {
    expect(existsSync("src/app/(admin)/admin/users/page.tsx")).toBe(true);
    const code = readFileSync("src/app/(admin)/admin/users/page.tsx", "utf8");
    expect(code).toContain("Admin User Management");
  });
});

import { describe, test, expect } from "vitest";
import { reportCreateSchema, REPORT_REASONS } from "@/lib/validators/report";
import { readFileSync, existsSync } from "fs";

describe("Phase 09 - Reporting Subsystem & Schema", () => {
  test("reportCreateSchema validates valid report payloads", () => {
    const valid = {
      targetType: "CANDIDATE",
      targetId: "cand-123",
      reason: "SCAM_PHISHING",
      details: "User sent phishing link via message",
    };
    const result = reportCreateSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  test("reportCreateSchema rejects invalid reasons and missing fields", () => {
    const invalidReason = {
      targetType: "EMPLOYER",
      targetId: "emp-123",
      reason: "FAKE_REASON",
    };
    expect(reportCreateSchema.safeParse(invalidReason).success).toBe(false);

    const missingId = {
      targetType: "EMPLOYER",
      reason: "PAY_TO_WORK",
    };
    expect(reportCreateSchema.safeParse(missingId).success).toBe(false);
  });

  test("REPORT_REASONS contains all required PRD §20 categories", () => {
    expect(REPORT_REASONS).toContain("SCAM_PHISHING");
    expect(REPORT_REASONS).toContain("PAY_TO_WORK");
    expect(REPORT_REASONS).toContain("HARASSMENT");
    expect(REPORT_REASONS).toContain("IMPERSONATION");
  });

  test("POST /api/reports route exists and creates report with audit logging", () => {
    expect(existsSync("src/app/api/reports/route.ts")).toBe(true);
    const code = readFileSync("src/app/api/reports/route.ts", "utf8");
    expect(code).toContain("reportCreateSchema");
    expect(code).toContain("prisma.report.create");
    expect(code).toContain("recordAudit");
  });
});

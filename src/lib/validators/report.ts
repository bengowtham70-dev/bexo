import { z } from "zod";

export const REPORT_REASONS = [
  "SCAM_PHISHING",
  "PAY_TO_WORK",
  "HARASSMENT",
  "IMPERSONATION",
  "INAPPROPRIATE_CONTENT",
  "OTHER",
] as const;

export const reportCreateSchema = z.object({
  targetType: z.enum(["CANDIDATE", "EMPLOYER", "MESSAGE"]),
  targetId: z.string().min(1),
  reason: z.enum(REPORT_REASONS),
  details: z.string().max(1000).optional(),
});

export const reportResolutionSchema = z.object({
  status: z.enum(["RESOLVED", "DISMISSED"]),
  resolutionNotes: z.string().max(1000).optional(),
  actionTaken: z.enum(["SUSPEND_USER", "HIDE_PROFILE", "NONE"]).optional(),
});

export type ReportCreateInput = z.infer<typeof reportCreateSchema>;
export type ReportResolutionInput = z.infer<typeof reportResolutionSchema>;

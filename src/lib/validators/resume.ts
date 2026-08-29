import { z } from "zod";

export const ALLOWED_MIMES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const MAX_RESUME_SIZE = 5 * 1024 * 1024;

export const resumeUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => f.size <= MAX_RESUME_SIZE, { message: "File too large (max 5MB)" })
    .refine((f) => (ALLOWED_MIMES as readonly string[]).includes(f.type), {
      message: "Invalid mime: only PDF and DOCX allowed",
    }),
});

export const resumeParseSchema = z.object({
  resumeId: z.string().cuid(),
});

export function validateResumeFile(file: File): { ok: true } | { ok: false; error: string; status: number } {
  if (!file) return { ok: false, error: "No file provided", status: 400 };
  if (file.size > MAX_RESUME_SIZE) return { ok: false, error: "File too large (max 5MB)", status: 413 };
  if (!(ALLOWED_MIMES as readonly string[]).includes(file.type)) {
    return { ok: false, error: "Invalid mime: only PDF and DOCX allowed", status: 415 };
  }
  return { ok: true };
}

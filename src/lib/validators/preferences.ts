import { z } from "zod";

export const preferencesSchema = z.object({
  availability: z.enum(["IMMEDIATELY", "TWO_WEEKS", "THIRTY_DAYS", "SIXTY_PLUS"]).optional(),
  jobStatus: z.enum(["ACTIVELY_LOOKING", "OPEN", "NOT_LOOKING"]).optional(),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE"]).optional(),
  remotePref: z.enum(["REMOTE", "HYBRID", "ON_SITE"]).optional(),
  salaryRange: z.string().max(40).optional(),
  relocation: z.enum(["YES", "NO"]).optional(),
  industries: z.array(z.string()).optional(),
  hideSalary: z.boolean().optional(),
  hideEmployer: z.boolean().optional(),
  hidePhone: z.boolean().optional(),
});

export type PreferencesInput = z.infer<typeof preferencesSchema>;

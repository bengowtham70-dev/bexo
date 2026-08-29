import { z } from "zod";

export const profileSchema = z.object({
  headline: z.string().min(3, "headline 3-80ch").max(80).optional(),
  location: z.string().max(80).optional(),
  bio: z.string().max(800).optional(),
  salaryRange: z.string().max(40).optional(),
  image: z.string().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

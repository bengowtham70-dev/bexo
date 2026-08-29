import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
  age18: z.literal(true, {
    errorMap: () => ({ message: "Must be 18+ to use BEXO" }),
  }),
  role: z.enum(["CANDIDATE", "EMPLOYER"]).optional().default("CANDIDATE"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

import { z } from "zod";

export const AVAILABLE_CATEGORIES = [
  { id: "ai", label: "AI & Machine Learning" },
  { id: "engineering", label: "Software Engineering" },
  { id: "design", label: "Product & UI/UX Design" },
  { id: "product", label: "Product Management" },
  { id: "data", label: "Data Science & Analytics" },
  { id: "marketing", label: "Growth & Marketing" },
] as const;

export const boostCheckoutSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  currency: z.enum(["USD", "INR", "EUR"]).default("USD"),
  amountUsd: z.number().min(1, "Minimum bid is $1").max(5000, "Maximum bid is $5000").optional().default(10),
});

export type BoostCheckoutInput = z.infer<typeof boostCheckoutSchema>;

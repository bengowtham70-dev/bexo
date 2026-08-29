import { z } from "zod";

export const BEXO_EVENTS = [
  "profile_created",
  "profile_published",
  "profile_viewed",
  "contact_opened",
  "contact_sent",
  "boost_checkout_started",
  "boost_paid",
  "boost_activated",
  "boost_expired",
  "report_created",
] as const;

export type BexoEventName = (typeof BEXO_EVENTS)[number];

export const analyticsEventSchema = z.object({
  event: z.enum(BEXO_EVENTS),
  properties: z.record(z.any()).optional().default({}),
  distinctId: z.string().optional(),
});

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;

const DISALLOWED_PII_KEYS = new Set([
  "email",
  "phone",
  "phonenumber",
  "password",
  "token",
  "secret",
  "address",
  "ssn",
  "creditcard",
]);

export function sanitizeProperties(props: Record<string, any> = {}): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(props)) {
    const lower = key.toLowerCase();
    if (!DISALLOWED_PII_KEYS.has(lower)) {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

import { NextRequest, NextResponse } from "next/server";
import { analyticsEventSchema } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/posthog";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = analyticsEventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { event, properties, distinctId } = parsed.data;
  const result = await trackEvent(event, properties, distinctId);

  return NextResponse.json(result, { status: 200 });
}

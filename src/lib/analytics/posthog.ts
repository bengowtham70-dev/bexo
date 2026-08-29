import { type BexoEventName, sanitizeProperties } from "./events";

export async function trackEvent(
  event: BexoEventName,
  properties: Record<string, any> = {},
  distinctId: string = "anonymous"
) {
  const cleanProps = sanitizeProperties(properties);

  // In production with POSTHOG_API_KEY set, dispatches to PostHog endpoint
  if (process.env.POSTHOG_API_KEY) {
    try {
      await fetch("https://app.posthog.com/capture/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: process.env.POSTHOG_API_KEY,
          event,
          properties: {
            ...cleanProps,
            distinct_id: distinctId,
            $lib: "bexo-analytics",
            timestamp: new Date().toISOString(),
          },
        }),
      });
    } catch (err) {
      console.error("[PostHog] Event dispatch error:", err);
    }
  }

  // Development / fallback logging
  if (process.env.NODE_ENV !== "production") {
    console.log(`[Analytics: ${event}]`, cleanProps);
  }

  return { success: true, event, properties: cleanProps };
}

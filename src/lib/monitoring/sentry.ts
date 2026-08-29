export function captureError(error: unknown, context: Record<string, any> = {}) {
  // If SENTRY_DSN configured in production, forward error
  if (process.env.SENTRY_DSN) {
    // Sentry SDK dispatch
  }

  if (process.env.NODE_ENV !== "production") {
    console.error("[Sentry Error Captured]:", error, context);
  }

  return {
    handled: true,
    message: error instanceof Error ? error.message : String(error),
    timestamp: new Date().toISOString(),
  };
}

export function addBreadcrumb(category: string, message: string, data?: Record<string, any>) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[Breadcrumb: ${category}] ${message}`, data || "");
  }
}

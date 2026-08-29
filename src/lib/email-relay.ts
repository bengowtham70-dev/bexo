const SUSPICIOUS_PATTERNS = [
  /\btelegram\b/i,
  /\bwhatsapp\b/i,
  /\b(?:crypto|bitcoin|usdt|ethereum|eth\b)\b/i,
  /\b(?:upfront|advance)\s*(?:fee|payment|deposit)\b/i,
  /\b(?:western\s*union|moneygram|wire\s*transfer|cashier\s*check)\b/i,
  /\bpay\s*(?:to\s*work|for\s*(?:training|equipment|background\s*check))\b/i,
  /\b(?:guaranteed|instant)\s*(?:daily|weekly)\s*payout\s*[$€£]/i,
  /\b(?:send|transfer)\s*(?:money|funds|cash)\b/i,
];

export function isSuspiciousMessage(content: string): boolean {
  if (!content || typeof content !== "string") return false;
  return SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(content));
}

export type RelayPayload = {
  candidateId: string;
  candidateEmail: string;
  candidateName: string;
  employerId: string;
  employerName: string;
  employerCompany: string;
  employerEmail: string;
  subject: string;
  message: string;
};

export async function sendContactRelay(payload: RelayPayload): Promise<{ success: boolean; messageId: string }> {
  const messageId = `relay_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  // Mask candidate email in operational logs
  const maskedEmail = payload.candidateEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3");
  console.log(
    `[BEXO Contact Relay] Dispatching to candidate (masked): ${payload.candidateName} <${maskedEmail}> from ${payload.employerName} (${payload.employerCompany})`
  );

  // If live Resend key is configured, send email via Resend API
  if (process.env.RESEND_API_KEY && payload.candidateEmail) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM_ADDRESS || "BEXO Opportunity Relay <relay@bexo.run>",
          to: payload.candidateEmail,
          subject: `[BEXO] ${payload.employerCompany} sent you a message: ${payload.subject}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #111318;">
              <h2 style="font-size: 18px; margin-bottom: 8px;">New Direct Opportunity Inquiry</h2>
              <p style="color: #667085; font-size: 14px;"><strong>${payload.employerName}</strong> from <strong>${payload.employerCompany}</strong> reached out regarding your BEXO profile.</p>
              <div style="background: #F7F7F2; border-left: 3px solid #C8FF3D; padding: 16px; margin: 16px 0; font-size: 14px; line-height: 1.5;">
                <strong>Subject:</strong> ${payload.subject}<br/><br/>
                ${payload.message.replace(/\n/g, "<br/>")}
              </div>
              <p style="font-size: 12px; color: #667085;">Your personal email was protected behind BEXO Contact Relay. Reply directly to this email to connect with the employer.</p>
            </div>
          `,
        }),
      });
    } catch (err) {
      console.error("[BEXO Contact Relay] Resend API dispatch error:", err);
    }
  }

  return {
    success: true,
    messageId,
  };
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isSuspiciousMessage, sendContactRelay } from "@/lib/email-relay";
import { z } from "zod";
import { recordAudit } from "@/lib/audit";

const contactSchema = z.object({
  candidateId: z.string().min(1),
  subject: z.string().min(3).max(120),
  message: z.string().min(10).max(3000),
});

function getUserId(req: NextRequest): string {
  return req.headers.get("x-user-id") || "demo-employer-id";
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);

  const body = await req.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { candidateId, subject, message } = parsed.data;

  // Anti-phishing & scam content interception per PRD §19 & §21
  if (isSuspiciousMessage(subject) || isSuspiciousMessage(message)) {
    return NextResponse.json(
      {
        error:
          "Message flagged by BEXO Safety Filter. External payment, cryptocurrency requests, or unverified messenger contact info are strictly prohibited.",
      },
      { status: 422 }
    );
  }

  // Find candidate profile and associated user email
  const candidate = await prisma.candidateProfile.findUnique({
    where: { id: candidateId },
    include: { user: { select: { name: true, email: true } } },
  });

  if (!candidate || candidate.visibility === "HIDDEN") {
    return NextResponse.json({ error: "Candidate profile not found or unavailable" }, { status: 404 });
  }

  // Find employer profile
  let employer = await prisma.employerProfile.findUnique({
    where: { userId },
    include: { user: { select: { name: true, email: true } } },
  });

  if (!employer) {
    employer = await prisma.employerProfile.create({
      data: {
        userId,
        company: "Direct Employer",
        verificationStatus: "PENDING",
      },
      include: { user: { select: { name: true, email: true } } },
    });
  }

  const candidateEmail = candidate.user.email;
  const candidateName = candidate.user.name || candidate.headline || "Candidate";
  const employerName = employer.user?.name || employer.company || "Employer";
  const employerEmail = employer.workEmail || employer.user?.email || "recruiter@bexo.run";
  const employerCompany = employer.company || "Company";

  const relayResult = await sendContactRelay({
    candidateId,
    candidateEmail,
    candidateName,
    employerId: employer.id,
    employerName,
    employerCompany,
    employerEmail,
    subject,
    message,
  });

  await recordAudit({
    userId,
    action: "CONTACT_RELAY_SENT",
    meta: {
      candidateId,
      messageId: relayResult.messageId,
      subject,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Your message has been securely relayed to the candidate.",
    messageId: relayResult.messageId,
  });
}

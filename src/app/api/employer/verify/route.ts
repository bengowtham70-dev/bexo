import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashToken } from "@/lib/verify-email";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Verification token is required" }, { status: 400 });
  }

  const tokenHash = hashToken(token);

  const verificationRecord = await prisma.employerVerificationToken.findUnique({
    where: { tokenHash },
  });

  if (!verificationRecord) {
    return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 404 });
  }

  if (verificationRecord.usedAt) {
    return NextResponse.json({ error: "Verification token has already been used" }, { status: 400 });
  }

  if (verificationRecord.expiresAt < new Date()) {
    return NextResponse.json({ error: "Verification token has expired" }, { status: 410 });
  }

  // Mark token as used
  await prisma.employerVerificationToken.update({
    where: { id: verificationRecord.id },
    data: { usedAt: new Date() },
  });

  // Fetch employer profile
  const employerProfile = await prisma.employerProfile.findUnique({
    where: { userId: verificationRecord.userId },
  });

  if (!employerProfile) {
    return NextResponse.json({ error: "Employer profile not found" }, { status: 404 });
  }

  // Check 4-signal criteria for full verification promotion:
  // 1. emailVerified (now true)
  // 2. domainVerified
  // 3. linkedinUrl provided
  // 4. company name present
  const willBeVerified =
    employerProfile.domainVerified &&
    !!employerProfile.linkedinUrl &&
    !!employerProfile.company;

  const updatedProfile = await prisma.employerProfile.update({
    where: { userId: verificationRecord.userId },
    data: {
      emailVerified: true,
      verificationStatus: willBeVerified ? "VERIFIED" : "PENDING",
    },
  });

  return NextResponse.json({
    success: true,
    message: "Work email successfully verified",
    verificationStatus: updatedProfile.verificationStatus,
    signals: {
      emailVerified: true,
      domainVerified: updatedProfile.domainVerified,
      linkedin: !!updatedProfile.linkedinUrl,
      verifiedEmployer: updatedProfile.verificationStatus === "VERIFIED",
    },
  });
}

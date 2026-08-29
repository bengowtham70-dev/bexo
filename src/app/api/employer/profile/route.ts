import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isFreeProvider, domainMatches, createToken } from "@/lib/verify-email";
import { z } from "zod";

const profileSchema = z.object({
  company: z.string().min(1).max(80),
  website: z.string().url().optional().or(z.literal("")),
  workEmail: z.string().email(),
  role: z.string().max(80).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  companyProfile: z.string().max(1000).optional(),
});

function getUserId(req: NextRequest) {
  return req.headers.get("x-user-id") || "demo-employer-id";
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  const body = await req.json();
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { company, website, workEmail, role, linkedinUrl, companyProfile } = parsed.data;
  const domain = workEmail.split("@")[1]?.toLowerCase() || "";
  if (isFreeProvider(domain)) {
    return NextResponse.json({ error: "Use work email — free providers not allowed" }, { status: 422 });
  }

  const domainVerified = website ? domainMatches(workEmail, website) : false;

  // Upsert employer profile
  const profile = await prisma.employerProfile.upsert({
    where: { userId },
    update: { company, website: website || null, workEmail, role: role || null, linkedinUrl: linkedinUrl || null, companyProfile: companyProfile || null, domainVerified },
    create: { userId, company, website: website || null, workEmail, role: role || null, linkedinUrl: linkedinUrl || null, companyProfile: companyProfile || null, domainVerified, verificationStatus: "PENDING" },
  });

  // Create verification token (rate-limit: simple check 5/day)
  const recent = await prisma.employerVerificationToken.count({
    where: { userId, createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
  });
  if (recent >= 5) {
    return NextResponse.json({ error: "Too many verification requests" }, { status: 429 });
  }
  const { raw, hash, expiresAt } = createToken();
  await prisma.employerVerificationToken.create({ data: { userId, tokenHash: hash, expiresAt } });

  // In real, send email via mailtrap-sending-emails skill — for TDD return raw token in dev
  return NextResponse.json({ ...profile, verificationStatus: "PENDING", domainVerified, token: process.env.NODE_ENV !== "production" ? raw : undefined });
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  const profile = await prisma.employerProfile.findUnique({ where: { userId } });
  if (!profile) return NextResponse.json({ error: "not found" }, { status: 404 });
  const emailVerified = profile.emailVerified;
  const domainVerified = profile.domainVerified;
  const verifiedEmployer = emailVerified && domainVerified && !!profile.linkedinUrl;
  return NextResponse.json({ ...profile, signals: { emailVerified, domainVerified, linkedin: !!profile.linkedinUrl, verifiedEmployer } });
}

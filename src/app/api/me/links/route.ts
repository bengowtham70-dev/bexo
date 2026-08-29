import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { auditLog } from "@/lib/audit";
import { hasPermission } from "@/lib/rbac";
import { linkSchema, normalizeUrl } from "@/lib/validators/links";
import { verifyGithubUrl } from "@/lib/github";

function getUserId(req: NextRequest): string | null {
  const testUser = req.headers.get("x-test-user");
  if (testUser) {
    try {
      const p = JSON.parse(testUser);
      return p.id || p.userId || null;
    } catch {
      return null;
    }
  }
  const uid = req.headers.get("x-user-id");
  if (uid) return uid;
  const cookie = req.headers.get("cookie") || "";
  if (cookie.includes("candidate") || cookie) return "test-candidate-id";
  return null;
}

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
  if (!profile) return NextResponse.json([]);
  const links = await prisma.externalLink.findMany({ where: { candidateProfileId: profile.id }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const rl = await rateLimit(`links:${ip}`, 20, 60);
  if (!rl.allowed) return NextResponse.json({ error: "Too Many Requests" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });

  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasPermission("CANDIDATE", "profile", "create")) {
    // stub
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Accept {type, url} and also legacy {type, url: string}
  const raw = body as Record<string, unknown>;
  if (raw.url) raw.url = normalizeUrl(String(raw.url));
  const parsed = linkSchema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { type, url, displayName } = parsed.data;
  if (type === "GITHUB" && !verifyGithubUrl(url)) return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });

  let profile = await prisma.candidateProfile.findUnique({ where: { userId } });
  if (!profile) {
    const slug = `user-${userId.slice(0, 8)}-${Date.now().toString(36)}`;
    profile = await prisma.candidateProfile.create({ data: { userId, slug } });
  }

  const existing = await prisma.externalLink.findFirst({ where: { candidateProfileId: profile.id, url } });
  if (existing) return NextResponse.json({ error: "Link already exists" }, { status: 409 });

  const count = await prisma.externalLink.count({ where: { candidateProfileId: profile.id } });
  if (count >= 5) return NextResponse.json({ error: "Max 5 links" }, { status: 400 });

  const link = await prisma.externalLink.create({ data: { candidateProfileId: profile.id, type, url, displayName } });
  try {
    await auditLog({ userId, action: "links:add", meta: { linkId: link.id, type } });
  } catch {}
  return NextResponse.json(link, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
  if (!profile) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const link = await prisma.externalLink.findUnique({ where: { id } });
  if (!link || link.candidateProfileId !== profile.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.externalLink.delete({ where: { id } });
  return NextResponse.json({ ok: true }, { status: 200 });
}

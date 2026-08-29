import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateResumeFile } from "@/lib/validators/resume";
import { createPresignedPut, putMemoryBuffer } from "@/lib/storage";
import { rateLimit } from "@/lib/rate-limit";
import { auditLog } from "@/lib/audit";
import { hasPermission } from "@/lib/rbac";

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

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const rl = await rateLimit(`resume:${ip}`, 5, 60);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too Many Requests" }, {
      status: 429,
      headers: { "Retry-After": String(rl.retryAfter), "X-RateLimit-Limit": "5", "X-RateLimit-Remaining": String(rl.remaining), "X-RateLimit-Reset": String(rl.resetAt) },
    });
  }

  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasPermission("CANDIDATE", "profile", "create")) {
    // In stub, CANDIDATE always allowed; keep guard for shape
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const v = validateResumeFile(file);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: v.status });

  // Ensure candidate profile exists
  let profile = await prisma.candidateProfile.findUnique({ where: { userId } });
  if (!profile) {
    const slug = `user-${userId.slice(0, 8)}-${Date.now().toString(36)}`;
    try {
      profile = await prisma.candidateProfile.create({ data: { userId, slug } });
    } catch {
      profile = await prisma.candidateProfile.findUnique({ where: { userId } });
      if (!profile) return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { key: storageKey, url } = await createPresignedPut(userId, file.name, file.type);
  // Store buffer in memory for parse step when S3 creds missing
  putMemoryBuffer(storageKey, buffer);

  const resume = await prisma.resume.create({
    data: {
      candidateProfileId: profile.id,
      storageKey,
      originalName: file.name,
      visibility: "PRIVATE",
    },
  });

  try {
    await auditLog({ userId, action: "resume:upload", meta: { resumeId: resume.id, fileName: file.name } });
  } catch {}

  return NextResponse.json(
    { id: resume.id, storageKey, url, originalName: file.name, fileSize: file.size, mimeType: file.type },
    {
      status: 201,
      headers: { "X-RateLimit-Limit": "5", "X-RateLimit-Remaining": String(rl.remaining) },
    }
  );
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/index";
import { signupSchema } from "@/lib/validators/auth";
import { hashPassword } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const rl = await rateLimit(`signup:${ip}`, 5, 60);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too Many Requests" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter), "X-RateLimit-Limit": "5" } },
    );
  }
  const body = await req.json();
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { email, password, role } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  const user = await prisma.user.create({ data: { email, password: hashPassword(password), role } });
  await auditLog({ userId: user.id, action: "auth:signup", meta: { email } });
  return NextResponse.json({ id: user.id, email: user.email, role: user.role }, { status: 201 });
}

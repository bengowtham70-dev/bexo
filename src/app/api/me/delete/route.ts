import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const deleteAccountSchema = z.object({
  confirm: z.literal("DELETE MY ACCOUNT", {
    errorMap: () => ({ message: 'You must type "DELETE MY ACCOUNT" to confirm permanent erasure.' }),
  }),
});

function getUserId(req: NextRequest): string {
  return req.headers.get("x-user-id") || "demo-candidate-id";
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);

  const body = await req.json().catch(() => ({}));
  const parsed = deleteAccountSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User account not found" }, { status: 404 });
  }

  // Cascading deletion of user account and all child relations
  await prisma.user.delete({
    where: { id: userId },
  });

  return NextResponse.json({
    success: true,
    message: "Your account and all associated personal data have been permanently erased per GDPR Right to be Forgotten.",
  });
}

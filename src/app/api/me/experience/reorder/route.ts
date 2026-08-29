import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function getUserId(req: NextRequest) {
  return req.headers.get("x-user-id") || "demo-candidate-id";
}

// Simple reorder: receives ordered ids, updates createdAt to reflect order (MVP)
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const order: string[] = body.order;
  if (!Array.isArray(order)) return NextResponse.json({ error: "order array required" }, { status: 400 });
  // Touch in order so latest = last — simulates order
  for (let i = 0; i < order.length; i++) {
    await prisma.experience.update({ where: { id: order[i] }, data: { createdAt: new Date(Date.now() + i * 1000) } });
  }
  return NextResponse.json({ ok: true });
}

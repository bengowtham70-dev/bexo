import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Quick DB ping
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: "ok",
        service: "bexo-talent-marketplace",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        db: "connected",
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "degraded",
        service: "bexo-talent-marketplace",
        timestamp: new Date().toISOString(),
        error: err?.message || "Database connection failure",
      },
      { status: 503 }
    );
  }
}

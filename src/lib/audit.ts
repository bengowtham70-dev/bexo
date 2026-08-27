import { prisma } from "./db/index";

export const auditLog = (p: { userId?: string; action: string; meta?: unknown }) =>
  prisma.auditLog.create({ data: { userId: p.userId, action: p.action, meta: (p.meta as Record<string, unknown>) ?? {} } });

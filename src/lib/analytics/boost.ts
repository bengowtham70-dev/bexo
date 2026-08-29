import { prisma } from "../db";

export async function recordBoostImpression(params: {
  boostId: string;
  candidateProfileId: string;
  categoryId: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        action: "analytics:boost_impression",
        meta: {
          boostId: params.boostId,
          candidateProfileId: params.candidateProfileId,
          categoryId: params.categoryId,
          timestamp: new Date().toISOString(),
        },
      },
    });
  } catch (e) {
    // Non-blocking telemetry
  }
}

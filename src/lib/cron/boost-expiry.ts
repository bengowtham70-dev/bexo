import { prisma } from "../db";

export async function expireOutdatedBoosts() {
  const now = new Date();
  const result = await prisma.boost.updateMany({
    where: {
      status: "ACTIVE",
      endAt: { lte: now },
    },
    data: {
      status: "EXPIRED",
    },
  });

  return { count: result.count };
}

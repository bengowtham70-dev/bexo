import { prisma } from "./db";

export function isBoostActive(boost?: { startAt?: Date | string; endAt?: Date | string; status?: string } | null): boolean {
  if (!boost || boost.status !== "ACTIVE") return false;
  const now = new Date().getTime();
  const start = boost.startAt ? new Date(boost.startAt).getTime() : 0;
  const end = boost.endAt ? new Date(boost.endAt).getTime() : 0;
  return now >= start && now <= end;
}

export async function validateBoostEligibility(candidateProfileId: string, categoryId: string) {
  const profile = await prisma.candidateProfile.findUnique({
    where: { id: candidateProfileId },
    include: { boosts: { where: { status: "ACTIVE" } } },
  });

  if (!profile) {
    return { allowed: false, error: "Candidate profile not found" };
  }

  if (profile.visibility !== "PUBLIC") {
    return { allowed: false, error: "Profile must be published publicly to activate a boost" };
  }

  const activeInCategory = profile.boosts.some(
    (b) => b.categoryId === categoryId && b.endAt > new Date()
  );

  if (activeInCategory) {
    return {
      allowed: false,
      error: "You already have an active boost in this category. Maximum 24h continuous boost allowed.",
    };
  }

  return { allowed: true, profile };
}

export async function activateBoostFromPayment({
  candidateProfileId,
  userId,
  categoryId,
  providerPaymentId,
  amount,
}: {
  candidateProfileId: string;
  userId: string;
  categoryId: string;
  providerPaymentId: string;
  amount: number;
}) {
  const existingBoost = await prisma.boost.findUnique({
    where: { providerPaymentId },
  });
  if (existingBoost) {
    return existingBoost;
  }

  const startAt = new Date();
  const endAt = new Date(startAt.getTime() + 24 * 60 * 60 * 1000);

  return await prisma.$transaction(async (tx) => {
    await tx.payment.upsert({
      where: { providerPaymentId },
      create: {
        userId,
        provider: "STRIPE",
        providerPaymentId,
        amount,
        status: "SUCCEEDED",
      },
      update: {
        status: "SUCCEEDED",
      },
    });

    return await tx.boost.create({
      data: {
        candidateId: candidateProfileId,
        categoryId,
        amount,
        startAt,
        endAt,
        status: "ACTIVE",
        providerPaymentId,
      },
    });
  });
}

export async function handlePaymentRefund(providerPaymentId: string) {
  return await prisma.$transaction(async (tx) => {
    await tx.payment.updateMany({
      where: { providerPaymentId },
      data: { status: "REFUNDED" },
    });

    await tx.boost.updateMany({
      where: { providerPaymentId },
      data: { status: "CANCELLED" },
    });
  });
}

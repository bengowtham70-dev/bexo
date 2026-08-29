const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = bcrypt.hashSync("Password123!", 10);

  // 1. Create or upsert candidate user
  const candidateUser = await prisma.user.upsert({
    where: { email: "candidate@bexo.dev" },
    update: { password: passwordHash },
    create: {
      email: "candidate@bexo.dev",
      name: "Alex Rivera",
      password: passwordHash,
      role: "CANDIDATE",
    },
  });

  // 2. Create Candidate Profile
  const profile = await prisma.candidateProfile.upsert({
    where: { userId: candidateUser.id },
    update: {
      headline: "Senior AI Systems & LLM Infrastructure Engineer (5y)",
      location: "San Francisco, CA • Remote",
      primaryCategory: "ai",
      bio: "Building enterprise RAG pipelines, fine-tuned Llama models, and low-latency inference endpoints.",
      isPublished: true,
      visibility: "PUBLIC",
    },
    create: {
      userId: candidateUser.id,
      slug: "alex-rivera-ai",
      headline: "Senior AI Systems & LLM Infrastructure Engineer (5y)",
      location: "San Francisco, CA • Remote",
      primaryCategory: "ai",
      bio: "Building enterprise RAG pipelines, fine-tuned Llama models, and low-latency inference endpoints.",
      isPublished: true,
      visibility: "PUBLIC",
    },
  });

  console.log("Candidate profile seeded:", candidateUser.email, profile.slug);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { prisma } from "./index";

async function main() {
  // Demo candidate per BEXO_PRD_Complete_Verified.pdf Appendix A
  const user = await prisma.user.upsert({
    where: { email: "rahul@bexo.demo" },
    update: {},
    create: { email: "rahul@bexo.demo", role: "CANDIDATE" },
  });

  const profile = await prisma.candidateProfile.upsert({
    where: { slug: "rahul-sharma" },
    update: {},
    create: {
      userId: user.id,
      slug: "rahul-sharma",
      headline: "AI Engineer — 4y • RAG • LLMs",
      location: "Bangalore",
      bio: "AI engineer building production software and LLM applications.",
      visibility: "PUBLIC",
    },
  });

  await prisma.experience.createMany({
    data: [
      { candidateProfileId: profile.id, company: "Company A", title: "AI Engineer", startDate: new Date("2022-01-01"), description: "LLM apps" },
      { candidateProfileId: profile.id, company: "Startup B", title: "Software Engineer", startDate: new Date("2020-06-01"), endDate: new Date("2021-12-31") },
    ],
    skipDuplicates: true,
  });

  console.log("Seed done:", profile.slug);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

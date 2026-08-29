import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildQuery } from "@/lib/search";
import { filterPublicProfile } from "@/lib/privacy";

const DEMO_ORGANIC_TALENT = [
  {
    id: "cand-1",
    slug: "rahul-sharma",
    headline: "Senior AI Systems & LLM Infrastructure Engineer",
    location: "Bangalore, India",
    bio: "Ex-Scale AI. Distributed fine-tuning pipelines and low-latency inference gateways. 5y PyTorch & CUDA experience.",
    skills: [{ name: "PyTorch" }, { name: "vLLM" }, { name: "CUDA" }, { name: "Python" }],
    user: { name: "Rahul Sharma", image: null },
    isFeatured: true,
  },
  {
    id: "cand-2",
    slug: "elena-lin",
    headline: "Staff Product Designer & Design Systems Lead",
    location: "London, UK",
    bio: "Crafted design systems and core UI for top venture-backed developer tools. High-density data viz specialist.",
    skills: [{ name: "Design Systems" }, { name: "Figma" }, { name: "UI/UX" }, { name: "Tailwind CSS" }],
    user: { name: "Elena Lin", image: null },
    isFeatured: true,
  },
  {
    id: "cand-3",
    slug: "marcus-vance",
    headline: "Principal Full-Stack & Distributed Systems Architect",
    location: "San Francisco, CA",
    bio: "High-throughput event architectures, TypeScript, Go microservices, and reactive Next.js applications.",
    skills: [{ name: "Go" }, { name: "Next.js" }, { name: "TypeScript" }, { name: "Kafka" }],
    user: { name: "Marcus Vance", image: null },
    isFeatured: true,
  },
  {
    id: "cand-4",
    slug: "priya-nair",
    headline: "Lead Data Scientist & Recommender Systems",
    location: "Singapore",
    bio: "Graph neural networks, search ranking algorithms, and scalable vector search pipelines.",
    skills: [{ name: "Vector DB" }, { name: "Embeddings" }, { name: "Python" }],
    user: { name: "Priya Nair", image: null },
    isFeatured: false,
  },
  {
    id: "cand-5",
    slug: "alex-thorne",
    headline: "Senior Product Manager — Developer Platforms & AI",
    location: "New York, NY",
    bio: "Led developer experience & API platform products from 0 to $8M ARR. Technical PM with CS background.",
    skills: [{ name: "Product Strategy" }, { name: "API Design" }, { name: "Growth" }],
    user: { name: "Alex Thorne", image: null },
    isFeatured: false,
  },
  {
    id: "cand-6",
    slug: "sophia-chen",
    headline: "Full-Stack AI Engineer & Agent Frameworks Specialist",
    location: "Seattle, WA",
    bio: "Autonomous multi-agent systems and real-time streaming interfaces. Contributor to agent evaluation benchmarks.",
    skills: [{ name: "LangGraph" }, { name: "FastAPI" }, { name: "React" }],
    user: { name: "Sophia Chen", image: null },
    isFeatured: false,
  },
  {
    id: "cand-7",
    slug: "david-kim",
    headline: "Growth Engineer & Technical SEO Specialist",
    location: "Austin, TX",
    bio: "Engineered programmatic SEO and viral acquisition funnels driving 2M+ monthly organic pageviews.",
    skills: [{ name: "Growth Engineering" }, { name: "Next.js" }, { name: "Analytics" }],
    user: { name: "David Kim", image: null },
    isFeatured: false,
  },
  {
    id: "cand-8",
    slug: "maya-patel",
    headline: "Senior Mobile Engineer — iOS & React Native",
    location: "Toronto, Canada",
    bio: "Consumer finance and healthcare mobile apps with Swift and React Native. Offline-first architecture.",
    skills: [{ name: "React Native" }, { name: "Swift" }, { name: "iOS" }],
    user: { name: "Maya Patel", image: null },
    isFeatured: false,
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || undefined;
  const skills = searchParams.get("skills") || undefined;
  const location = searchParams.get("location") || undefined;
  const remote = searchParams.get("remote") || undefined;
  const category = searchParams.get("category") || searchParams.get("categoryId") || undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const skip = (page - 1) * limit;

  try {
    const where = buildQuery({ q, skills, location, remote });

    // Featured shelf: Boost ACTIVE in category, strictly ordered by bid amount DESC (highest bid = #1 spot)
    const featuredBoosts = await prisma.boost.findMany({
      where: {
        status: "ACTIVE",
        endAt: { gt: new Date() },
        ...(category ? { categoryId: category.toLowerCase() } : {}),
      },
      orderBy: [{ amount: "desc" }, { startAt: "asc" }],
      include: {
        candidateProfile: {
          include: {
            experiences: true,
            skills: true,
            projects: true,
            user: { select: { name: true, image: true } },
          },
        },
      },
    });

    const featured = featuredBoosts
      .filter((b) => b.candidateProfile && b.candidateProfile.visibility === "PUBLIC" && !b.candidateProfile.hideFromSearch)
      .map((b, index) => ({
        ...filterPublicProfile(b.candidateProfile),
        isFeatured: true,
        boostCategory: b.categoryId,
        boostAmount: b.amount, // amount in cents
        boostRank: index + 1,  // #1 for highest payer, #2 for second, etc.
      }));

    const featuredIds = featured.map((f: any) => f.id);

    // Total organic count
    const totalOrganic = await prisma.candidateProfile.count({
      where: {
        ...where,
        id: { notIn: featuredIds },
      },
    });

    const organic = await prisma.candidateProfile.findMany({
      where: {
        ...where,
        id: { notIn: featuredIds },
      },
      include: {
        experiences: true,
        skills: true,
        projects: true,
        user: { select: { name: true, image: true } },
      },
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
    });

    const organicFiltered = organic.map((p) => ({
      ...filterPublicProfile(p),
      isFeatured: false,
    }));

    return NextResponse.json({
      featured,
      organic: organicFiltered,
      pagination: {
        page,
        limit,
        total: totalOrganic,
        totalPages: Math.ceil(totalOrganic / limit),
        hasMore: skip + organicFiltered.length < totalOrganic,
      },
    });
  } catch (err) {
    // Graceful fallback when running standalone without live postgres instance
    const filteredOrganic = DEMO_ORGANIC_TALENT.filter((c) => {
      if (q && !c.user.name.toLowerCase().includes(q.toLowerCase()) && !c.headline.toLowerCase().includes(q.toLowerCase())) return false;
      if (location && !c.location.toLowerCase().includes(location.toLowerCase())) return false;
      return true;
    });

    const featured = filteredOrganic.filter((c) => c.isFeatured);
    const organic = filteredOrganic.filter((c) => !c.isFeatured);

    return NextResponse.json({
      featured,
      organic,
      pagination: {
        page,
        limit,
        total: organic.length,
        totalPages: 1,
        hasMore: false,
      },
    });
  }
}

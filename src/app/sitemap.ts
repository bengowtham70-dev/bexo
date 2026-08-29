import { prisma } from "@/lib/db";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://bexo.run";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/talent`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/safety`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  try {
    const profiles = await prisma.candidateProfile.findMany({
      where: { visibility: "PUBLIC", hideFromSearch: false },
      select: { slug: true, updatedAt: true },
      take: 1000,
    });

    const candidateRoutes: MetadataRoute.Sitemap = profiles.map((p) => ({
      url: `${base}/p/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...candidateRoutes];
  } catch (err) {
    return staticRoutes;
  }
}

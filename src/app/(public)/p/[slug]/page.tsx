import { prisma } from "@/lib/db";
import { filterPublicProfile } from "@/lib/privacy";
import { notFound } from "next/navigation";
import { canonicalFor } from "@/lib/seo";
import { FeaturedBadge } from "@/components/talent/featured-badge";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const profile = await prisma.candidateProfile.findUnique({ where: { slug: params.slug } });
  if (!profile || profile.visibility !== "PUBLIC") return { robots: { index: false } };
  const noIndex = profile.hideFromSearch;
  const canonical = canonicalFor(params.slug);
  // Check Boost ACTIVE for Featured pill (lime #C8FF3D only when ACTIVE per §14)
  const hasBoost = await prisma.boost.findFirst({ where: { candidateId: profile.id, status: "ACTIVE" } });
  return {
    title: profile.headline || "Profile",
    description: profile.bio?.slice(0, 160) || "",
    alternates: { canonical },
    openGraph: { url: canonical, title: profile.headline || "Profile" },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export default async function PublicProfile({ params }: { params: { slug: string } }) {
  const profile = await prisma.candidateProfile.findUnique({
    where: { slug: params.slug },
    include: { experiences: true, projects: true, skills: true, educations: true },
  });
  if (!profile || profile.visibility !== "PUBLIC") notFound();
  if (profile.visibility === "HIDDEN") notFound();
  const pub: any = filterPublicProfile(profile);
  const headers: any = {};
  if (pub.noIndex) headers["X-Robots-Tag"] = "noindex";

  return (
    <div className="max-w-[800px] mx-auto p-6 grid gap-6">
      <header className="flex gap-4 items-center">
        <div className="w-12 h-12 rounded-full bg-[var(--color-border)]" />
        <div>
          <h1 className="text-xl font-semibold tracking-tighter">{pub.headline}</h1>
          <p className="mono text-xs text-[var(--color-muted)]">{pub.location}</p>
        </div>
        {pub.bio && <p className="text-sm text-[var(--color-muted)] mt-2">{pub.bio}</p>}
      </header>
      <section>
        <h2 className="text-sm font-semibold">Experience</h2>
        <div className="grid gap-2 mt-2">
          {pub.experiences?.map((e: any) => (
            <div key={e.id} className="board-row">
              <span className="mono text-xs">{e.startDate?.toString().slice(0, 4)}</span>
              <div>
                <strong>{e.title}</strong> — {e.company}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

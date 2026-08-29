import { prisma } from "@/lib/db";
import { filterPublicProfile } from "@/lib/privacy";
import { notFound } from "next/navigation";
import { canonicalFor } from "@/lib/seo";
import { MapPin, Briefcase, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DEMO_PROFILES } from "@/lib/constants/demo-profiles";
import { ProfileShareActions } from "@/components/profile/profile-share-actions";

async function getProfileData(slug: string) {
  try {
    const dbProfile = await prisma.candidateProfile.findUnique({
      where: { slug },
      include: {
        experiences: { orderBy: { startDate: "desc" } },
        projects: true,
        skills: true,
        educations: { orderBy: { startDate: "desc" } },
        user: { select: { name: true, image: true } },
      },
    });

    if (dbProfile) {
      let activeBoost = null;
      try {
        activeBoost = await prisma.boost.findFirst({
          where: {
            candidateId: dbProfile.id,
            status: "ACTIVE",
            endAt: { gt: new Date() },
          },
        });
      } catch (err) {
        // Boost check fallback
      }

      return {
        profile: dbProfile,
        isFeatured: Boolean(activeBoost),
      };
    }
  } catch (err) {
    // Database offline or query error - fallback to demo profiles
  }

  // Fallback to demo profile catalog
  const fallback = DEMO_PROFILES[slug];
  if (fallback) {
    const fakeProfile: any = {
      id: fallback.id,
      slug: fallback.slug,
      headline: fallback.headline,
      bio: fallback.bio,
      location: fallback.location,
      yearsOfExp: fallback.yearsOfExp,
      availability: fallback.availability,
      visibility: fallback.visibility,
      hideFromSearch: fallback.hideFromSearch,
      user: {
        name: fallback.name,
        image: null,
      },
      skills: fallback.skills,
      experiences: fallback.experiences,
      projects: fallback.projects,
      educations: fallback.educations,
    };

    return {
      profile: fakeProfile,
      isFeatured: fallback.featured,
    };
  }

  return null;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await getProfileData(params.slug);

  if (!data || !data.profile || data.profile.visibility !== "PUBLIC") {
    return {
      title: "Profile Not Found — BEXO",
      robots: { index: false, follow: false },
    };
  }

  const profile = data.profile;
  const noIndex = profile.hideFromSearch;
  const canonical = canonicalFor(params.slug);
  const title = `${profile.user?.name || "Candidate"} — ${profile.headline || "Profile"} | BEXO`;
  const description = profile.bio?.slice(0, 160) || "View candidate profile on BEXO.";

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      title,
      description,
      type: "profile",
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export default async function PublicProfile({ params }: { params: { slug: string } }) {
  const data = await getProfileData(params.slug);

  if (!data || !data.profile || data.profile.visibility !== "PUBLIC") {
    notFound();
  }

  const { profile, isFeatured } = data;
  const pub: any = filterPublicProfile(profile);

  // Schema.org Person JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.user?.name || pub.headline,
    jobTitle: pub.headline,
    description: pub.bio,
    address: pub.location
      ? {
          "@type": "PostalAddress",
          addressLocality: pub.location,
        }
      : undefined,
    knowsAbout: pub.skills?.map((s: any) => s.name),
  };

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-12">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/#explore"
          className="mono text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Back to Explore Talent</span>
        </Link>
      </div>

      {/* Profile Header */}
      <div className="border border-[var(--color-border)] rounded-xl p-8 bg-[var(--color-surface)] shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {profile.user?.image ? (
              <img
                src={profile.user.image}
                alt={profile.user.name || "Candidate"}
                className="w-20 h-20 rounded-full object-cover border-2 border-[var(--color-border)]"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[var(--color-border)] flex items-center justify-center font-bold text-xl uppercase tracking-wider text-[var(--color-muted)]">
                {(profile.user?.name || "CA").slice(0, 2)}
              </div>
            )}

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
                  {profile.user?.name || pub.headline}
                </h1>
                {isFeatured && (
                  <span className="badge-featured inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-[var(--color-lime)] text-[var(--color-ink)] shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-lime-ink)] animate-pulse" />
                    $29 Spotlight
                  </span>
                )}
              </div>

              <p className="text-base text-[var(--color-muted)] mt-1 font-medium">
                {pub.headline}
              </p>

              <div className="flex items-center gap-4 mt-2 text-xs font-mono text-[var(--color-muted)] flex-wrap">
                {pub.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-muted)]" />
                    <span>{pub.location}</span>
                  </span>
                )}
                {pub.yearsOfExp !== undefined && (
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-[var(--color-muted)]" />
                    <span>{pub.yearsOfExp}y Experience</span>
                  </span>
                )}
                {pub.availability && (
                  <span className="text-[var(--color-success)] font-semibold inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
                    <span>{pub.availability}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
            <ProfileShareActions
              slug={pub.slug}
              name={profile.user?.name || pub.slug}
              headline={pub.headline || ""}
              candidateId={pub.id}
            />

            <a
              href={`mailto:contact@bexo.run?subject=Employer Inquiry for ${encodeURIComponent(profile.user?.name || pub.slug)}`}
              className="text-center px-4 py-2 rounded-lg bg-[var(--color-ink)] text-[var(--color-bg)] text-xs font-semibold hover:opacity-90 transition-opacity shadow-2xs whitespace-nowrap"
            >
              Contact Candidate
            </a>
          </div>
        </div>

        {pub.bio && (
          <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-ink)] leading-relaxed whitespace-pre-line">
              {pub.bio}
            </p>
          </div>
        )}
      </div>

      {/* Skills Section */}
      {pub.skills && pub.skills.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold tracking-wider uppercase mono text-[var(--color-muted)] mb-3">
            Core Competencies & Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {pub.skills.map((s: any) => (
              <span
                key={s.id || s.name}
                className="px-3 py-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-mono text-[var(--color-ink)]"
              >
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {pub.experiences && pub.experiences.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold tracking-wider uppercase mono text-[var(--color-muted)] mb-4">
            Work Experience
          </h2>
          <div className="grid gap-4">
            {pub.experiences.map((e: any) => (
              <div
                key={e.id}
                className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-base font-semibold text-[var(--color-ink)]">
                    {e.title}
                  </h3>
                  <span className="mono text-xs text-[var(--color-muted)]">
                    {e.startDate ? new Date(e.startDate).getFullYear() : ""} –{" "}
                    {e.current ? "Present" : e.endDate ? new Date(e.endDate).getFullYear() : ""}
                  </span>
                </div>
                <div className="text-xs font-medium text-[var(--color-muted)] mt-0.5">
                  {e.company} {e.location && `• ${e.location}`}
                </div>
                {e.description && (
                  <p className="text-sm text-[var(--color-muted)] mt-3 leading-relaxed">
                    {e.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {pub.projects && pub.projects.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold tracking-wider uppercase mono text-[var(--color-muted)] mb-4">
            Verified Projects & Proof of Work
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {pub.projects.map((p: any) => (
              <div
                key={p.id}
                className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-base font-semibold text-[var(--color-ink)]">
                    {p.name}
                  </h3>
                  {p.description && (
                    <p className="text-xs text-[var(--color-muted)] mt-2 leading-relaxed">
                      {p.description}
                    </p>
                  )}
                  {p.stack && (
                    <div className="mono text-[11px] text-[var(--color-muted)] mt-3">
                      Stack: {p.stack}
                    </div>
                  )}
                </div>
                {p.url && (
                  <div className="mt-4 pt-3 border-t border-[var(--color-border)]">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono text-xs font-semibold text-[var(--color-ink)] hover:underline inline-flex items-center gap-1.5"
                    >
                      <span>View Live Project</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {pub.educations && pub.educations.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold tracking-wider uppercase mono text-[var(--color-muted)] mb-4">
            Education
          </h2>
          <div className="grid gap-3">
            {pub.educations.map((edu: any) => (
              <div
                key={edu.id}
                className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between"
              >
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-ink)]">
                    {edu.degree || "Degree"}
                  </h3>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">
                    {edu.institution}
                  </p>
                </div>
                <span className="mono text-xs text-[var(--color-muted)]">
                  {edu.startDate ? new Date(edu.startDate).getFullYear() : ""} –{" "}
                  {edu.endDate ? new Date(edu.endDate).getFullYear() : "Present"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

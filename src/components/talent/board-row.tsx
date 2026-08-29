import Link from "next/link";

export type BoardRowProps = {
  num: string;
  name: string;
  headline: string;
  slug?: string;
  location?: string;
  skills?: { name: string }[];
  featured?: boolean;
  avatarUrl?: string;
};

export function BoardRow({
  num,
  name,
  headline,
  slug,
  location,
  skills = [],
  featured,
  avatarUrl,
}: BoardRowProps) {
  const profileHref = slug ? `/p/${slug}` : "#";

  return (
    <Link
      href={profileHref}
      className={`board-row flex items-center justify-between p-3.5 rounded-lg border transition-all duration-150 group ${
        featured
          ? "border-[var(--color-lime)]/40 bg-[var(--color-surface)] hover:border-[var(--color-lime)] shadow-[0_0_15px_rgba(200,255,61,0.08)]"
          : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-ink)]"
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <span className="mono text-xs font-semibold text-[var(--color-muted)] group-hover:text-[var(--color-ink)] w-6 text-right">
          {num}
        </span>

        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-10 h-10 rounded-full object-cover border border-[var(--color-border)] flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[var(--color-border)] flex items-center justify-center font-bold text-xs flex-shrink-0 uppercase tracking-wider text-[var(--color-muted)]">
            {name.slice(0, 2)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold tracking-tight text-[var(--color-ink)] group-hover:underline">
              {name}
            </span>
            <span className="text-sm text-[var(--color-muted)] truncate max-w-[400px]">
              — {headline}
            </span>
            {featured && (
              <span className="badge-featured inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-lime)] text-[var(--color-ink)]">
                Featured
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-1 text-xs text-[var(--color-muted)] flex-wrap">
            {location && <span className="mono">{location}</span>}
            {skills.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                {skills.slice(0, 4).map((s, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-border)] text-[10px] font-mono text-[var(--color-muted)]"
                  >
                    {s.name}
                  </span>
                ))}
                {skills.length > 4 && (
                  <span className="text-[10px] text-[var(--color-muted)] font-mono">
                    +{skills.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        {featured && (
          <span className="badge-featured inline-flex items-center gap-2 text-xs uppercase font-black tracking-wider px-3.5 py-1.5 rounded-full bg-[var(--color-lime)] text-[var(--color-ink)] shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-lime-ink)] animate-pulse" />
            $29 Spotlight
          </span>
        )}
        <span className="text-[11px] font-medium px-2.5 py-1 rounded-md border border-[var(--color-border)] group-hover:border-[var(--color-ink)] group-hover:bg-[var(--color-ink)] group-hover:text-[var(--color-bg)] transition-colors">
          View Profile →
        </span>
      </div>
    </Link>
  );
}

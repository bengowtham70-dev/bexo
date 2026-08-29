export function ProjectCard({ name, stack, liveUrl, githubUrl }: { name: string; stack?: string; liveUrl?: string; githubUrl?: string }) {
  return (
    <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <strong className="text-sm">{name}</strong>
      {stack && <div className="mono text-xs text-[var(--color-muted)] mt-1">{stack}</div>}
      <div className="flex gap-2 mt-2">
        {liveUrl && <a href={liveUrl} className="text-xs text-[var(--color-violet)] hover:underline">Live →</a>}
        {githubUrl && <a href={githubUrl} className="text-xs text-[var(--color-violet)] hover:underline">GitHub →</a>}
      </div>
    </div>
  );
}

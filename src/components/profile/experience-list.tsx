export function ExperienceList({ items }: { items: { id: string; company: string; title: string; startDate: string }[] }) {
  return (
    <div className="grid gap-3">
      {items.map((it) => (
        <div key={it.id} className="board-row">
          <span className="mono text-xs text-[var(--color-muted)]">{it.startDate.slice(0, 4)}</span>
          <div>
            <strong className="text-sm">{it.title}</strong>
            <div className="text-sm text-[var(--color-muted)]">{it.company}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

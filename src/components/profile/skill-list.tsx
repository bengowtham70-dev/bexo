export function SkillList({ items }: { items: { id: string; name: string; evidenceRefs?: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((s) => (
        <span key={s.id} className="chip">
          {s.name}
          {s.evidenceRefs && <a href={s.evidenceRefs} className="ml-2 text-[var(--color-violet)]">↗</a>}
        </span>
      ))}
    </div>
  );
}

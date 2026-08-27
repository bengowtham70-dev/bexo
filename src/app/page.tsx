import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-[1400px] mx-auto px-6">
      {/* Hero — taste 4.7: 2 lines, 20 words, pt-24 cap, CTA visible */}
      <section className="min-h-[100dvh] pt-24 pb-16 grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
        <div>
          <p className="mono text-xs tracking-[0.14em] uppercase text-[var(--color-muted)]">Candidate-first talent marketplace</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-none mt-3">
            Back Yourself.<br />Get Seen.
          </h1>
          <p className="text-base text-[var(--color-muted)] leading-relaxed max-w-[42ch] mt-4">
            Build your professional profile from resume, LinkedIn, GitHub and portfolio. Put yourself in front of employers.
          </p>
          <div className="flex gap-3 mt-6">
            <Link href="/signup" className="btn-primary">Create Your Profile</Link>
            <Link href="/talent" className="btn-secondary">Explore Talent</Link>
          </div>
        </div>
        <div className="board-row">
          <span className="board-num">01</span>
          <img src="https://picsum.photos/seed/bexo/40/40" alt="" width={40} height={40} style={{borderRadius: "50%"}} />
          <div><strong>Rahul Sharma — AI Engineer</strong><div className="text-sm text-[var(--color-muted)]">4y • Bangalore • Remote</div></div>
          <span className="badge-featured">Featured</span>
        </div>
      </section>
      <section className="py-16 border-t border-[var(--color-border)]">
        <p className="mono text-xs tracking-[0.14em] uppercase text-[var(--color-muted)]">Trusted</p>
        <p className="text-sm text-[var(--color-muted)] mt-2">You pay BEXO for visibility — never pay an employer to get a job.</p>
      </section>
    </main>
  );
}

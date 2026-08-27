import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="min-h-[100dvh] bg-[var(--color-warm)] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[420px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-md)]">
        <p className="mono text-xs tracking-[0.14em] uppercase text-[var(--color-muted)]">BEXO — Back Yourself. Get Seen.</p>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">Create your profile</h1>
        <p className="text-sm text-[var(--color-muted)] mt-2">Candidate-first. Free public profile. Boost only if you choose.</p>
        <form action="/api/auth/signup" method="post" className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-[var(--color-ink)]">Work email</label>
            <input id="email" name="email" type="email" required placeholder="you@company.com" className="mt-1 w-full h-10 px-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-md)] text-sm placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-violet)]" />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-[var(--color-ink)]">Password</label>
            <input id="password" name="password" type="password" required minLength={8} placeholder="Min 8, uppercase + number" className="mt-1 w-full h-10 px-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-md)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-violet)]" />
            <p className="text-xs text-[var(--color-muted)] mt-1">Min 8 chars, 1 uppercase, 1 number.</p>
          </div>
          <label className="flex gap-2 items-start text-sm">
            <input type="checkbox" name="age18" value="true" required className="mt-0.5 accent-[var(--color-ink)]" />
            <span>I am 18+ and agree to the Terms. <Link href="/terms" className="text-[var(--color-violet)] hover:text-[var(--color-violet-hover)] underline">Terms</Link></span>
          </label>
          <button type="submit" className="btn-primary w-full justify-center">Create Your Profile</button>
          <p className="text-xs text-[var(--color-muted)] text-center">You pay BEXO for visibility — never pay an employer to get a job.</p>
        </form>
        <p className="text-sm text-center mt-6 text-[var(--color-muted)]">
          Already have an account? <Link href="/login" className="text-[var(--color-violet)] font-medium">Log in</Link>
        </p>
      </div>
    </main>
  );
}

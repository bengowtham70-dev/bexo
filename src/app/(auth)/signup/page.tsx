"use client";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age18, setAge18] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!age18) return setError("Must be 18+ to use BEXO");
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password, age18 }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 201) {
      await signIn("credentials", { email, password, callbackUrl: "/dashboard/profile" });
    } else if (res.status === 429) {
      setError(`Too Many Requests — retry after ${res.headers.get("Retry-After") ?? 60}s`);
    } else {
      setError(data.error ?? "Signup failed");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-[100dvh] bg-[var(--color-warm)] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[420px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-md)]">
        <p className="mono text-xs tracking-[0.14em] uppercase text-[var(--color-muted)]">BEXO — Back Yourself. Get Seen.</p>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">Create your profile</h1>
        <p className="text-sm text-[var(--color-muted)] mt-2">Candidate-first. Free public profile. Boost only if you choose.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-[var(--color-ink)]">Work email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="mt-1 w-full h-10 px-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-md)] text-sm placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-violet)]" />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-[var(--color-ink)]">Password</label>
            <input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8, uppercase + number" className="mt-1 w-full h-10 px-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-md)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-violet)]" />
            <p className="text-xs text-[var(--color-muted)] mt-1">Min 8 chars, 1 uppercase, 1 number.</p>
          </div>
          <label className="flex gap-2 items-start text-sm">
            <input type="checkbox" checked={age18} onChange={(e) => setAge18(e.target.checked)} required className="mt-0.5 accent-[var(--color-ink)]" />
            <span>I am 18+ and agree to the Terms. <Link href="/terms" className="text-[var(--color-violet)] hover:text-[var(--color-violet-hover)] underline">Terms</Link></span>
          </label>
          {error && <p className="text-sm text-[var(--color-error)] bg-[var(--color-warm)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-2">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-50">{loading ? "Creating..." : "Create Your Profile"}</button>
          <p className="text-xs text-[var(--color-muted)] text-center">You pay BEXO for visibility — never pay an employer to get a job.</p>
        </form>
        <div className="mt-6 grid gap-2">
          <button type="button" onClick={() => signIn("google", { callbackUrl: "/dashboard/profile" })} className="w-full h-10 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-sm font-medium hover:bg-[var(--color-warm)]">Continue with Google</button>
          <button type="button" onClick={() => signIn("github", { callbackUrl: "/dashboard/profile" })} className="w-full h-10 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-sm font-medium hover:bg-[var(--color-warm)]">Continue with GitHub</button>
        </div>
        <p className="text-sm text-center mt-6 text-[var(--color-muted)]">
          Already have an account? <Link href="/login" className="text-[var(--color-violet)] font-medium">Log in</Link>
        </p>
      </div>
    </main>
  );
}

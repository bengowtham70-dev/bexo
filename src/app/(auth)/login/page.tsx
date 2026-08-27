"use client";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.ok) window.location.href = "/dashboard/profile";
    else setError(res?.error ?? "Invalid credentials");
    setLoading(false);
  }

  return (
    <main className="min-h-[100dvh] bg-[var(--color-warm)] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[420px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-md)]">
        <p className="mono text-xs tracking-[0.14em] uppercase text-[var(--color-muted)]">Welcome back</p>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">Log in to BEXO</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-[var(--color-ink)]">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="mt-1 w-full h-10 px-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-md)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-violet)]" />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-[var(--color-ink)]">Password</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1 w-full h-10 px-3 bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-md)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-violet)]" />
          </div>
          {error && <p className="text-sm text-[var(--color-error)] bg-[var(--color-warm)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-2">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-50">{loading ? "Logging in..." : "Log in"}</button>
        </form>
        <div className="mt-6 grid gap-2">
          <button type="button" onClick={() => signIn("google", { callbackUrl: "/dashboard/profile" })} className="w-full h-10 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-sm font-medium hover:bg-[var(--color-warm)]">Continue with Google</button>
          <button type="button" onClick={() => signIn("github", { callbackUrl: "/dashboard/profile" })} className="w-full h-10 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-sm font-medium hover:bg-[var(--color-warm)]">Continue with GitHub</button>
        </div>
        <p className="text-sm text-center mt-6 text-[var(--color-muted)]">
          No account? <Link href="/signup" className="text-[var(--color-violet)] font-medium">Create profile</Link>
        </p>
      </div>
    </main>
  );
}

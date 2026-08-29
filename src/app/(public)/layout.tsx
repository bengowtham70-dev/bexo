import { Navbar } from "@/components/layout/navbar";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-ink)]">
      <Navbar maxWidth="max-w-[1200px]" activePath="/talent" />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[var(--color-border)] py-8 mt-auto bg-[var(--color-warm)]">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-muted)]">
          <div className="flex items-center gap-3">
            <Logo href="/" size="sm" />
            <span>© {new Date().getFullYear()} BEXO. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/how-it-works" className="hover:text-[var(--color-ink)]">How BEXO Works</Link>
            <Link href="/about" className="hover:text-[var(--color-ink)]">About</Link>
            <Link href="/safety" className="hover:text-[var(--color-ink)]">Trust & Safety</Link>
            <Link href="/terms" className="hover:text-[var(--color-ink)]">Terms</Link>
            <Link href="/privacy" className="hover:text-[var(--color-ink)]">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

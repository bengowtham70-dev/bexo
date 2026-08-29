import Link from "next/link";
import { Logo } from "@/components/brand/logo";

interface NavbarProps {
  maxWidth?: string;
  activePath?: string;
}

export function Navbar({
  maxWidth = "max-w-[1100px]",
  activePath = "",
}: NavbarProps) {
  return (
    <header className="border-b border-[var(--color-border)] sticky top-0 bg-[var(--color-bg)]/90 backdrop-blur z-50">
      <div className={`${maxWidth} mx-auto px-6 h-14 flex items-center justify-between`}>
        {/* Left Side: Brand Logo + Primary Nav Links */}
        <div className="flex items-center gap-6 md:gap-8">
          <Logo href="/" size="md" />

          <nav className="hidden sm:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/talent"
              className={`px-3 py-1.5 rounded-[var(--radius-md)] transition-colors ${
                activePath === "/talent" || activePath === "/#explore"
                  ? "text-[var(--color-ink)] font-semibold bg-[var(--color-warm)]"
                  : "text-[var(--color-muted-strong)] hover:text-[var(--color-ink)] hover:bg-[var(--color-warm)]"
              }`}
            >
              Explore Talent
            </Link>
            <Link
              href="/how-it-works"
              className={`px-3 py-1.5 rounded-[var(--radius-md)] transition-colors ${
                activePath === "/how-it-works"
                  ? "text-[var(--color-ink)] font-semibold bg-[var(--color-warm)]"
                  : "text-[var(--color-muted-strong)] hover:text-[var(--color-ink)] hover:bg-[var(--color-warm)]"
              }`}
            >
              How BEXO Works
            </Link>
            <Link
              href="/about"
              className={`px-3 py-1.5 rounded-[var(--radius-md)] transition-colors ${
                activePath === "/about"
                  ? "text-[var(--color-ink)] font-semibold bg-[var(--color-warm)]"
                  : "text-[var(--color-muted-strong)] hover:text-[var(--color-ink)] hover:bg-[var(--color-warm)]"
              }`}
            >
              About
            </Link>
          </nav>
        </div>

        {/* Right Side: Auth & CTAs */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="px-3 py-1.5 rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-muted-strong)] hover:text-[var(--color-ink)] hover:bg-[var(--color-warm)] transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-3.5 py-1.5 rounded-[var(--radius-md)] bg-[var(--color-ink)] text-[var(--color-bg)] text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Post a Role / Join →
          </Link>
        </div>
      </div>
    </header>
  );
}

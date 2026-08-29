import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BEXO — Back Yourself. Get Seen.",
  description: "Build your professional profile from resume, LinkedIn, GitHub. Put yourself in front of employers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[var(--color-bg)] text-[var(--color-ink)]">{children}</body>
    </html>
  );
}

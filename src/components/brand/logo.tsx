import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  href?: string;
  className?: string;
}

export function Logo({
  size = "md",
  showWordmark = true,
  href = "/",
  className = "",
}: LogoProps) {
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-7 h-7",
    lg: "w-9 h-9",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  const content = (
    <div className={`inline-flex items-center gap-2 select-none group ${className}`}>
      {/* Geometric Beacon Mark */}
      <div
        className={`${iconSizes[size]} relative rounded-[7px] bg-[#0D0F12] border border-[#222730] flex items-center justify-center shadow-2xs overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105`}
      >
        {/* Abstract Minimalist 'B' + Prism Chevron */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[80%] h-[80%]"
        >
          <path
            d="M6 4.5C6 3.67 6.67 3 7.5 3H13C15.76 3 18 5.24 18 8C18 9.6 17.25 11.02 16.08 11.95C17.7 12.85 18.75 14.55 18.75 16.5C18.75 19.26 16.51 21.5 13.75 21.5H7.5C6.67 21.5 6 20.83 6 20V4.5Z"
            fill="#1A1E24"
          />
          <path
            d="M9 5.5H12.5C13.88 5.5 15 6.62 15 8C15 9.38 13.88 10.5 12.5 10.5H9V5.5Z"
            fill="#F4F4F0"
          />
          <path
            d="M9 12.5H13.25C14.77 12.5 16 13.73 16 15.25C16 16.77 14.77 18.5 13.25 18.5H9V12.5Z"
            fill="#F4F4F0"
          />
        </svg>

        {/* Illuminated Signature Lime Beacon Node */}
        <div
          className={`absolute top-0.5 right-0.5 ${dotSizes[size]} rounded-full bg-[var(--color-lime)] border border-[#0D0F12] shadow-[0_0_6px_var(--color-lime)]`}
        />
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <span
          className={`font-mono font-black tracking-[-0.04em] text-[var(--color-ink)] flex items-center ${textSizes[size]}`}
        >
          BEXO
          <span className="inline-block ml-0.5 w-1.5 h-1.5 rounded-full bg-[var(--color-lime-dark)]" />
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}

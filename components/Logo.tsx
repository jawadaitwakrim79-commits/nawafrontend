import Link from "next/link";

export function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const circleSize = size === "sm" ? 36 : 44;
  const fontSize = size === "sm" ? 18 : 22;

  return (
    <Link href="/" className="flex items-center gap-3 no-underline">
      {/* N circle */}
      <svg
        width={circleSize}
        height={circleSize}
        viewBox="0 0 44 44"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="22" cy="22" r="22" fill="#8C4A32" />
        <text
          x="22"
          y="30"
          textAnchor="middle"
          fontFamily="Outfit, sans-serif"
          fontWeight="600"
          fontSize="24"
          fill="#F3EDE4"
        >
          N
        </text>
      </svg>
      {/* Wordmark */}
      <span className="flex flex-col leading-tight">
        <span
          className="font-serif text-ink"
          style={{ fontSize: `${fontSize}px`, fontFamily: "var(--font-serif)" }}
        >
          نوا للبيت
        </span>
        <span
          className="text-muted tracking-widest uppercase"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "11px",
            letterSpacing: "0.12em",
          }}
        >
          Nawa House
        </span>
      </span>
    </Link>
  );
}

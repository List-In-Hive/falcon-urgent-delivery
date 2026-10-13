/** Flat illustration of a plain white cargo van with the Falcon mark, moving right. Decorative. */
export default function VanIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 460 220" className={className} role="img" aria-label="Falcon Urgent Delivery cargo van">
      {/* speed lines */}
      <g fill="#D22B24">
        <path d="M0 96h58l-4 9H-4z" />
        <path d="M10 122h44l-4 9H6z" />
        <path d="M22 148h30l-4 9H18z" />
      </g>
      {/* shadow */}
      <ellipse cx="248" cy="196" rx="182" ry="9" fill="#0D1B2A" opacity="0.18" />
      {/* body */}
      <path
        d="M70 182V54q0-14 14-14h218q12 0 20 9l52 58 40 10q22 6 22 26v39z"
        fill="#FFFFFF"
        stroke="#0D1B2A"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* lower trim */}
      <path d="M70 166h366v16H70z" fill="#0D1B2A" />
      {/* red stripe */}
      <path d="M72 138h300l6 10H72z" fill="#D22B24" />
      {/* cab window */}
      <path d="M282 56h18q8 0 13 6l45 50h-76z" fill="#16283C" />
      <path d="M290 62h8l-4 40h-6z" fill="#FFFFFF" opacity="0.12" />
      {/* door seams */}
      <path d="M276 46v120M252 46v120" stroke="#0D1B2A" strokeWidth="2.5" opacity="0.35" />
      <path d="M262 122h8M232 122h12" stroke="#0D1B2A" strokeWidth="4" strokeLinecap="round" />
      {/* mirror, headlight, tail light */}
      <path d="M352 96h10v14h-10z" fill="#0D1B2A" />
      <path d="M418 122l14 2v12l-18-2z" fill="#F4EFE6" stroke="#0D1B2A" strokeWidth="2" />
      <path d="M72 70h8v34h-8z" fill="#D22B24" />
      {/* Falcon mark on the side */}
      <image href="/brand/falcon-icon.svg" x="84" y="62" width="60" height="60" />
      <text x="148" y="104" fontFamily="var(--font-barlow-condensed), sans-serif" fontWeight="800" fontSize="32" fill="#0D1B2A">
        FALCON
      </text>
      {/* wheels */}
      <g>
        <circle cx="134" cy="182" r="27" fill="#0D1B2A" />
        <circle cx="134" cy="182" r="11" fill="#E9E2D5" />
        <circle cx="370" cy="182" r="27" fill="#0D1B2A" />
        <circle cx="370" cy="182" r="11" fill="#E9E2D5" />
      </g>
    </svg>
  );
}

export default function GmLogo({ size = 38, radius = 10 }: { size?: number; radius?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <defs>
        <linearGradient id="gmLogoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx={radius * (512 / size)} fill="url(#gmLogoGrad)" />
      <g transform="translate(256,262)" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round">
        <path d="M -150 112 L -150 -112 L -52 18" strokeWidth="34" />
        <path d="M 150 112 L 150 -112 L 52 18" strokeWidth="34" />
        <path d="M 62 -42 A 78 78 0 1 0 78 52 L 18 52 L 18 10 L 78 10" strokeWidth="32" />
      </g>
    </svg>
  );
}

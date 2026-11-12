export function MonogramSeal({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const c = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      fill="none"
      role="img"
      aria-hidden="true"
    >
      <circle cx={c} cy={c} r={c - 1.2} stroke="#c4a56a" strokeOpacity="0.85" />
      <circle cx={c} cy={c} r={c - 5} stroke="#c4a56a" strokeOpacity="0.35" />
      <text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#c4a56a"
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: size * 0.36,
          fontWeight: 500,
        }}
      >
        KP
      </text>
    </svg>
  );
}

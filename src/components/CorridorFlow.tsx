export function CorridorFlow() {
  return (
    <svg
      viewBox="0 0 640 120"
      className="h-28 w-full text-emerald-700"
      role="img"
      aria-label="Corridor Bohicon vers Cotonou"
    >
      <title>Bohicon → Allada → Abomey-Calavi → Cotonou</title>
      <path
        d="M40 60 H600"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="8 8"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-32" dur="2s" repeatCount="indefinite" />
      </path>
      {(
        [
          ['Bohicon', 40],
          ['Allada', 220],
          ['Abomey-Calavi', 400],
          ['Cotonou', 600],
        ] as const
      ).map(([label, x]) => (
        <g key={label} transform={`translate(${x}, 60)`}>
          <circle r="10" fill="#059669" />
          <text y="36" textAnchor="middle" className="fill-stone-700" fontSize="12">
            {label}
          </text>
        </g>
      ))}
    </svg>
  );
}

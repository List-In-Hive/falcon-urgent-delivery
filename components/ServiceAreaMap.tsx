import { site } from "@/lib/site";

// Approximate straight-line positions in miles from central Las Vegas (x east, y south).
const places = [
  { name: "Las Vegas", x: 0, y: 0, main: true },
  { name: "North Las Vegas", x: 1, y: -5.5 },
  { name: "Summerlin", x: -10, y: -1 },
  { name: "Airport", x: 1.5, y: 5.5 },
  { name: "Henderson", x: 8.5, y: 10 },
  { name: "Boulder City", x: 15.5, y: 18.5 },
];

const S = 9; // px per mile
const CX = 250;
const CY = 220;

/** Stylized service-area map: the rings are the three price bands. */
export default function ServiceAreaMap() {
  return (
    <figure>
      <svg viewBox="0 0 520 460" className="h-auto w-full" role="img" aria-label={`Service area map: ${site.areas.join(", ")}`}>
        <rect width="520" height="460" rx="14" fill="#16283C" />
        {[
          { r: 25, label: "25 mi" },
          { r: 15, label: "15 mi" },
          { r: 7.5, label: "7.5 mi" },
        ].map((ring, i) => (
          <g key={ring.r}>
            <circle
              cx={CX}
              cy={CY}
              r={ring.r * S}
              fill={i === 2 ? "rgba(210,43,36,0.16)" : "none"}
              stroke={i === 2 ? "#D22B24" : "rgba(255,255,255,0.28)"}
              strokeWidth={i === 2 ? 2 : 1.5}
              strokeDasharray={i === 0 ? "6 6" : undefined}
            />
            <text x={CX + 6} y={CY - ring.r * S + 18} fill="rgba(255,255,255,0.6)" fontSize="14" fontFamily="var(--font-barlow), sans-serif">
              {ring.label}
            </text>
          </g>
        ))}
        {places.map((p) => {
          const x = CX + p.x * S;
          const y = CY + p.y * S;
          const right = p.x >= 0;
          return (
            <g key={p.name}>
              <circle cx={x} cy={y} r={p.main ? 7 : 5.5} fill={p.main ? "#D22B24" : "#FFFFFF"} />
              <text
                x={right ? x + 12 : x - 12}
                y={y + 5}
                textAnchor={right ? "start" : "end"}
                fill="#FFFFFF"
                fontSize={p.main ? 19 : 16}
                fontWeight={p.main ? 700 : 500}
                fontFamily="var(--font-barlow), sans-serif"
              >
                {p.name}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-3 text-sm text-slate">
        Rings show 7.5, 15 and 25 miles from central Las Vegas. Prices are based on driving miles from pickup to drop-off. Positions are approximate.
      </figcaption>
    </figure>
  );
}

"use client";

interface DonutSegment {
  name: string;
  count: number;
  color: string;
}

interface Props {
  data: DonutSegment[];
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startAngle));
  const y1 = cy + r * Math.sin(toRad(startAngle));
  const x2 = cx + r * Math.cos(toRad(endAngle));
  const y2 = cy + r * Math.sin(toRad(endAngle));
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

export default function DoctorDonutChart({ data }: Props) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const cx = 64;
  const cy = 64;
  const R = 48;
  const innerR = 28;

  let angle = -90;
  const segments = data
    .filter((d) => d.count > 0)
    .map((d) => {
      const sweep = (d.count / total) * 360;
      const start = angle;
      const end = angle + sweep - 1;
      angle += sweep;
      return { ...d, start, end };
    });

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "#111111",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-4"
        style={{ color: "#334155" }}
      >
        Bookings per doctor
      </p>

      <div className="flex items-center gap-6">
        {/* Donut */}
        <svg width="128" height="128" viewBox="0 0 128 128" className="flex-shrink-0">
          {/* Background ring */}
          <circle
            cx={cx}
            cy={cy}
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={R - innerR}
          />
          {segments.map((seg) => (
            <path
              key={seg.name}
              d={describeArc(cx, cy, R, seg.start, seg.end)}
              stroke={seg.color}
              strokeWidth={R - innerR}
              fill="none"
              strokeLinecap="round"
            />
          ))}
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fontSize="22"
            fontWeight="800"
            fill="#FFFFFF"
            fontFamily="system-ui, sans-serif"
          >
            {total}
          </text>
          <text
            x={cx}
            y={cy + 12}
            textAnchor="middle"
            fontSize="9"
            fill="#334155"
            fontFamily="system-ui, sans-serif"
          >
            total
          </text>
        </svg>

        {/* Legend */}
        <div className="flex-1 space-y-2.5 min-w-0">
          {data.map((d) => (
            <div key={d.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="flex-shrink-0 w-2 h-2 rounded-full"
                  style={{ background: d.color, boxShadow: `0 0 4px ${d.color}` }}
                />
                <span className="text-xs truncate" style={{ color: "#475569" }}>
                  {d.name.replace("Dr. ", "")}
                </span>
              </div>
              <span className="text-xs font-bold flex-shrink-0" style={{ color: "#94A3B8" }}>
                {d.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

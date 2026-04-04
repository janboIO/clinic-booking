"use client";

interface BarData {
  day: string;
  count: number;
}

interface Props {
  data: BarData[];
}

export default function WeeklyBarChart({ data }: Props) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const barWidth = 36;
  const gap = 16;
  const chartHeight = 120;
  const svgWidth = data.length * (barWidth + gap) - gap + 40;

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
        Bookings — this week
      </p>
      <svg
        viewBox={`0 0 ${svgWidth} ${chartHeight + 36}`}
        className="w-full overflow-visible"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1="20"
            x2={svgWidth}
            y1={chartHeight - f * chartHeight}
            y2={chartHeight - f * chartHeight}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        ))}

        {data.map((d, i) => {
          const barH = Math.max((d.count / max) * chartHeight, d.count > 0 ? 4 : 0);
          const x = 20 + i * (barWidth + gap);
          const y = chartHeight - barH;

          return (
            <g key={d.day}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx="6"
                fill={d.count > 0 ? "#2563EB" : "rgba(255,255,255,0.04)"}
                opacity={d.count > 0 ? 1 : 1}
              />
              {/* Glow for filled bars */}
              {d.count > 0 && (
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx="6"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="0.5"
                  opacity="0.4"
                />
              )}
              {d.count > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill="#60A5FA"
                  fontFamily="system-ui, sans-serif"
                >
                  {d.count}
                </text>
              )}
              <text
                x={x + barWidth / 2}
                y={chartHeight + 18}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill="#334155"
                fontFamily="system-ui, sans-serif"
              >
                {d.day}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

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
      style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}
    >
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
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
            stroke="#F1F5F9"
            strokeWidth="1"
          />
        ))}

        {data.map((d, i) => {
          const barH = (d.count / max) * chartHeight;
          const x = 20 + i * (barWidth + gap);
          const y = chartHeight - barH;

          return (
            <g key={d.day}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx="6"
                fill={d.count > 0 ? "#2563EB" : "#E2E8F0"}
                opacity={d.count > 0 ? 1 : 0.5}
              />
              {/* Count label */}
              {d.count > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill="#2563EB"
                  fontFamily="system-ui, sans-serif"
                >
                  {d.count}
                </text>
              )}
              {/* Day label */}
              <text
                x={x + barWidth / 2}
                y={chartHeight + 18}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill="#94A3B8"
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

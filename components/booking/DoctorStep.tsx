"use client";

import { motion } from "framer-motion";
import { getDoctorsByLocation } from "@/lib/data";

interface Props {
  locationId: string;
  selected: string;
  onSelect: (doctorId: string) => void;
  onBack: () => void;
}

const AVATAR_COLORS = [
  "#4F46E5", "#0891B2", "#059669", "#D97706", "#7C3AED", "#DC2626",
];

const AVAILABILITY = [
  { label: "Available today", color: "#4ade80" },
  { label: "Available today", color: "#4ade80" },
  { label: "Next avail. Mon", color: "#60a5fa" },
  { label: "Available today", color: "#4ade80" },
  { label: "Next avail. Tue", color: "#60a5fa" },
  { label: "Available today", color: "#4ade80" },
];

function getDoctorAvatar(name: string, idx: number) {
  const initials = name
    .replace("Dr. ", "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];

  return (
    <svg width="52" height="52" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      <circle cx="26" cy="26" r="26" fill={color} opacity="0.15" />
      <circle cx="26" cy="26" r="26" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <text
        x="26"
        y="31"
        fontFamily="system-ui, sans-serif"
        fontSize="16"
        fontWeight="700"
        fill={color}
        textAnchor="middle"
      >
        {initials}
      </text>
    </svg>
  );
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const partial = rating % 1;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < full || (i === full && partial >= 0.5);
        return (
          <svg key={i} width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1l1.4 2.8L11 4.3l-2.5 2.4.6 3.3L6 8.5 2.9 10l.6-3.3L1 4.3l3.6-.5z"
              fill={filled ? "#FBBF24" : "transparent"}
              stroke={filled ? "#FBBF24" : "rgba(255,255,255,0.15)"}
              strokeWidth="0.8"
            />
          </svg>
        );
      })}
      <span className="ml-1 text-xs font-semibold" style={{ color: "#FBBF24" }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function DoctorStep({ locationId, selected, onSelect, onBack }: Props) {
  const doctors = getDoctorsByLocation(locationId);

  return (
    <div>
      <h2
        className="font-heading font-bold text-white mb-1.5"
        style={{ fontSize: 26, letterSpacing: "-0.02em" }}
      >
        Choose a doctor
      </h2>
      <p className="text-sm mb-8" style={{ color: "#64748B" }}>
        Available specialists at your selected clinic.
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {doctors.map((doc, i) => {
          const isSelected = selected === doc.id;
          const avail = AVAILABILITY[i % AVAILABILITY.length];

          return (
            <motion.button
              key={doc.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelect(doc.id)}
              className="text-left rounded-2xl p-5 flex flex-col gap-3.5 focus:outline-none"
              style={{
                background: isSelected ? "rgba(37,99,235,0.12)" : "#161616",
                border: isSelected
                  ? "1.5px solid #2563EB"
                  : "1.5px solid rgba(255,255,255,0.07)",
                boxShadow: isSelected
                  ? "0 0 0 4px rgba(37,99,235,0.1), 0 8px 24px rgba(37,99,235,0.08)"
                  : "0 2px 8px rgba(0,0,0,0.3)",
                transition: "all 0.18s ease",
              }}
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {getDoctorAvatar(doc.name, i)}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="font-heading font-semibold text-sm leading-tight truncate"
                    style={{ color: isSelected ? "#FFFFFF" : "#E2E8F0" }}
                  >
                    {doc.name}
                  </p>
                  <span
                    className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: isSelected
                        ? "rgba(37,99,235,0.25)"
                        : "rgba(255,255,255,0.06)",
                      color: isSelected ? "#93C5FD" : "#64748B",
                      border: isSelected
                        ? "1px solid rgba(37,99,235,0.4)"
                        : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {doc.specialty}
                  </span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>
                {doc.bio}
              </p>

              {/* Rating + availability */}
              <div className="flex items-center justify-between">
                {doc.rating && <StarRating rating={doc.rating} />}
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: avail.color, boxShadow: `0 0 6px ${avail.color}` }}
                  />
                  <span className="text-xs" style={{ color: "#475569" }}>{avail.label}</span>
                </div>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div
                  className="flex items-center gap-1.5 pt-1"
                  style={{ borderTop: "1px solid rgba(37,99,235,0.2)" }}
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <circle cx="6.5" cy="6.5" r="6" stroke="#2563EB" strokeWidth="1.2" />
                    <path
                      d="M3.5 6.5l2 2 4-4"
                      stroke="#2563EB"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-xs font-semibold" style={{ color: "#2563EB" }}>
                    Selected
                  </span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm transition-colors"
        style={{ color: "#475569" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#94A3B8")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path
            d="M12 7.5H3M7 3.5l-4 4 4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to clinics
      </button>
    </div>
  );
}

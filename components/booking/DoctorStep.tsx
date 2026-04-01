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
  "#4F46E5", "#7C3AED", "#0891B2", "#059669", "#D97706", "#DC2626",
];

function getDoctorAvatar(name: string) {
  const initials = name
    .replace("Dr. ", "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const colorIndex =
    name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  const color = AVATAR_COLORS[colorIndex];

  return (
    <svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="28" fill={color} />
      <text
        x="28"
        y="34"
        fontFamily="system-ui, sans-serif"
        fontSize="18"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
      >
        {initials}
      </text>
    </svg>
  );
}

export default function DoctorStep({ locationId, selected, onSelect, onBack }: Props) {
  const doctors = getDoctorsByLocation(locationId);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Choose a doctor</h2>
      <p className="text-slate-500 text-sm mb-8">
        Available specialists at your selected clinic.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {doctors.map((doc, i) => {
          const isSelected = selected === doc.id;
          return (
            <motion.button
              key={doc.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => onSelect(doc.id)}
              className="text-left rounded-2xl p-5 border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 flex flex-col gap-4"
              style={{
                borderColor: isSelected ? "#2563EB" : "#E2E8F0",
                background: isSelected ? "#EFF6FF" : "#FFFFFF",
                boxShadow: isSelected
                  ? "0 0 0 4px rgba(37,99,235,0.08)"
                  : "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0 rounded-full overflow-hidden">
                  {getDoctorAvatar(doc.name)}
                </div>

                <div className="min-w-0">
                  <p
                    className="font-semibold text-sm leading-tight"
                    style={{ color: isSelected ? "#1D4ED8" : "#1E293B" }}
                  >
                    {doc.name}
                  </p>
                  <span
                    className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: isSelected ? "#DBEAFE" : "#F1F5F9",
                      color: isSelected ? "#1D4ED8" : "#64748B",
                    }}
                  >
                    {doc.specialty}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">{doc.bio}</p>

              {isSelected && (
                <div className="flex items-center gap-1.5 text-blue-600">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M4 7l2.5 2.5L10 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xs font-semibold">Selected</span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to clinics
      </button>
    </div>
  );
}

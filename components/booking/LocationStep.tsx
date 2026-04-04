"use client";

import { motion } from "framer-motion";
import { LOCATIONS } from "@/lib/data";

interface Props {
  selected: string;
  onSelect: (locationId: string) => void;
}

function NYCSkyline() {
  return (
    <svg viewBox="0 0 72 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="48">
      <rect x="4" y="28" width="6" height="20" rx="1" fill="#2563EB" opacity="0.5" />
      <rect x="12" y="20" width="7" height="28" rx="1" fill="#2563EB" opacity="0.7" />
      <rect x="21" y="10" width="10" height="38" rx="1" fill="#2563EB" opacity="0.9" />
      <rect x="24" y="4" width="4" height="10" rx="1" fill="#2563EB" />
      <rect x="33" y="18" width="8" height="30" rx="1" fill="#2563EB" opacity="0.8" />
      <rect x="43" y="14" width="9" height="34" rx="1" fill="#2563EB" opacity="0.95" />
      <rect x="46" y="6" width="3" height="12" rx="1" fill="#2563EB" />
      <rect x="54" y="24" width="7" height="24" rx="1" fill="#2563EB" opacity="0.6" />
      <rect x="63" y="30" width="5" height="18" rx="1" fill="#2563EB" opacity="0.4" />
      <rect x="0" y="46" width="72" height="2" rx="1" fill="#2563EB" opacity="0.2" />
    </svg>
  );
}

function LASkyline() {
  return (
    <svg viewBox="0 0 72 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="48">
      {/* Hills */}
      <path d="M0 38 Q18 22 36 30 Q54 18 72 28 L72 48 L0 48Z" fill="#2563EB" opacity="0.12" />
      <path d="M0 42 Q12 32 24 36 Q36 28 48 34 Q60 26 72 32 L72 48 L0 48Z" fill="#2563EB" opacity="0.2" />
      {/* Palm trunk */}
      <rect x="34" y="30" width="4" height="18" rx="2" fill="#2563EB" opacity="0.7" />
      {/* Palm fronds */}
      <path d="M36 30 Q20 22 14 14" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <path d="M36 30 Q52 22 58 14" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <path d="M36 30 Q22 28 12 30" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M36 30 Q50 28 60 30" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M36 30 Q28 20 26 10" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M36 30 Q44 20 46 10" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      {/* Sun */}
      <circle cx="58" cy="12" r="6" fill="#2563EB" opacity="0.25" />
      <circle cx="58" cy="12" r="3.5" fill="#2563EB" opacity="0.5" />
    </svg>
  );
}

function ChicagoSkyline() {
  return (
    <svg viewBox="0 0 72 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="48">
      <rect x="3" y="34" width="7" height="14" rx="1" fill="#2563EB" opacity="0.45" />
      <rect x="12" y="26" width="8" height="22" rx="1" fill="#2563EB" opacity="0.65" />
      <rect x="22" y="8" width="13" height="40" rx="1" fill="#2563EB" opacity="0.95" />
      <rect x="26" y="2" width="5" height="10" rx="1" fill="#2563EB" />
      <rect x="28" y="0" width="2" height="5" rx="1" fill="#2563EB" />
      <rect x="37" y="18" width="10" height="30" rx="1" fill="#2563EB" opacity="0.85" />
      <rect x="40" y="12" width="4" height="9" rx="1" fill="#2563EB" opacity="0.85" />
      <rect x="49" y="22" width="9" height="26" rx="1" fill="#2563EB" opacity="0.7" />
      <rect x="60" y="30" width="7" height="18" rx="1" fill="#2563EB" opacity="0.5" />
      {/* Water reflection */}
      <rect x="0" y="46" width="72" height="2" rx="1" fill="#2563EB" opacity="0.15" />
      <path d="M0 46 Q36 43 72 46" stroke="#2563EB" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

const CITY_ILLUSTRATIONS = [NYCSkyline, LASkyline, ChicagoSkyline];

export default function LocationStep({ selected, onSelect }: Props) {
  return (
    <div>
      <h2
        className="font-heading font-bold text-white mb-1.5"
        style={{ fontSize: 26, letterSpacing: "-0.02em" }}
      >
        Choose your clinic
      </h2>
      <p className="text-sm mb-8" style={{ color: "#64748B" }}>
        Select the location most convenient for you.
      </p>

      <div className="grid gap-3">
        {LOCATIONS.map((loc, i) => {
          const isSelected = selected === loc.id;
          const Illustration = CITY_ILLUSTRATIONS[i];

          return (
            <motion.button
              key={loc.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              onClick={() => onSelect(loc.id)}
              className="w-full text-left rounded-2xl p-5 flex items-center gap-5 focus:outline-none"
              style={{
                background: isSelected
                  ? "rgba(37,99,235,0.12)"
                  : "#161616",
                border: isSelected
                  ? "1.5px solid #2563EB"
                  : "1.5px solid rgba(255,255,255,0.07)",
                boxShadow: isSelected
                  ? "0 0 0 4px rgba(37,99,235,0.12), 0 8px 24px rgba(37,99,235,0.08)"
                  : "0 2px 8px rgba(0,0,0,0.3)",
                transition: "all 0.18s ease",
              }}
            >
              {/* City illustration */}
              <div
                className="flex-shrink-0 w-20 h-14 rounded-xl flex items-end justify-center overflow-hidden pb-1"
                style={{
                  background: isSelected
                    ? "rgba(37,99,235,0.1)"
                    : "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <Illustration />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="font-heading font-semibold text-sm"
                    style={{ color: isSelected ? "#FFFFFF" : "#E2E8F0" }}
                  >
                    {loc.name}
                  </span>
                  {isSelected && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: "#2563EB", color: "#FFFFFF", fontSize: 10 }}
                    >
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-xs truncate" style={{ color: "#64748B" }}>{loc.address}</p>
                <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{loc.district}</p>
              </div>

              {/* Arrow */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                className="flex-shrink-0"
              >
                <path
                  d="M4 9h10M10 5l4 4-4 4"
                  stroke={isSelected ? "#2563EB" : "rgba(255,255,255,0.2)"}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

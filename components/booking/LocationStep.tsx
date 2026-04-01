"use client";

import { motion } from "framer-motion";
import { LOCATIONS } from "@/lib/data";

interface Props {
  selected: string;
  onSelect: (locationId: string) => void;
}

export default function LocationStep({ selected, onSelect }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Choose a clinic</h2>
      <p className="text-slate-500 text-sm mb-8">
        Select the Oslo clinic most convenient for you.
      </p>

      <div className="grid gap-4">
        {LOCATIONS.map((loc, i) => {
          const isSelected = selected === loc.id;
          return (
            <motion.button
              key={loc.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => onSelect(loc.id)}
              className="w-full text-left rounded-2xl p-5 border-2 transition-all duration-200 flex items-center gap-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              style={{
                borderColor: isSelected ? "#2563EB" : "#E2E8F0",
                background: isSelected ? "#EFF6FF" : "#FFFFFF",
                boxShadow: isSelected
                  ? "0 0 0 4px rgba(37,99,235,0.08)"
                  : "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              {/* Map pin icon */}
              <div
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: isSelected ? "#DBEAFE" : "#F1F5F9" }}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path
                    d="M11 2C7.686 2 5 4.686 5 8c0 5.25 6 12 6 12s6-6.75 6-12c0-3.314-2.686-6-6-6zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
                    fill={isSelected ? "#2563EB" : "#94A3B8"}
                  />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="font-semibold text-base"
                    style={{ color: isSelected ? "#1D4ED8" : "#1E293B" }}
                  >
                    {loc.name}
                  </span>
                  {isSelected && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-medium">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500">{loc.address}</p>
                <p className="text-xs text-slate-400 mt-0.5">{loc.district}, Oslo</p>
              </div>

              {/* Arrow */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="flex-shrink-0"
              >
                <path
                  d="M5 10h10M11 6l4 4-4 4"
                  stroke={isSelected ? "#2563EB" : "#CBD5E1"}
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

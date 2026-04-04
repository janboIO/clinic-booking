"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TimeSlot } from "@/lib/types";

interface Props {
  doctorId: string;
  selectedDate: string;
  selectedTime: string;
  onSelect: (date: string, time: string) => void;
  onBack: () => void;
}

const COL_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const FULL_DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function colIndex(jsDay: number): number {
  return (jsDay + 6) % 7;
}

function buildCells(year: number, month: number): (string | null)[] {
  const firstDow = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = Array(colIndex(firstDow)).fill(null);
  for (let d = 1; d <= totalDays; d++) cells.push(toIso(new Date(year, month, d)));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

type DateStatus = "past" | "out-of-range" | "loading" | "available" | "full";

export default function CalendarStep({ doctorId, selectedDate, selectedTime, onSelect, onBack }: Props) {
  const now = new Date();
  const todayIso = toIso(now);

  const maxDate = new Date(now);
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxIso = toIso(maxDate);

  const initDate = selectedDate ? new Date(selectedDate + "T00:00:00") : now;
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());

  const [statusMap, setStatusMap] = useState<Record<string, DateStatus>>({});
  const [activeDate, setActiveDate] = useState<string>(selectedDate);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    const cells = buildCells(viewYear, viewMonth);
    const initial: Record<string, DateStatus> = {};

    cells.forEach((iso) => {
      if (!iso) return;
      if (iso <= todayIso) { initial[iso] = "past"; return; }
      if (iso > maxIso) { initial[iso] = "out-of-range"; return; }
      initial[iso] = "loading";
    });
    setStatusMap(initial);

    const toFetch = (cells.filter(Boolean) as string[]).filter((iso) => initial[iso] === "loading");
    toFetch.forEach(async (iso) => {
      try {
        const res = await fetch(`/api/availability?doctorId=${doctorId}&date=${iso}`);
        const data: TimeSlot[] = await res.json();
        const hasAvailable = data.some((s) => s.available);
        setStatusMap((prev) => ({ ...prev, [iso]: hasAvailable ? "available" : "full" }));
      } catch {
        setStatusMap((prev) => ({ ...prev, [iso]: "available" }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewYear, viewMonth, doctorId]);

  const fetchSlots = useCallback(
    async (date: string) => {
      setSlotsLoading(true);
      try {
        const res = await fetch(`/api/availability?doctorId=${doctorId}&date=${date}`);
        const data: TimeSlot[] = await res.json();
        setSlots(data);
      } catch {
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    },
    [doctorId]
  );

  useEffect(() => {
    if (activeDate) fetchSlots(activeDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  const handleDayClick = (iso: string) => {
    const s = statusMap[iso];
    if (!s || s === "past" || s === "out-of-range" || s === "full" || s === "loading") return;
    setActiveDate(iso);
    fetchSlots(iso);
  };

  const canGoPrev = !(viewYear === now.getFullYear() && viewMonth === now.getMonth());
  const canGoNext =
    viewYear < maxDate.getFullYear() ||
    (viewYear === maxDate.getFullYear() && viewMonth < maxDate.getMonth());

  const goToPrev = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };

  const goToNext = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };

  const cells = buildCells(viewYear, viewMonth);

  const formatDate = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    return `${FULL_DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
  };

  return (
    <div>
      <h2
        className="font-heading font-bold text-white mb-1.5"
        style={{ fontSize: 26, letterSpacing: "-0.02em" }}
      >
        Pick a date &amp; time
      </h2>
      <p className="text-sm mb-6" style={{ color: "#64748B" }}>
        Select an available date, then choose a time slot.
      </p>

      {/* Calendar */}
      <div
        className="rounded-2xl overflow-hidden mb-6"
        style={{ border: "1px solid rgba(255,255,255,0.07)", background: "#161616" }}
      >
        {/* Month navigation */}
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={goToPrev}
            disabled={!canGoPrev}
            aria-label="Previous month"
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors focus:outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              opacity: canGoPrev ? 1 : 0.2,
              cursor: canGoPrev ? "pointer" : "default",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 11L5 7l4-4" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <span className="text-sm font-semibold text-white tabular-nums">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>

          <button
            onClick={goToNext}
            disabled={!canGoNext}
            aria-label="Next month"
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors focus:outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              opacity: canGoNext ? 1 : 0.2,
              cursor: canGoNext ? "pointer" : "default",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M5 3l4 4-4 4" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Column headers */}
        <div
          className="grid grid-cols-7"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}
        >
          {COL_HEADERS.map((h) => (
            <div
              key={h}
              className="py-2.5 text-center text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#334155" }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Date cells */}
        <div className="grid grid-cols-7">
          {cells.map((iso, i) => {
            if (!iso) {
              return <div key={`pad-${i}`} className="h-10" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }} />;
            }

            const status = statusMap[iso] ?? "loading";
            const isSelected = iso === activeDate;
            const isToday = iso === todayIso;
            const isDisabled =
              status === "past" ||
              status === "out-of-range" ||
              status === "full" ||
              status === "loading";
            const dateNum = parseInt(iso.slice(8), 10);

            const textColor = isSelected
              ? "#FFFFFF"
              : status === "past" || status === "out-of-range"
              ? "rgba(255,255,255,0.12)"
              : status === "full"
              ? "rgba(255,255,255,0.2)"
              : status === "loading"
              ? "transparent"
              : "#E2E8F0";

            return (
              <button
                key={iso}
                onClick={() => handleDayClick(iso)}
                disabled={isDisabled}
                aria-label={`${iso}${isDisabled ? ", unavailable" : ""}`}
                aria-pressed={isSelected}
                className="relative h-10 flex items-center justify-center text-sm font-medium focus:outline-none transition-colors duration-100"
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.03)",
                  background: isSelected ? "#2563EB" : "transparent",
                  color: textColor,
                  cursor: isDisabled ? "default" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isDisabled && !isSelected) {
                    e.currentTarget.style.background = "rgba(37,99,235,0.12)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "transparent";
                }}
              >
                {/* Today ring */}
                {isToday && !isSelected && (
                  <span
                    className="absolute inset-1 rounded-full pointer-events-none"
                    style={{ border: "1.5px solid #2563EB" }}
                    aria-hidden="true"
                  />
                )}
                {/* Available dot */}
                {status === "available" && !isSelected && (
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full pointer-events-none"
                    style={{ background: "#2563EB", boxShadow: "0 0 4px #2563EB" }}
                    aria-hidden="true"
                  />
                )}
                {/* Loading shimmer */}
                {status === "loading" && (
                  <span
                    className="absolute inset-1.5 rounded-md animate-pulse pointer-events-none"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{dateNum}</span>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div
          className="flex items-center gap-5 px-5 py-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}
        >
          <span className="flex items-center gap-1.5 text-xs" style={{ color: "#475569" }}>
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: "#2563EB", boxShadow: "0 0 4px #2563EB" }}
              aria-hidden="true"
            />
            Available
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: "#475569" }}>
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: "rgba(255,255,255,0.15)" }}
              aria-hidden="true"
            />
            Fully booked
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: "#475569" }}>
            <span
              className="w-3.5 h-3.5 rounded-full inline-block"
              style={{ border: "1.5px solid #2563EB" }}
              aria-hidden="true"
            />
            Today
          </span>
        </div>
      </div>

      {/* Time slots */}
      {activeDate && (
        <div className="mb-6">
          <p className="text-sm font-semibold text-white mb-3">{formatDate(activeDate)}</p>

          {slotsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div
                className="w-6 h-6 rounded-full border-2 animate-spin"
                style={{ borderColor: "rgba(37,99,235,0.2)", borderTopColor: "#2563EB" }}
              />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDate}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-4 sm:grid-cols-6 gap-2"
              >
                {slots.map((slot) => {
                  const isSelected = slot.time === selectedTime && activeDate === selectedDate;
                  const isUnavailable = !slot.available;
                  return (
                    <motion.button
                      key={slot.time}
                      disabled={isUnavailable}
                      onClick={() => onSelect(activeDate, slot.time)}
                      whileTap={!isUnavailable ? { scale: 0.95 } : {}}
                      className="py-2 rounded-xl text-sm font-medium focus:outline-none transition-all duration-100"
                      style={{
                        background: isSelected
                          ? "#2563EB"
                          : isUnavailable
                          ? "rgba(255,255,255,0.02)"
                          : "rgba(37,99,235,0.1)",
                        color: isSelected
                          ? "#FFFFFF"
                          : isUnavailable
                          ? "rgba(255,255,255,0.15)"
                          : "#60A5FA",
                        textDecoration: isUnavailable ? "line-through" : "none",
                        cursor: isUnavailable ? "not-allowed" : "pointer",
                        border: `1.5px solid ${
                          isSelected
                            ? "#2563EB"
                            : isUnavailable
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(37,99,235,0.25)"
                        }`,
                        boxShadow: isSelected ? "0 4px 12px rgba(37,99,235,0.4)" : "none",
                      }}
                    >
                      {slot.time}
                    </motion.button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}

      {/* Selected summary */}
      {selectedDate && selectedTime && (
        <div
          className="mb-6 px-4 py-3 rounded-xl flex items-center gap-3 text-sm"
          style={{
            background: "rgba(37,99,235,0.1)",
            border: "1px solid rgba(37,99,235,0.25)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="#2563EB" strokeWidth="1.5" />
            <path d="M5 8l2.5 2.5L11 5.5" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ color: "#93C5FD" }} className="font-medium">
            {selectedDate} at {selectedTime}
          </span>
        </div>
      )}

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm transition-colors"
        style={{ color: "#475569" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#94A3B8")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <path d="M12 7.5H3M7 3.5l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to doctors
      </button>
    </div>
  );
}

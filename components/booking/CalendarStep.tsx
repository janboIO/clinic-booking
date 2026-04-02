"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import type { TimeSlot } from "@/lib/types";

interface Props {
  doctorId: string;
  selectedDate: string;
  selectedTime: string;
  onSelect: (date: string, time: string) => void;
  onBack: () => void;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getNext14Weekdays(): Date[] {
  const days: Date[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 1); // start from tomorrow

  while (days.length < 14) {
    const dow = cursor.getDay();
    if (dow !== 0 && dow !== 6) {
      days.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function CalendarStep({
  doctorId,
  selectedDate,
  selectedTime,
  onSelect,
  onBack,
}: Props) {
  const [activeDate, setActiveDate] = useState<string>(selectedDate);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const weekdays = getNext14Weekdays();

  const fetchSlots = useCallback(
    async (date: string) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/availability?doctorId=${doctorId}&date=${date}`);
        const data: TimeSlot[] = await res.json();
        setSlots(data);
      } catch {
        setSlots([]);
      } finally {
        setLoading(false);
      }
    },
    [doctorId]
  );

  useEffect(() => {
    const initial = activeDate || toIso(weekdays[0]);
    setActiveDate(initial);
    fetchSlots(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  const handleDayClick = (iso: string) => {
    setActiveDate(iso);
    fetchSlots(iso);
  };

  const handleSlotClick = (time: string) => {
    onSelect(activeDate, time);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Pick a date &amp; time</h2>
      <p className="text-slate-500 text-sm mb-6">Available slots are shown in blue.</p>

      {/* Day picker */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
        {weekdays.map((day) => {
          const iso = toIso(day);
          const isActive = iso === activeDate;
          return (
            <button
              key={iso}
              onClick={() => handleDayClick(iso)}
              className="flex-shrink-0 flex flex-col items-center w-14 py-2.5 rounded-xl border-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              style={{
                borderColor: isActive ? "#2563EB" : "#E2E8F0",
                background: isActive ? "#2563EB" : "#FFFFFF",
              }}
            >
              <span
                className="text-xs font-medium"
                style={{ color: isActive ? "rgba(255,255,255,0.8)" : "#94A3B8" }}
              >
                {DAY_NAMES[day.getDay()]}
              </span>
              <span
                className="text-lg font-bold leading-tight"
                style={{ color: isActive ? "#FFFFFF" : "#1E293B" }}
              >
                {day.getDate()}
              </span>
              <span
                className="text-xs"
                style={{ color: isActive ? "rgba(255,255,255,0.7)" : "#94A3B8" }}
              >
                {MONTH_NAMES[day.getMonth()]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Time slots */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        <motion.div
          key={activeDate}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-8"
        >
          {slots.map((slot) => {
            const isSelected = slot.time === selectedTime && activeDate === selectedDate;
            const isUnavailable = !slot.available;

            return (
              <button
                key={slot.time}
                disabled={isUnavailable}
                onClick={() => handleSlotClick(slot.time)}
                className="py-2 rounded-xl text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                style={{
                  background: isSelected
                    ? "#1D4ED8"
                    : isUnavailable
                    ? "#F1F5F9"
                    : "#EFF6FF",
                  color: isSelected
                    ? "#FFFFFF"
                    : isUnavailable
                    ? "#CBD5E1"
                    : "#2563EB",
                  textDecoration: isUnavailable ? "line-through" : "none",
                  cursor: isUnavailable ? "not-allowed" : "pointer",
                  border: `1.5px solid ${
                    isSelected
                      ? "#1D4ED8"
                      : isUnavailable
                      ? "#E2E8F0"
                      : "#BFDBFE"
                  }`,
                }}
              >
                {slot.time}
              </button>
            );
          })}
        </motion.div>
      )}

      {selectedDate && selectedTime && (
        <div
          className="mb-6 px-4 py-3 rounded-xl flex items-center gap-3 text-sm"
          style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="#2563EB" strokeWidth="1.5" />
            <path d="M5 8l2.5 2.5L11 5.5" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-blue-700 font-medium">
            Selected: {selectedDate} at {selectedTime}
          </span>
        </div>
      )}

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to doctors
      </button>
    </div>
  );
}

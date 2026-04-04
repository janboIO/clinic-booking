"use client";

import { useState } from "react";
import type { Booking } from "@/lib/types";
import { getDoctorById, getLocationById } from "@/lib/data";

interface Props {
  bookings: Booking[];
  onConfirm: (id: number) => void;
  onCancel: (id: number) => void;
  onReschedule: (id: number, date: string, time: string) => void;
  filterDoctor: string;
  filterLocation: string;
}

const STATUS_STYLES: Record<Booking["status"], { bg: string; color: string; dot: string; label: string }> = {
  pending:   { bg: "rgba(234,179,8,0.1)",  color: "#FBBF24", dot: "#FBBF24", label: "Pending" },
  confirmed: { bg: "rgba(34,197,94,0.1)",  color: "#4ade80", dot: "#4ade80", label: "Confirmed" },
  cancelled: { bg: "rgba(239,68,68,0.08)", color: "#F87171", dot: "#F87171", label: "Cancelled" },
};

function RescheduleModal({
  booking,
  onClose,
  onSave,
}: {
  booking: Booking;
  onClose: () => void;
  onSave: (date: string, time: string) => void;
}) {
  const [date, setDate] = useState(booking.date);
  const [time, setTime] = useState(booking.time);

  const inputStyle: React.CSSProperties = {
    background: "#0A0A0A",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    color: "#FFFFFF",
    fontSize: 14,
    padding: "10px 14px",
    width: "100%",
    outline: "none",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-heading font-bold text-white mb-1" style={{ fontSize: 18 }}>Reschedule</h3>
        <p className="text-sm mb-5" style={{ color: "#475569" }}>{booking.patientName}</p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#64748B" }}>New date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563EB";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#64748B" }}>New time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              step={1800}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563EB";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "#94A3B8",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(date, time)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: "#2563EB",
              boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookingsList({
  bookings,
  onConfirm,
  onCancel,
  onReschedule,
  filterDoctor,
  filterLocation,
}: Props) {
  const [rescheduleTarget, setRescheduleTarget] = useState<Booking | null>(null);

  const filtered = bookings.filter((b) => {
    if (filterDoctor && b.doctorId !== filterDoctor) return false;
    if (filterLocation && b.locationId !== filterLocation) return false;
    return true;
  });

  return (
    <>
      {rescheduleTarget && (
        <RescheduleModal
          booking={rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
          onSave={(date, time) => {
            onReschedule(rescheduleTarget.id, date, time);
            setRescheduleTarget(null);
          }}
        />
      )}

      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-center py-12 text-sm" style={{ color: "#334155" }}>
            No bookings match the current filter.
          </p>
        )}
        {filtered.map((b) => {
          const doc = getDoctorById(b.doctorId);
          const loc = getLocationById(b.locationId);
          const st = STATUS_STYLES[b.status];

          return (
            <div
              key={b.id}
              className="rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-150"
              style={{
                background: "#111111",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
              }}
            >
              {/* Patient info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-sm" style={{ color: "#E2E8F0" }}>
                    {b.patientName}
                  </span>
                  {/* Status badge */}
                  <span
                    className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: st.bg, color: st.color }}
                  >
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{ background: st.dot, boxShadow: `0 0 4px ${st.dot}` }}
                    />
                    {st.label}
                  </span>
                </div>
                <p className="text-xs" style={{ color: "#475569" }}>
                  {doc?.name ?? b.doctorId} · {loc?.name ?? b.locationId}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#334155" }}>
                  {b.date} at {b.time}
                </p>
                {b.reason && (
                  <p className="text-xs mt-1 italic truncate" style={{ color: "#334155" }}>
                    &ldquo;{b.reason}&rdquo;
                  </p>
                )}
              </div>

              {/* Actions */}
              {b.status !== "cancelled" && (
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  {b.status === "pending" && (
                    <button
                      onClick={() => onConfirm(b.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
                      style={{
                        background: "#2563EB",
                        boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#1D4ED8")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#2563EB")}
                    >
                      Confirm
                    </button>
                  )}
                  <button
                    onClick={() => setRescheduleTarget(b)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#94A3B8",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#FFFFFF";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#94A3B8";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    }}
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => onCancel(b.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    style={{
                      background: "rgba(239,68,68,0.06)",
                      border: "1px solid rgba(239,68,68,0.12)",
                      color: "#F87171",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(239,68,68,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(239,68,68,0.06)";
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

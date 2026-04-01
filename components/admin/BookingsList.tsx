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

const STATUS_STYLES: Record<Booking["status"], { bg: string; text: string; label: string }> = {
  pending:   { bg: "#FEF9C3", text: "#854D0E", label: "Pending" },
  confirmed: { bg: "#DCFCE7", text: "#15803D", label: "Confirmed" },
  cancelled: { bg: "#FEE2E2", text: "#B91C1C", label: "Cancelled" },
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl p-6 shadow-xl"
        style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-bold text-slate-800 mb-1">Reschedule</h3>
        <p className="text-sm text-slate-500 mb-5">{booking.patientName}</p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">New date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm border text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{ border: "1.5px solid #E2E8F0" }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">New time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              step={1800}
              className="w-full px-3 py-2.5 rounded-xl text-sm border text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{ border: "1.5px solid #E2E8F0" }}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(date, time)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#2563EB" }}
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

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-center text-slate-400 py-12 text-sm">No bookings match the current filter.</p>
        )}
        {filtered.map((b) => {
          const doc = getDoctorById(b.doctorId);
          const loc = getLocationById(b.locationId);
          const st = STATUS_STYLES[b.status];

          return (
            <div
              key={b.id}
              className="rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}
            >
              {/* Patient + doctor */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-800 text-sm">{b.patientName}</span>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: st.bg, color: st.text }}
                  >
                    {st.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{doc?.name ?? b.doctorId} · {loc?.name ?? b.locationId}</p>
                <p className="text-xs text-slate-400">{b.date} at {b.time}</p>
                {b.reason && (
                  <p className="text-xs text-slate-500 mt-1 italic truncate">"{b.reason}"</p>
                )}
              </div>

              {/* Actions */}
              {b.status !== "cancelled" && (
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  {b.status === "pending" && (
                    <button
                      onClick={() => onConfirm(b.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                      style={{ background: "#2563EB" }}
                    >
                      Confirm
                    </button>
                  )}
                  <button
                    onClick={() => setRescheduleTarget(b)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => onCancel(b.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 border border-red-100 hover:bg-red-50"
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

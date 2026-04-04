"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Booking } from "@/lib/types";
import { getDoctorById, getLocationById } from "@/lib/data";

function AnimatedCheckmark() {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="mx-auto mb-8 flex items-center justify-center"
      style={{
        width: 96,
        height: 96,
        borderRadius: "50%",
        background: "rgba(37,99,235,0.12)",
        border: "2px solid rgba(37,99,235,0.3)",
        boxShadow: "0 0 40px rgba(37,99,235,0.2)",
      }}
    >
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <motion.path
          d="M8 22l9 9L36 12"
          stroke="#2563EB"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildGoogleCalendarLink(
  booking: Booking,
  doctorName: string,
  locationName: string
): string {
  const dateStr = booking.date.replace(/-/g, "");
  const [h, m] = booking.time.split(":").map(Number);
  const start = `${dateStr}T${String(h).padStart(2, "0")}${String(m).padStart(2, "0")}00`;
  const end = `${dateStr}T${String(h + 1).padStart(2, "0")}${String(m).padStart(2, "0")}00`;
  const text = encodeURIComponent(`Doctor Appointment — ${doctorName}`);
  const details = encodeURIComponent(`Appointment with ${doctorName}\nClinic: ${locationName}`);
  const loc = encodeURIComponent(locationName);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${loc}`;
}

function ConfirmationContent() {
  const params = useSearchParams();
  const id = params.get("id");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) { setError(true); setLoading(false); return; }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/bookings/${id}`);
        if (!res.ok) throw new Error();
        setBooking(await res.json());
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [id]);

  const doctor = booking ? getDoctorById(booking.doctorId) : undefined;
  const location = booking ? getLocationById(booking.locationId) : undefined;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div
          className="w-10 h-10 rounded-full border-4 animate-spin"
          style={{ borderColor: "rgba(37,99,235,0.15)", borderTopColor: "#2563EB" }}
        />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="text-center py-20">
        <p className="mb-4" style={{ color: "#64748B" }}>Unable to load booking details.</p>
        <Link href="/" className="font-medium hover:underline" style={{ color: "#2563EB" }}>
          Book a new appointment
        </Link>
      </div>
    );
  }

  const calendarLink = buildGoogleCalendarLink(
    booking,
    doctor?.name ?? booking.doctorId,
    location?.name ?? booking.locationId
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <AnimatedCheckmark />

      <div className="text-center mb-8">
        <h1
          className="font-heading font-bold text-white mb-2"
          style={{ fontSize: 30, letterSpacing: "-0.02em" }}
        >
          Booking Confirmed!
        </h1>
        <p className="text-sm" style={{ color: "#64748B" }}>
          A confirmation has been sent to{" "}
          <strong style={{ color: "#94A3B8" }}>{booking.patientEmail}</strong>
        </p>
      </div>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl p-6 mb-6"
        style={{
          background: "#161616",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-5"
          style={{ color: "#60A5FA" }}
        >
          Booking details
        </p>
        <div className="space-y-3">
          {[
            { label: "Patient", value: booking.patientName },
            { label: "Doctor", value: doctor?.name ?? booking.doctorId },
            { label: "Specialty", value: doctor?.specialty ?? "—" },
            { label: "Date", value: formatDate(booking.date) },
            { label: "Time", value: booking.time },
            { label: "Clinic", value: location?.name ?? booking.locationId },
            { label: "Address", value: location?.address ?? "—" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex justify-between text-sm pb-3 last:pb-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            >
              <span style={{ color: "#475569" }}>{label}</span>
              <span
                className="font-medium text-right max-w-[55%]"
                style={{ color: label === "Time" ? "#60A5FA" : "#E2E8F0" }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="flex flex-col gap-3"
      >
        <a
          href={calendarLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-150"
          style={{
            background: "rgba(37,99,235,0.1)",
            border: "1.5px solid rgba(37,99,235,0.25)",
            color: "#60A5FA",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(37,99,235,0.18)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(37,99,235,0.1)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M2 7h12" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          Add to Calendar
        </a>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors"
          style={{ color: "#475569" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#94A3B8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M12 7H2M6 3l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Book another appointment
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function ConfirmationPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: "#0F0F0F" }}
    >
      <Suspense
        fallback={
          <div
            className="w-10 h-10 rounded-full border-4 animate-spin"
            style={{ borderColor: "rgba(37,99,235,0.15)", borderTopColor: "#2563EB" }}
          />
        }
      >
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}

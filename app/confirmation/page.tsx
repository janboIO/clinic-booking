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
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="mx-auto mb-8 flex items-center justify-center"
      style={{
        width: 96,
        height: 96,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)",
        border: "3px solid #86EFAC",
      }}
    >
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <motion.path
          d="M8 22l9 9L36 12"
          stroke="#16A34A"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
          style={{ borderColor: "#DBEAFE", borderTopColor: "#2563EB" }}
        />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-600 mb-4">Unable to load booking details.</p>
        <Link href="/" className="text-blue-600 font-medium hover:underline">
          Book a new appointment
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <AnimatedCheckmark />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Booking Confirmed!</h1>
        <p className="text-slate-500 text-sm">
          A confirmation email has been sent to{" "}
          <strong className="text-slate-700">{booking.patientEmail}</strong>
        </p>
      </div>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl p-6 mb-8 shadow-sm"
        style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}
      >
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-4">
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
            { label: "Address", value: location ? `${location.address}, Oslo` : "—" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex justify-between text-sm border-b border-slate-100 pb-2 last:border-none last:pb-0"
            >
              <span className="text-slate-500">{label}</span>
              <span className="font-medium text-slate-800 text-right max-w-[55%]">{value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors"
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
      style={{ background: "linear-gradient(135deg, #F0FFF4 0%, #F8FAFF 60%, #EFF6FF 100%)" }}
    >
      <Suspense
        fallback={
          <div
            className="w-10 h-10 rounded-full border-4 animate-spin"
            style={{ borderColor: "#DBEAFE", borderTopColor: "#2563EB" }}
          />
        }
      >
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}

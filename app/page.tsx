"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import StepIndicator from "@/components/booking/StepIndicator";
import LocationStep from "@/components/booking/LocationStep";
import DoctorStep from "@/components/booking/DoctorStep";
import CalendarStep from "@/components/booking/CalendarStep";
import PatientStep from "@/components/booking/PatientStep";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import type { BookingFormData } from "@/lib/types";

type FormState = Partial<BookingFormData>;

const slideVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13.5 9.5A6 6 0 016.5 2.5a6 6 0 100 11 6 6 0 007-4z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BookingPage() {
  return (
    <ThemeProvider>
      <BookingContent />
    </ThemeProvider>
  );
}

function BookingContent() {
  const router = useRouter();
  const { mode, theme, toggle } = useTheme();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const merge = (partial: Partial<BookingFormData>) =>
    setForm((prev) => ({ ...prev, ...partial }));

  const handleLocationSelect = (locationId: string) => {
    merge({ locationId, doctorId: undefined });
    setStep(2);
  };

  const handleDoctorSelect = (doctorId: string) => {
    merge({ doctorId, date: undefined, time: undefined });
    setStep(3);
  };

  const handleSlotSelect = (date: string, time: string) => {
    merge({ date, time });
    setStep(4);
  };

  const handleSubmit = async (
    patient: Pick<BookingFormData, "patientName" | "patientPhone" | "patientEmail" | "reason">
  ) => {
    merge(patient);
    setIsSubmitting(true);
    try {
      const payload: BookingFormData = {
        ...(form as BookingFormData),
        ...patient,
      };
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Booking failed");
      const booking = await res.json();
      router.push(`/confirmation?id=${booking.id}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 px-6 py-4 flex items-center gap-3"
        style={{
          background: theme.headerBg,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${theme.headerBorder}`,
        }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#2563EB" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2v14M2 9h14" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <span
            className="font-heading font-bold text-sm leading-none tracking-tight"
            style={{ color: theme.textPrimary }}
          >
            US Health Clinic
          </span>
          <p className="text-xs mt-0.5" style={{ color: theme.textDimmed }}>Online Booking</p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: "0 0 6px #4ade80" }} />
          <span className="text-xs" style={{ color: theme.textMuted }}>Available now</span>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            boxShadow: theme.cardShadow,
          }}
        >
          {/* Step indicator bar */}
          <div
            className="px-8 pt-8 pb-6 relative"
            style={{ borderBottom: `1px solid ${theme.cardHeaderBorder}` }}
          >
            <StepIndicator currentStep={step} />

            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="absolute top-6 right-6 w-8 h-8 rounded-lg flex items-center justify-center transition-colors focus:outline-none"
              style={{
                background: theme.toggleBg,
                border: `1px solid ${theme.toggleBorder}`,
                color: theme.toggleIconColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#2563EB";
                e.currentTarget.style.borderColor = "rgba(37,99,235,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.toggleIconColor;
                e.currentTarget.style.borderColor = theme.toggleBorder;
              }}
            >
              {mode === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>

          {/* Step content */}
          <div className="px-8 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {step === 1 && (
                  <LocationStep
                    selected={form.locationId ?? ""}
                    onSelect={handleLocationSelect}
                  />
                )}
                {step === 2 && form.locationId && (
                  <DoctorStep
                    locationId={form.locationId}
                    selected={form.doctorId ?? ""}
                    onSelect={handleDoctorSelect}
                    onBack={() => setStep(1)}
                  />
                )}
                {step === 3 && form.doctorId && (
                  <CalendarStep
                    doctorId={form.doctorId}
                    selectedDate={form.date ?? ""}
                    selectedTime={form.time ?? ""}
                    onSelect={handleSlotSelect}
                    onBack={() => setStep(2)}
                  />
                )}
                {step === 4 && (
                  <PatientStep
                    formData={form}
                    onSubmit={handleSubmit}
                    onBack={() => setStep(3)}
                    isSubmitting={isSubmitting}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: theme.footerText }}>
          US Health Clinic Network · HIPAA compliant · Secure &amp; private
        </p>
      </main>
    </div>
  );
}

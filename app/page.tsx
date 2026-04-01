"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import StepIndicator from "@/components/booking/StepIndicator";
import LocationStep from "@/components/booking/LocationStep";
import DoctorStep from "@/components/booking/DoctorStep";
import CalendarStep from "@/components/booking/CalendarStep";
import PatientStep from "@/components/booking/PatientStep";
import type { BookingFormData } from "@/lib/types";

type FormState = Partial<BookingFormData>;

const slideVariants = {
  enter: { opacity: 0, x: 32 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -32 },
};

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const merge = (partial: Partial<BookingFormData>) =>
    setForm((prev) => ({ ...prev, ...partial }));

  // Step 1 → 2: location selected
  const handleLocationSelect = (locationId: string) => {
    merge({ locationId, doctorId: undefined });
    setStep(2);
  };

  // Step 2 → 3: doctor selected
  const handleDoctorSelect = (doctorId: string) => {
    merge({ doctorId, date: undefined, time: undefined });
    setStep(3);
  };

  // Step 3 → 4: date+time selected
  const handleSlotSelect = (date: string, time: string) => {
    merge({ date, time });
    setStep(4);
  };

  // Step 4: submit
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
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #F8FAFF 50%, #F0F9FF 100%)" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 px-6 py-4 flex items-center gap-3"
        style={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "#2563EB" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <span className="font-bold text-slate-800 text-sm leading-none">Oslo Clinic</span>
          <p className="text-xs text-slate-400">Online Booking</p>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div
          className="rounded-3xl p-8 shadow-lg"
          style={{
            background: "rgba(255,255,255,0.95)",
            border: "1px solid #E2E8F0",
            backdropFilter: "blur(8px)",
          }}
        >
          <StepIndicator currentStep={step} />

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeOut" }}
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

        <p className="text-center text-xs text-slate-400 mt-6">
          Oslo Clinic Network · Secure, private, GDPR-compliant
        </p>
      </main>
    </div>
  );
}

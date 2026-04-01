"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { BookingFormData } from "@/lib/types";
import { getDoctorById, getLocationById } from "@/lib/data";

interface Props {
  formData: Partial<BookingFormData>;
  onSubmit: (data: Pick<BookingFormData, "patientName" | "patientPhone" | "patientEmail" | "reason">) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  as,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  as?: "textarea";
}) {
  const base =
    "w-full px-4 py-3 rounded-xl border text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all";
  const style = { border: "1.5px solid #E2E8F0", background: "#FFFFFF" };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {as === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={3}
          className={base}
          style={style}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={base}
          style={style}
        />
      )}
    </div>
  );
}

export default function PatientStep({ formData, onSubmit, onBack, isSubmitting }: Props) {
  const [name, setName] = useState(formData.patientName ?? "");
  const [phone, setPhone] = useState(formData.patientPhone ?? "");
  const [email, setEmail] = useState(formData.patientEmail ?? "");
  const [reason, setReason] = useState(formData.reason ?? "");

  const doctor = formData.doctorId ? getDoctorById(formData.doctorId) : undefined;
  const location = formData.locationId ? getLocationById(formData.locationId) : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ patientName: name, patientPhone: phone, patientEmail: email, reason });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Your details</h2>
      <p className="text-slate-500 text-sm mb-6">Review your booking and enter your contact information.</p>

      {/* Booking summary */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 mb-8"
        style={{ background: "#EFF6FF", border: "1.5px solid #BFDBFE" }}
      >
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">Booking summary</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-slate-500 text-xs mb-0.5">Clinic</p>
            <p className="font-medium text-slate-800">{location?.name ?? "—"}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-0.5">Doctor</p>
            <p className="font-medium text-slate-800">{doctor?.name ?? "—"}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-0.5">Date</p>
            <p className="font-medium text-slate-800">{formData.date ?? "—"}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-0.5">Time</p>
            <p className="font-bold text-blue-600">{formData.time ?? "—"}</p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field
          label="Full name"
          id="name"
          value={name}
          onChange={setName}
          placeholder="e.g. Emma Larsen"
          required
        />
        <Field
          label="Phone number"
          id="phone"
          type="tel"
          value={phone}
          onChange={setPhone}
          placeholder="+47 90 00 00 00"
          required
        />
        <Field
          label="Email address"
          id="email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          required
        />
        <Field
          label="Reason for visit"
          id="reason"
          as="textarea"
          value={reason}
          onChange={setReason}
          placeholder="Briefly describe why you are booking this appointment"
          required
        />

        <div className="flex items-center gap-4 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            style={{
              background: isSubmitting ? "#93C5FD" : "#2563EB",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              boxShadow: isSubmitting ? "none" : "0 4px 14px rgba(37,99,235,0.35)",
            }}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Confirming…
              </>
            ) : (
              "Confirm Booking"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

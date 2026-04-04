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
  const sharedStyle: React.CSSProperties = {
    background: "#111111",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    color: "#FFFFFF",
    fontSize: 14,
    padding: "12px 16px",
    width: "100%",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "#2563EB";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1.5" style={{ color: "#94A3B8" }}>
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      {as === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={3}
          style={{ ...sharedStyle, resize: "none" }}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          style={sharedStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
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

  const summaryRows = [
    { label: "Clinic", value: location?.name ?? "—" },
    { label: "Doctor", value: doctor?.name ?? "—" },
    { label: "Date", value: formData.date ?? "—" },
    { label: "Time", value: formData.time ?? "—" },
  ];

  return (
    <div>
      <h2
        className="font-heading font-bold text-white mb-1.5"
        style={{ fontSize: 26, letterSpacing: "-0.02em" }}
      >
        Your details
      </h2>
      <p className="text-sm mb-6" style={{ color: "#64748B" }}>
        Review your booking and enter your contact information.
      </p>

      {/* Booking summary */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 mb-8"
        style={{
          background: "rgba(37,99,235,0.08)",
          border: "1px solid rgba(37,99,235,0.2)",
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: "#60A5FA" }}
        >
          Booking summary
        </p>
        <div className="grid grid-cols-2 gap-3">
          {summaryRows.map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs mb-0.5" style={{ color: "#475569" }}>{label}</p>
              <p
                className="font-semibold text-sm"
                style={{ color: label === "Time" ? "#60A5FA" : "#E2E8F0" }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field
          label="Full name"
          id="name"
          value={name}
          onChange={setName}
          placeholder="e.g. John Smith"
          required
        />
        <Field
          label="Phone number"
          id="phone"
          type="tel"
          value={phone}
          onChange={setPhone}
          placeholder="+1 (555) 000-0000"
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
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: "#475569" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#94A3B8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M12 7.5H3M7 3.5l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none"
            style={{
              background: isSubmitting ? "rgba(37,99,235,0.5)" : "#2563EB",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              boxShadow: isSubmitting ? "none" : "0 6px 20px rgba(37,99,235,0.4)",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.currentTarget.style.background = "#1D4ED8";
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) e.currentTarget.style.background = "#2563EB";
            }}
          >
            {isSubmitting ? (
              <>
                <div
                  className="w-4 h-4 border-2 rounded-full animate-spin"
                  style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#FFFFFF" }}
                />
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

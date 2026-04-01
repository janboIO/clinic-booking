"use client";

import { motion } from "framer-motion";

const STEPS = ["Location", "Doctor", "Date & Time", "Your Details"];

interface Props {
  currentStep: number; // 1-indexed
}

export default function StepIndicator({ currentStep }: Props) {
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full mb-10">
      {/* Step circles */}
      <div className="flex items-center justify-between relative mb-3">
        {/* Background track */}
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-blue-100 z-0" />

        {/* Animated fill */}
        <div className="absolute left-0 top-5 h-0.5 bg-blue-500 z-0 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }} />

        {STEPS.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <div key={label} className="flex flex-col items-center z-10">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted
                    ? "#2563EB"
                    : isActive
                    ? "#2563EB"
                    : "#E2E8F0",
                  borderColor: isCompleted || isActive ? "#2563EB" : "#CBD5E1",
                }}
                transition={{ duration: 0.25 }}
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
              >
                {isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8l3.5 3.5L13 5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span
                    className="text-sm font-bold"
                    style={{ color: isActive ? "white" : "#94A3B8" }}
                  >
                    {stepNum}
                  </span>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex items-start justify-between">
        {STEPS.map((label, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;
          return (
            <div key={label} className="flex flex-col items-center" style={{ width: "25%" }}>
              <span
                className="text-xs font-medium text-center leading-tight"
                style={{
                  color: isActive ? "#2563EB" : isCompleted ? "#64748B" : "#94A3B8",
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1 bg-blue-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <p className="mt-2 text-xs text-slate-400 font-medium">
        Step {currentStep} of {STEPS.length}
      </p>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

const STEPS = ["Location", "Doctor", "Date & Time", "Your Details"];

interface Props {
  currentStep: number; // 1-indexed
}

export default function StepIndicator({ currentStep }: Props) {
  const { theme } = useTheme();

  return (
    <div className="w-full">
      <div className="flex items-center">
        {STEPS.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          const isLast = i === STEPS.length - 1;

          return (
            <div key={label} className="flex items-center" style={{ flex: isLast ? "none" : 1 }}>
              {/* Circle + label */}
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  initial={false}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isCompleted
                      ? "#2563EB"
                      : isActive
                      ? "rgba(37,99,235,0.15)"
                      : theme.stepInactiveBg,
                    border: isCompleted || isActive
                      ? "2px solid #2563EB"
                      : `2px solid ${theme.stepInactiveBorder}`,
                    boxShadow: isActive ? "0 0 16px rgba(37,99,235,0.35)" : "none",
                  }}
                >
                  {isCompleted ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M2.5 7l3 3 6-6"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span
                      className="text-xs font-bold"
                      style={{
                        color: isActive ? "#2563EB" : theme.stepInactiveText,
                      }}
                    >
                      {stepNum}
                    </span>
                  )}
                </motion.div>

                <span
                  className="text-xs font-medium whitespace-nowrap"
                  style={{
                    color: isActive
                      ? theme.stepLabelActive
                      : isCompleted
                      ? theme.stepLabelCompleted
                      : theme.stepLabelInactive,
                  }}
                >
                  {label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className="relative h-px mx-3 flex-1"
                  style={{ background: theme.connectorBg, marginBottom: 20 }}
                >
                  <motion.div
                    className="absolute inset-y-0 left-0 h-full"
                    style={{ background: "#2563EB" }}
                    initial={false}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

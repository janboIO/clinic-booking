"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Incorrect password. Try again.");
        return;
      }
      router.push("/admin/dashboard");
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0F0F0F" }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(37,99,235,0.06) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative w-full max-w-sm rounded-2xl p-8"
        style={{
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Icon */}
        <div
          className="mx-auto mb-6 w-14 h-14 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.2)" }}
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <rect x="3" y="11" width="20" height="13" rx="3" stroke="#2563EB" strokeWidth="1.7" />
            <path d="M8 11V7.5a5 5 0 0 1 10 0V11" stroke="#2563EB" strokeWidth="1.7" strokeLinecap="round" />
            <circle cx="13" cy="17.5" r="2" fill="#2563EB" />
          </svg>
        </div>

        <h1
          className="font-heading font-bold text-white text-center mb-1"
          style={{ fontSize: 22, letterSpacing: "-0.02em" }}
        >
          Admin Access
        </h1>
        <p className="text-sm text-center mb-8" style={{ color: "#475569" }}>
          Clinic Dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1.5"
              style={{ color: "#94A3B8" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              autoFocus
              style={{
                background: "#0A0A0A",
                border: "1.5px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                color: "#FFFFFF",
                fontSize: 14,
                padding: "12px 16px",
                width: "100%",
                outline: "none",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
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

          {error && (
            <p className="text-xs flex items-center gap-1.5" style={{ color: "#F87171" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1" />
                <path d="M6 3.5v3M6 8v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200"
            style={{
              background: loading ? "rgba(37,99,235,0.5)" : "#2563EB",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 6px 20px rgba(37,99,235,0.35)",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = "#1D4ED8";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.background = "#2563EB";
            }}
          >
            {loading ? "Verifying…" : "Enter Dashboard"}
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: "#334155" }}>
          Default password:{" "}
          <code
            className="px-1.5 py-0.5 rounded"
            style={{ background: "rgba(255,255,255,0.06)", color: "#64748B" }}
          >
            janbo2025
          </code>
        </p>
      </div>
    </div>
  );
}

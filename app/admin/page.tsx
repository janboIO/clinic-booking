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
      style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #F8FAFF 60%, #F0F9FF 100%)" }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-8 shadow-lg"
        style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}
      >
        {/* Icon */}
        <div className="mx-auto mb-6 w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "#EFF6FF" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="4" y="12" width="20" height="14" rx="3" stroke="#2563EB" strokeWidth="1.8" />
            <path d="M9 12V8a5 5 0 0 1 10 0v4" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="14" cy="19" r="2" fill="#2563EB" />
          </svg>
        </div>

        <h1 className="text-xl font-bold text-slate-800 text-center mb-1">Admin Access</h1>
        <p className="text-sm text-slate-500 text-center mb-7">Oslo Clinic Dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
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
              className="w-full px-4 py-3 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              style={{ border: "1.5px solid #E2E8F0", background: "#F8FAFF" }}
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1.5">
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
              background: loading ? "#93C5FD" : "#2563EB",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 14px rgba(37,99,235,0.3)",
            }}
          >
            {loading ? "Verifying…" : "Enter Dashboard"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Default password: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">janbo2025</code>
        </p>
      </div>
    </div>
  );
}

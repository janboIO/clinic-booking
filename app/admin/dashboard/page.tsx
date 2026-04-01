"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Booking } from "@/lib/types";
import { DOCTORS, LOCATIONS } from "@/lib/data";
import BookingsList from "@/components/admin/BookingsList";
import WeeklyBarChart from "@/components/admin/WeeklyBarChart";
import DoctorDonutChart from "@/components/admin/DoctorDonutChart";

const DOCTOR_COLORS = [
  "#4F46E5", "#7C3AED", "#0891B2", "#059669", "#D97706", "#DC2626",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getWeekDays(): string[] {
  const today = new Date("2026-04-01");
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

function isTodayIso(iso: string): boolean {
  return iso === "2026-04-01";
}

export default function AdminDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings");
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      setBookings(await res.json());
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleLogout = async () => {
    document.cookie = "admin_session=; Max-Age=0; path=/";
    router.push("/admin");
  };

  const handleConfirm = async (id: number) => {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "confirmed" }),
    });
    fetchBookings();
  };

  const handleCancel = async (id: number) => {
    if (!confirm("Cancel this appointment? The patient will be notified by email.")) return;
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    fetchBookings();
  };

  const handleReschedule = async (id: number, date: string, time: string) => {
    // Update via PATCH with a reschedule status reset to pending + new date/time
    // Since our API only patches status, we delete and re-create, or extend — here we just update status
    // For simplicity: PATCH the booking (we'll extend the API to support date/time)
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "pending", date, time }),
    });
    fetchBookings();
  };

  const todayCount = bookings.filter((b) => isTodayIso(b.date) && b.status !== "cancelled").length;

  // Chart data
  const weekDays = getWeekDays();
  const weekChartData = weekDays.map((iso) => {
    const dow = new Date(iso).getDay();
    return {
      day: DAY_NAMES[dow],
      count: bookings.filter((b) => b.date === iso && b.status !== "cancelled").length,
    };
  });

  const doctorChartData = DOCTORS.map((doc, i) => ({
    name: doc.name,
    count: bookings.filter((b) => b.doctorId === doc.id && b.status !== "cancelled").length,
    color: DOCTOR_COLORS[i % DOCTOR_COLORS.length],
  }));

  // Calendar view helpers
  const calendarBookings = bookings.filter(
    (b) =>
      weekDays.includes(b.date) &&
      b.status !== "cancelled" &&
      (!filterDoctor || b.doctorId === filterDoctor) &&
      (!filterLocation || b.locationId === filterLocation)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8FAFF" }}>
        <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFF" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#2563EB" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-slate-800 text-sm leading-none">Clinic Dashboard</span>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          Log out
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Today badge */}
        <div className="flex items-center gap-4">
          <div
            className="rounded-2xl px-6 py-4 flex items-center gap-4"
            style={{ background: "#EFF6FF", border: "1.5px solid #BFDBFE" }}
          >
            <div>
              <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-0.5">Today&apos;s bookings</p>
              <span className="text-5xl font-black text-blue-600">{todayCount}</span>
            </div>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "#DBEAFE" }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="3" y="5" width="16" height="14" rx="3" stroke="#2563EB" strokeWidth="1.6" />
                <path d="M7 2v4M15 2v4" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M3 10h16" stroke="#2563EB" strokeWidth="1.6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Controls: view toggle + filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View toggle */}
          <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid #E2E8F0", background: "#F8FAFF" }}>
            {(["list", "calendar"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="px-4 py-2 text-xs font-semibold capitalize transition-all"
                style={{
                  background: view === v ? "#2563EB" : "transparent",
                  color: view === v ? "#FFFFFF" : "#64748B",
                }}
              >
                {v === "list" ? "List View" : "Calendar"}
              </button>
            ))}
          </div>

          {/* Doctor filter */}
          <select
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">All doctors</option>
            {DOCTORS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>

          {/* Location filter */}
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">All locations</option>
            {LOCATIONS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>

          <span className="text-xs text-slate-400 ml-auto">
            {bookings.filter(b => b.status !== 'cancelled').length} active bookings
          </span>
        </div>

        {/* Main content */}
        {view === "list" ? (
          <BookingsList
            bookings={bookings}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onReschedule={handleReschedule}
            filterDoctor={filterDoctor}
            filterLocation={filterLocation}
          />
        ) : (
          /* Calendar view — week grid */
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid #E2E8F0", background: "#FFFFFF" }}
          >
            <div className="grid grid-cols-7">
              {weekDays.map((iso) => {
                const d = new Date(iso);
                const isToday = isTodayIso(iso);
                const dayBookings = calendarBookings.filter((b) => b.date === iso);
                return (
                  <div
                    key={iso}
                    className="border-r last:border-r-0 min-h-[160px]"
                    style={{ borderColor: "#F1F5F9" }}
                  >
                    {/* Day header */}
                    <div
                      className="px-2 py-2 text-center border-b"
                      style={{
                        borderColor: "#F1F5F9",
                        background: isToday ? "#EFF6FF" : "transparent",
                      }}
                    >
                      <p className="text-xs text-slate-400">{DAY_NAMES[d.getDay()]}</p>
                      <p
                        className="text-base font-bold"
                        style={{ color: isToday ? "#2563EB" : "#1E293B" }}
                      >
                        {d.getDate()}
                      </p>
                    </div>
                    {/* Bookings */}
                    <div className="p-1 space-y-1">
                      {dayBookings.slice(0, 5).map((b) => (
                        <div
                          key={b.id}
                          className="px-1.5 py-1 rounded text-xs truncate"
                          style={{
                            background: "#EFF6FF",
                            color: "#1D4ED8",
                            border: "1px solid #BFDBFE",
                          }}
                          title={`${b.time} — ${b.patientName}`}
                        >
                          {b.time} {b.patientName.split(" ")[0]}
                        </div>
                      ))}
                      {dayBookings.length > 5 && (
                        <p className="text-xs text-slate-400 px-1">+{dayBookings.length - 5} more</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <WeeklyBarChart data={weekChartData} />
          <DoctorDonutChart data={doctorChartData} />
        </div>

      </main>
    </div>
  );
}

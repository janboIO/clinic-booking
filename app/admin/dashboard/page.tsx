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

const NAV_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    id: "bookings",
    label: "Bookings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M2 7h12" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("overview");
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

  const handleLogout = () => {
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
    if (!confirm("Cancel this appointment?")) return;
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    fetchBookings();
  };

  const handleReschedule = async (id: number, date: string, time: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "pending", date, time }),
    });
    fetchBookings();
  };

  const todayCount = bookings.filter((b) => isTodayIso(b.date) && b.status !== "cancelled").length;
  const activeCount = bookings.filter((b) => b.status !== "cancelled").length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;

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

  const calendarBookings = bookings.filter(
    (b) =>
      weekDays.includes(b.date) &&
      b.status !== "cancelled" &&
      (!filterDoctor || b.doctorId === filterDoctor) &&
      (!filterLocation || b.locationId === filterLocation)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0F0F0F" }}>
        <div
          className="w-9 h-9 rounded-full border-2 animate-spin"
          style={{ borderColor: "rgba(37,99,235,0.15)", borderTopColor: "#2563EB" }}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#0F0F0F" }}>
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside
        className="fixed top-0 left-0 bottom-0 flex flex-col z-20"
        style={{
          width: 220,
          background: "#0A0A0A",
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 px-5 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "#2563EB" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="font-heading font-bold text-white text-xs leading-none">US Health</p>
            <p className="text-xs mt-0.5" style={{ color: "#334155", fontSize: 10 }}>Admin Dashboard</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-150"
                style={{
                  background: isActive ? "rgba(37,99,235,0.15)" : "transparent",
                  color: isActive ? "#60A5FA" : "#475569",
                  border: isActive ? "1px solid rgba(37,99,235,0.2)" : "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = "#94A3B8";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = "#475569";
                }}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mt-4 transition-all duration-150"
            style={{ color: "#475569" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#F87171";
              e.currentTarget.style.background = "rgba(248,113,113,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#475569";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M11 11l3-3-3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Log out
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────── */}
      <main
        className="flex-1 overflow-auto"
        style={{ marginLeft: 220 }}
      >
        {/* Top bar */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-8 py-4"
          style={{
            background: "rgba(15,15,15,0.9)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div>
            <h1
              className="font-heading font-bold text-white"
              style={{ fontSize: 20, letterSpacing: "-0.02em" }}
            >
              {activeNav === "overview" ? "Overview" : "Bookings"}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
              {new Date("2026-04-01").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: "0 0 6px #4ade80" }} />
            <span className="text-xs" style={{ color: "#475569" }}>Live</span>
          </div>
        </div>

        <div className="px-8 py-8 space-y-8">

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Today's Appointments", value: todayCount, color: "#2563EB" },
              { label: "Active Bookings", value: activeCount, color: "#059669" },
              { label: "Pending Review", value: pendingCount, color: "#D97706" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="rounded-2xl p-5"
                style={{
                  background: "#111111",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-xs mb-3" style={{ color: "#475569" }}>{label}</p>
                <span
                  className="font-heading font-bold"
                  style={{ fontSize: 36, color, letterSpacing: "-0.03em" }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* View toggle + filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="flex rounded-xl overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.07)", background: "#111111" }}
            >
              {(["list", "calendar"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="px-4 py-2 text-xs font-semibold capitalize transition-all"
                  style={{
                    background: view === v ? "#2563EB" : "transparent",
                    color: view === v ? "#FFFFFF" : "#475569",
                  }}
                >
                  {v === "list" ? "List View" : "Calendar"}
                </button>
              ))}
            </div>

            <select
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-medium focus:outline-none"
              style={{
                background: "#111111",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#94A3B8",
              }}
            >
              <option value="">All doctors</option>
              {DOCTORS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>

            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-medium focus:outline-none"
              style={{
                background: "#111111",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#94A3B8",
              }}
            >
              <option value="">All locations</option>
              {LOCATIONS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>

            <span className="text-xs ml-auto" style={{ color: "#334155" }}>
              {activeCount} active
            </span>
          </div>

          {/* List or Calendar */}
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
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#111111" }}
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
                      style={{ borderColor: "rgba(255,255,255,0.04)" }}
                    >
                      <div
                        className="px-2 py-2.5 text-center"
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                          background: isToday ? "rgba(37,99,235,0.1)" : "transparent",
                        }}
                      >
                        <p className="text-xs" style={{ color: "#334155" }}>{DAY_NAMES[d.getDay()]}</p>
                        <p
                          className="font-bold text-base"
                          style={{ color: isToday ? "#2563EB" : "#94A3B8" }}
                        >
                          {d.getDate()}
                        </p>
                      </div>
                      <div className="p-1 space-y-1">
                        {dayBookings.slice(0, 5).map((b) => (
                          <div
                            key={b.id}
                            className="px-1.5 py-1 rounded text-xs truncate"
                            style={{
                              background: "rgba(37,99,235,0.1)",
                              color: "#60A5FA",
                              border: "1px solid rgba(37,99,235,0.2)",
                            }}
                            title={`${b.time} — ${b.patientName}`}
                          >
                            {b.time} {b.patientName.split(" ")[0]}
                          </div>
                        ))}
                        {dayBookings.length > 5 && (
                          <p className="text-xs px-1" style={{ color: "#334155" }}>
                            +{dayBookings.length - 5} more
                          </p>
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

        </div>
      </main>
    </div>
  );
}

/**
 * Server-side only — never import this from client components.
 * Uses @libsql/client/web for Turso cloud database.
 */
import { createClient, type Client } from "@libsql/client/web";
import type { Booking } from "./types";

let _client: Client | null = null;
let _initialized = false;

function getClient(): Client {
  if (_client) return _client;
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) throw new Error("TURSO_DATABASE_URL is not set");
  if (!authToken) throw new Error("TURSO_AUTH_TOKEN is not set");
  _client = createClient({ url, authToken });
  return _client;
}

async function init(): Promise<void> {
  if (_initialized) return;
  _initialized = true;
  const c = getClient();

  await c.execute(`
    CREATE TABLE IF NOT EXISTS bookings (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      patientName  TEXT NOT NULL,
      patientPhone TEXT NOT NULL,
      patientEmail TEXT NOT NULL,
      reason       TEXT NOT NULL,
      doctorId     TEXT NOT NULL,
      locationId   TEXT NOT NULL,
      date         TEXT NOT NULL,
      time         TEXT NOT NULL,
      status       TEXT NOT NULL DEFAULT 'pending',
      createdAt    TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  const { rows } = await c.execute("SELECT COUNT(*) as n FROM bookings");
  if (Number(rows[0]?.n ?? 0) === 0) {
    await seedDummyData(c);
  }
}

// ─── Seed ────────────────────────────────────────────────────────────────────

function addWorkdays(startIso: string, offset: number): string {
  const d = new Date(startIso);
  let added = 0;
  while (added < offset) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return d.toISOString().split("T")[0];
}

function prevWorkday(startIso: string, offset: number): string {
  const d = new Date(startIso);
  let subtracted = 0;
  while (subtracted < offset) {
    d.setDate(d.getDate() - 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) subtracted++;
  }
  return d.toISOString().split("T")[0];
}

type SeedRow = Omit<Booking, "id" | "createdAt">;

async function seedDummyData(c: Client): Promise<void> {
  const today = "2026-04-01";

  const seeds: SeedRow[] = [
    { patientName: "Emma Larsen",     patientPhone: "+47 90 12 34 56", patientEmail: "emma.larsen@email.no",   reason: "Annual check-up",              doctorId: "eriksen",   locationId: "sentrum",      date: prevWorkday(today, 3), time: "09:00", status: "confirmed" },
    { patientName: "Ole Bakken",      patientPhone: "+47 91 23 45 67", patientEmail: "ole.bakken@email.no",    reason: "Chest pains and breathlessness",doctorId: "hansen",    locationId: "sentrum",      date: prevWorkday(today, 2), time: "10:30", status: "confirmed" },
    { patientName: "Nora Vik",        patientPhone: "+47 92 34 56 78", patientEmail: "nora.vik@email.no",      reason: "Skin rash — recurring",        doctorId: "berg",      locationId: "grunerløkka",  date: prevWorkday(today, 2), time: "14:00", status: "confirmed" },
    { patientName: "Jonas Halvorsen", patientPhone: "+47 93 45 67 89", patientEmail: "jonas.h@email.no",       reason: "Knee pain after running",      doctorId: "dahl",      locationId: "sentrum",      date: prevWorkday(today, 1), time: "08:00", status: "confirmed" },
    { patientName: "Mia Thorsen",     patientPhone: "+47 94 56 78 90", patientEmail: "mia.t@email.no",         reason: "Anxiety — first appointment",  doctorId: "lindqvist", locationId: "grunerløkka",  date: prevWorkday(today, 1), time: "11:00", status: "confirmed" },
    { patientName: "Sofie Andersen",  patientPhone: "+47 95 67 89 01", patientEmail: "sofie.a@email.no",       reason: "Child vaccination — 12 months",doctorId: "nygaard",   locationId: "majorstuen",   date: today, time: "09:00", status: "confirmed" },
    { patientName: "Petter Strand",   patientPhone: "+47 96 78 90 12", patientEmail: "petter.s@email.no",      reason: "Blood pressure follow-up",     doctorId: "eriksen",   locationId: "majorstuen",   date: today, time: "10:00", status: "confirmed" },
    { patientName: "Ida Knutsen",     patientPhone: "+47 97 89 01 23", patientEmail: "ida.k@email.no",         reason: "Eczema — new flare-up",        doctorId: "berg",      locationId: "majorstuen",   date: today, time: "13:30", status: "pending"   },
    { patientName: "Henrik Olsen",    patientPhone: "+47 98 90 12 34", patientEmail: "henrik.o@email.no",      reason: "Lower back pain",              doctorId: "dahl",      locationId: "grunerløkka",  date: today, time: "14:30", status: "pending"   },
    { patientName: "Lise Næss",       patientPhone: "+47 99 01 23 45", patientEmail: "lise.n@email.no",        reason: "General consultation",         doctorId: "eriksen",   locationId: "sentrum",      date: addWorkdays(today, 1), time: "09:30", status: "pending"   },
    { patientName: "Tor Magnusson",   patientPhone: "+47 40 12 34 56", patientEmail: "tor.m@email.no",         reason: "ECG and stress test review",   doctorId: "hansen",    locationId: "sentrum",      date: addWorkdays(today, 1), time: "11:00", status: "confirmed" },
    { patientName: "Camilla Brandt",  patientPhone: "+47 41 23 45 67", patientEmail: "camilla.b@email.no",     reason: "CBT session — ongoing",        doctorId: "lindqvist", locationId: "grunerløkka",  date: addWorkdays(today, 2), time: "10:00", status: "confirmed" },
    { patientName: "Rune Fredriksen", patientPhone: "+47 42 34 56 78", patientEmail: "rune.f@email.no",        reason: "Shoulder physio referral",     doctorId: "dahl",      locationId: "sentrum",      date: addWorkdays(today, 2), time: "14:00", status: "pending"   },
    { patientName: "Astrid Lie",      patientPhone: "+47 43 45 67 89", patientEmail: "astrid.l@email.no",      reason: "Child fever and ear infection",doctorId: "nygaard",   locationId: "majorstuen",   date: addWorkdays(today, 3), time: "08:30", status: "pending"   },
    { patientName: "Bjørn Haugen",    patientPhone: "+47 44 56 78 90", patientEmail: "bjorn.h@email.no",       reason: "Mole check — three sites",     doctorId: "berg",      locationId: "grunerløkka",  date: addWorkdays(today, 4), time: "13:00", status: "pending"   },
  ];

  for (const s of seeds) {
    await c.execute({
      sql: `INSERT INTO bookings (patientName, patientPhone, patientEmail, reason, doctorId, locationId, date, time, status) VALUES (?,?,?,?,?,?,?,?,?)`,
      args: [s.patientName, s.patientPhone, s.patientEmail, s.reason, s.doctorId, s.locationId, s.date, s.time, s.status],
    });
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToBooking(r: Record<string, any>): Booking {
  return {
    id: Number(r.id),
    patientName: String(r.patientName),
    patientPhone: String(r.patientPhone),
    patientEmail: String(r.patientEmail),
    reason: String(r.reason),
    doctorId: String(r.doctorId),
    locationId: String(r.locationId),
    date: String(r.date),
    time: String(r.time),
    status: r.status as Booking["status"],
    createdAt: String(r.createdAt),
  };
}

// ─── Query functions ──────────────────────────────────────────────────────────

export async function getAllBookings(): Promise<Booking[]> {
  await init();
  const { rows } = await getClient().execute("SELECT * FROM bookings ORDER BY date DESC, time ASC");
  return rows.map((r) => rowToBooking(r as Record<string, unknown>));
}

export async function getBookingById(id: number): Promise<Booking | undefined> {
  await init();
  const { rows } = await getClient().execute({ sql: "SELECT * FROM bookings WHERE id = ?", args: [id] });
  if (rows.length === 0) return undefined;
  return rowToBooking(rows[0] as Record<string, unknown>);
}

export async function createBooking(
  data: Omit<Booking, "id" | "createdAt" | "status">
): Promise<Booking> {
  await init();
  const c = getClient();
  const result = await c.execute({
    sql: `INSERT INTO bookings (patientName, patientPhone, patientEmail, reason, doctorId, locationId, date, time, status) VALUES (?,?,?,?,?,?,?,?,?)`,
    args: [data.patientName, data.patientPhone, data.patientEmail, data.reason, data.doctorId, data.locationId, data.date, data.time, "pending"],
  });
  return (await getBookingById(Number(result.lastInsertRowid)))!;
}

export async function updateBookingStatus(id: number, status: Booking["status"]): Promise<Booking | undefined> {
  await init();
  await getClient().execute({ sql: "UPDATE bookings SET status = ? WHERE id = ?", args: [status, id] });
  return getBookingById(id);
}

export async function deleteBooking(id: number): Promise<void> {
  await init();
  await getClient().execute({ sql: "DELETE FROM bookings WHERE id = ?", args: [id] });
}

export async function getBookedTimesForDateDoctor(date: string, doctorId: string): Promise<string[]> {
  await init();
  const { rows } = await getClient().execute({
    sql: "SELECT time FROM bookings WHERE date = ? AND doctorId = ? AND status != 'cancelled'",
    args: [date, doctorId],
  });
  return rows.map((r) => String((r as Record<string, unknown>).time));
}

export async function rescheduleBooking(id: number, date?: string, time?: string): Promise<void> {
  await init();
  if (!date && !time) return;
  const parts: string[] = [];
  const args: (string | number)[] = [];
  if (date) { parts.push("date = ?"); args.push(date); }
  if (time) { parts.push("time = ?"); args.push(time); }
  args.push(id);
  await getClient().execute({ sql: `UPDATE bookings SET ${parts.join(", ")} WHERE id = ?`, args });
}

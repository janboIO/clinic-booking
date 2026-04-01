import { NextRequest, NextResponse } from "next/server";
import { getAllBookings, createBooking } from "@/lib/db";
import { sendConfirmationEmail } from "@/lib/email";
import { getDoctorById, getLocationById } from "@/lib/data";

function isAdmin(req: NextRequest): boolean {
  return req.cookies.get("admin_session")?.value === "janbo2025";
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const bookings = await getAllBookings();
  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { patientName, patientPhone, patientEmail, reason, doctorId, locationId, date, time } = body;

  if (!patientName || !patientPhone || !patientEmail || !reason || !doctorId || !locationId || !date || !time) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const booking = await createBooking({ patientName, patientPhone, patientEmail, reason, doctorId, locationId, date, time });

  const doctor = getDoctorById(doctorId);
  const location = getLocationById(locationId);
  if (doctor && location) {
    await sendConfirmationEmail(booking, doctor, location);
  }

  return NextResponse.json(booking, { status: 201 });
}

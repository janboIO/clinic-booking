import { NextRequest, NextResponse } from "next/server";
import { getBookingById, updateBookingStatus, deleteBooking, rescheduleBooking } from "@/lib/db";
import { sendCancellationEmail } from "@/lib/email";
import { getDoctorById, getLocationById } from "@/lib/data";

function isAdmin(req: NextRequest): boolean {
  return req.cookies.get("admin_session")?.value === "janbo2025";
}

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const id = parseInt((await params).id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const booking = await getBookingById(id);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(booking);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt((await params).id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await req.json();
  const { status, date, time } = body;

  if (status && !["pending", "confirmed", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  if (date || time) {
    await rescheduleBooking(id, date, time);
  }

  let updated = await getBookingById(id);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (status) {
    updated = (await updateBookingStatus(id, status)) ?? updated;
  }

  if (status === "cancelled") {
    const doctor = getDoctorById(updated.doctorId);
    const location = getLocationById(updated.locationId);
    if (doctor && location) {
      await sendCancellationEmail(updated, doctor, location);
    }
  }

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt((await params).id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const existing = await getBookingById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteBooking(id);
  return NextResponse.json({ success: true });
}

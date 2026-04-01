import { NextRequest, NextResponse } from "next/server";
import { getBookedTimesForDateDoctor } from "@/lib/db";
import { getAllTimeSlots } from "@/lib/data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get("doctorId");
  const date = searchParams.get("date");

  if (!doctorId || !date) {
    return NextResponse.json({ error: "Missing doctorId or date" }, { status: 400 });
  }

  const booked = await getBookedTimesForDateDoctor(date, doctorId);
  const slots = getAllTimeSlots().map((time) => ({
    time,
    available: !booked.includes(time),
  }));

  return NextResponse.json(slots);
}

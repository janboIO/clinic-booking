import { Resend } from "resend";
import type { Booking, Doctor, Location } from "./types";

// Lazy initialization — avoids errors during Next.js build/static analysis
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const FROM = () => process.env.RESEND_FROM_EMAIL ?? "booking@clinic.example.com";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function confirmationHtml(booking: Booking, doctor: Doctor, location: Location): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F0F4FF;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4FF;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(37,99,235,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#2563EB;padding:32px 40px;">
            <p style="margin:0;color:rgba(255,255,255,0.7);font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">Oslo Clinic</p>
            <h1 style="margin:8px 0 0;color:#FFFFFF;font-size:26px;font-weight:700;letter-spacing:-0.01em;">Booking Confirmed</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 24px;color:#374151;font-size:16px;line-height:1.6;">
              Hello <strong>${booking.patientName}</strong>,<br>
              Your appointment has been booked. Here are your details:
            </p>

            <!-- Details card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4FF;border-radius:10px;overflow:hidden;margin-bottom:32px;">
              <tr>
                <td style="padding:24px 28px;">
                  <table width="100%" cellpadding="0" cellspacing="8">
                    <tr>
                      <td style="color:#6B7280;font-size:13px;padding-bottom:12px;width:40%;">Doctor</td>
                      <td style="color:#111827;font-size:14px;font-weight:600;padding-bottom:12px;">${doctor.name}</td>
                    </tr>
                    <tr>
                      <td style="color:#6B7280;font-size:13px;padding-bottom:12px;">Specialty</td>
                      <td style="color:#111827;font-size:14px;padding-bottom:12px;">${doctor.specialty}</td>
                    </tr>
                    <tr>
                      <td style="color:#6B7280;font-size:13px;border-top:1px solid #E5E7EB;padding-top:12px;padding-bottom:12px;">Date</td>
                      <td style="color:#111827;font-size:14px;font-weight:600;border-top:1px solid #E5E7EB;padding-top:12px;padding-bottom:12px;">${formatDate(booking.date)}</td>
                    </tr>
                    <tr>
                      <td style="color:#6B7280;font-size:13px;padding-bottom:12px;">Time</td>
                      <td style="color:#2563EB;font-size:14px;font-weight:700;padding-bottom:12px;">${booking.time}</td>
                    </tr>
                    <tr>
                      <td style="color:#6B7280;font-size:13px;border-top:1px solid #E5E7EB;padding-top:12px;padding-bottom:12px;">Clinic</td>
                      <td style="color:#111827;font-size:14px;padding-top:12px;padding-bottom:12px;">${location.name}</td>
                    </tr>
                    <tr>
                      <td style="color:#6B7280;font-size:13px;padding-bottom:4px;">Address</td>
                      <td style="color:#111827;font-size:14px;padding-bottom:4px;">${location.address}, Oslo</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 12px;color:#374151;font-size:14px;line-height:1.7;">
              <strong>Reason for visit:</strong> ${booking.reason}
            </p>

            <p style="margin:24px 0 0;color:#6B7280;font-size:13px;line-height:1.7;border-top:1px solid #E5E7EB;padding-top:24px;">
              If you need to reschedule or cancel, please contact us at least 24 hours in advance.
              Reply to this email or call the clinic directly.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F9FAFB;padding:24px 40px;border-top:1px solid #E5E7EB;">
            <p style="margin:0;color:#9CA3AF;font-size:12px;line-height:1.6;">
              Oslo Clinic Network · Karl Johans gate 25, Oslo<br>
              This is an automated confirmation. Please do not reply to this message directly.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function cancellationHtml(booking: Booking, doctor: Doctor, location: Location): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F0F4FF;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4FF;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(37,99,235,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#6B7280;padding:32px 40px;">
            <p style="margin:0;color:rgba(255,255,255,0.7);font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">Oslo Clinic</p>
            <h1 style="margin:8px 0 0;color:#FFFFFF;font-size:26px;font-weight:700;letter-spacing:-0.01em;">Appointment Cancelled</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 24px;color:#374151;font-size:16px;line-height:1.6;">
              Hello <strong>${booking.patientName}</strong>,<br>
              Your appointment has been cancelled. Details of the cancelled booking:
            </p>

            <table width="100%" cellpadding="0" cellspacing="8" style="background:#FEF2F2;border-radius:10px;padding:24px 28px;margin-bottom:32px;">
              <tr>
                <td style="color:#6B7280;font-size:13px;padding-bottom:10px;width:40%;">Doctor</td>
                <td style="color:#111827;font-size:14px;font-weight:600;padding-bottom:10px;">${doctor.name}</td>
              </tr>
              <tr>
                <td style="color:#6B7280;font-size:13px;padding-bottom:10px;">Date &amp; Time</td>
                <td style="color:#111827;font-size:14px;font-weight:600;padding-bottom:10px;">${formatDate(booking.date)} at ${booking.time}</td>
              </tr>
              <tr>
                <td style="color:#6B7280;font-size:13px;">Clinic</td>
                <td style="color:#111827;font-size:14px;">${location.name}</td>
              </tr>
            </table>

            <p style="margin:0;color:#374151;font-size:14px;line-height:1.7;">
              To book a new appointment, visit our website or call the clinic directly.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F9FAFB;padding:24px 40px;border-top:1px solid #E5E7EB;">
            <p style="margin:0;color:#9CA3AF;font-size:12px;line-height:1.6;">
              Oslo Clinic Network · Karl Johans gate 25, Oslo
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendConfirmationEmail(
  booking: Booking,
  doctor: Doctor,
  location: Location
): Promise<void> {
  try {
    await getResend().emails.send({
      from: FROM(),
      to: booking.patientEmail,
      subject: `Booking confirmed — ${doctor.name} on ${formatDate(booking.date)} at ${booking.time}`,
      html: confirmationHtml(booking, doctor, location),
    });
  } catch (err) {
    console.error("[email] Failed to send confirmation:", err);
  }
}

export async function sendCancellationEmail(
  booking: Booking,
  doctor: Doctor,
  location: Location
): Promise<void> {
  try {
    await getResend().emails.send({
      from: FROM(),
      to: booking.patientEmail,
      subject: `Appointment cancelled — ${doctor.name} on ${formatDate(booking.date)}`,
      html: cancellationHtml(booking, doctor, location),
    });
  } catch (err) {
    console.error("[email] Failed to send cancellation:", err);
  }
}

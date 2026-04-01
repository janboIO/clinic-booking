# Oslo Clinic Booking System

A complete, production-ready clinic booking application for three Oslo clinic locations. Patients can book 30-minute appointments with one of six specialist doctors. Admins can view, confirm, reschedule, and cancel appointments via a password-protected dashboard.

## Features

**Patient-facing**
- 4-step booking flow with animated step indicator
- 3 Oslo clinic locations to choose from
- 6 specialist doctors with generated SVG avatars
- 14-day calendar showing real available 30-minute slots (Mon–Fri 08:00–15:30)
- Framer Motion transitions between steps
- Confirmation screen with animated checkmark
- Automated confirmation email via Resend

**Admin dashboard** (`/admin`, password: `janbo2025`)
- Today's booking count badge
- List and calendar view (switchable)
- Filter by doctor and location
- Confirm / Reschedule / Cancel actions
- Cancellation triggers automatic email to patient
- Pure-SVG bar chart (bookings per day this week)
- Pure-SVG donut chart (bookings per doctor)

## Tech stack

- **Next.js 14** App Router, TypeScript
- **Tailwind CSS** + **Framer Motion** for UI
- **@libsql/client** (Turso) for local SQLite data persistence — no native build required
- **Resend** for transactional email

## Setup

### Prerequisites

- Node.js 18+
- A [Resend](https://resend.com) account (free tier works fine)

### Installation

```bash
# 1. Clone / enter the directory
cd clinic-booking

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.local.example .env.local
# Edit .env.local and fill in your Resend API key
```

### Environment variables

```env
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=booking@yourdomain.com
ADMIN_PASSWORD=janbo2025
```

> The `RESEND_FROM_EMAIL` must be from a domain you've verified with Resend.
> During development you can use `onboarding@resend.dev` to send to your own email.

### Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the booking flow.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin login (password: `janbo2025`).

### Build for production

```bash
npm run build
npm start
```

The SQLite database (`clinic.db`) is created automatically in the project root on first run and pre-populated with 15 realistic dummy bookings.

## Project structure

```
clinic-booking/
├── app/
│   ├── page.tsx                   # 4-step booking flow
│   ├── confirmation/page.tsx      # Post-booking confirmation
│   ├── admin/
│   │   ├── page.tsx               # Admin login
│   │   └── dashboard/page.tsx     # Admin dashboard
│   └── api/
│       ├── auth/route.ts          # POST login
│       ├── bookings/route.ts      # GET (admin) / POST (new booking)
│       ├── bookings/[id]/route.ts # GET / PATCH / DELETE
│       └── availability/route.ts  # GET available slots
├── components/
│   ├── booking/                   # Step components
│   └── admin/                     # Dashboard components
└── lib/
    ├── types.ts                   # TypeScript interfaces
    ├── data.ts                    # Doctors, locations, slot generation
    ├── db.ts                      # SQLite queries (server-only)
    └── email.ts                   # Resend email templates
```

## Deployment

This app uses Next.js API routes and cannot be deployed as a purely static site. Deploy to:
- **Vercel** (recommended — zero config)
- **Railway** or **Render** (for persistent SQLite)
- Any Node.js host that supports Next.js server runtime

> **Note on SQLite in production**: better-sqlite3 stores data locally. For multi-instance deployments, replace with a hosted database (Postgres via Prisma, Turso, etc.).

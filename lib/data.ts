import type { Location, Doctor } from "./types";

export const LOCATIONS: Location[] = [
  {
    id: "manhattan",
    name: "Manhattan Medical Center",
    address: "545 Park Ave, New York, NY 10065",
    district: "New York, NY",
  },
  {
    id: "beverly-hills",
    name: "Beverly Hills Health Clinic",
    address: "436 N Bedford Dr, Beverly Hills, CA 90210",
    district: "Los Angeles, CA",
  },
  {
    id: "chicago-loop",
    name: "Chicago Loop Medical",
    address: "200 S Michigan Ave, Chicago, IL 60604",
    district: "Chicago, IL",
  },
];

export const DOCTORS: Doctor[] = [
  {
    id: "sullivan",
    name: "Dr. James Sullivan",
    specialty: "General Practice",
    bio: "Board-certified family physician focused on preventive care and chronic disease management.",
    rating: 4.9,
    locationIds: ["manhattan", "beverly-hills"],
  },
  {
    id: "kim",
    name: "Dr. Sarah Kim",
    specialty: "Cardiology",
    bio: "Interventional cardiologist specializing in heart failure, arrhythmia, and lipid disorders.",
    rating: 4.8,
    locationIds: ["manhattan"],
  },
  {
    id: "reynolds",
    name: "Dr. Michael Reynolds",
    specialty: "Dermatology",
    bio: "Dermatologist treating medical and cosmetic skin conditions with a focus on melanoma screening.",
    rating: 5.0,
    locationIds: ["beverly-hills", "chicago-loop"],
  },
  {
    id: "chen",
    name: "Dr. Emily Chen",
    specialty: "Orthopedics",
    bio: "Orthopedic surgeon specializing in joint replacement, fractures, and sports-related injuries.",
    rating: 4.8,
    locationIds: ["manhattan", "chicago-loop"],
  },
  {
    id: "johnson",
    name: "Dr. Robert Johnson",
    specialty: "Neurology",
    bio: "Neurologist treating migraines, epilepsy, stroke recovery, and neurodegenerative conditions.",
    rating: 4.9,
    locationIds: ["chicago-loop"],
  },
  {
    id: "martinez",
    name: "Dr. Lisa Martinez",
    specialty: "Sports Medicine",
    bio: "Sports medicine physician helping athletes recover faster and perform at their peak.",
    rating: 4.8,
    locationIds: ["beverly-hills", "chicago-loop"],
  },
];

export function getDoctorsByLocation(locationId: string): Doctor[] {
  return DOCTORS.filter((d) => d.locationIds.includes(locationId));
}

export function getDoctorById(id: string): Doctor | undefined {
  return DOCTORS.find((d) => d.id === id);
}

export function getLocationById(id: string): Location | undefined {
  return LOCATIONS.find((l) => l.id === id);
}

/** Generate all 30-minute slots from 08:00 to 16:00 */
export function getAllTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 8; h <= 16; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 16) slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

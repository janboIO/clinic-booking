import type { Location, Doctor } from "./types";

export const LOCATIONS: Location[] = [
  {
    id: "sentrum",
    name: "Sentrum Klinikk",
    address: "Karl Johans gate 25",
    district: "Sentrum",
  },
  {
    id: "majorstuen",
    name: "Majorstuen Medisinsenter",
    address: "Bogstadveien 12",
    district: "Majorstuen",
  },
  {
    id: "grunerløkka",
    name: "Grünerløkka Legesenter",
    address: "Thorvald Meyers gate 55",
    district: "Grünerløkka",
  },
];

export const DOCTORS: Doctor[] = [
  {
    id: "eriksen",
    name: "Dr. Lars Eriksen",
    specialty: "General Practitioner",
    bio: "Fifteen years of family medicine with a focus on preventive care.",
    locationIds: ["sentrum", "majorstuen"],
  },
  {
    id: "hansen",
    name: "Dr. Ingrid Hansen",
    specialty: "Cardiologist",
    bio: "Specialist in heart disease and cardiovascular prevention programs.",
    locationIds: ["sentrum"],
  },
  {
    id: "berg",
    name: "Dr. Morten Berg",
    specialty: "Dermatologist",
    bio: "Skin health specialist treating both medical and cosmetic conditions.",
    locationIds: ["majorstuen", "grunerløkka"],
  },
  {
    id: "lindqvist",
    name: "Dr. Astrid Lindqvist",
    specialty: "Psychologist",
    bio: "Cognitive behavioural therapy and mental health support for adults.",
    locationIds: ["grunerløkka"],
  },
  {
    id: "dahl",
    name: "Dr. Kristoffer Dahl",
    specialty: "Orthopaedic Surgeon",
    bio: "Musculoskeletal injuries and sports medicine — back, knees, shoulders.",
    locationIds: ["sentrum", "grunerløkka"],
  },
  {
    id: "nygaard",
    name: "Dr. Silje Nygaard",
    specialty: "Paediatrician",
    bio: "Children's health from newborns through adolescence.",
    locationIds: ["majorstuen"],
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

export interface Location {
  id: string;
  name: string;
  address: string;
  district: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  rating?: number;
  locationIds: string[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Booking {
  id: number;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  reason: string;
  doctorId: string;
  locationId: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:MM
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface BookingFormData {
  locationId: string;
  doctorId: string;
  date: string;
  time: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  reason: string;
}

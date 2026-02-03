import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

import type { Appointment } from "../types/appointment";

export async function bookAppointment(
  input: Appointment,
  userId?: string,
): Promise<void> {
  if (!db) {
    throw new Error("Firestore is not configured");
  }
  const appointmentsCol = collection(db, "appointments");

  await addDoc(appointmentsCol, {
    userId: userId || null,
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    preferredStore: input.preferredStore ?? "",
    preferredDate: input.preferredDate,
    preferredTimeSlot: input.preferredTimeSlot,
    notes: input.notes ?? "",
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

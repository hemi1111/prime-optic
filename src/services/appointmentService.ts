import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
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

export async function queryAllAppointments(): Promise<Appointment[]> {
  if (!db) {
    throw new Error("Firestore is not configured");
  }
  const appointmentsCol = collection(db, "appointments");
  const q = query(appointmentsCol, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Appointment[];
}

export async function updateAppointmentStatus(
  id: string,
  status: string,
  updates?: Partial<Pick<Appointment, "preferredDate" | "preferredTimeSlot" | "notes" | "preferredStore">>,
): Promise<void> {
  if (!db) {
    throw new Error("Firestore is not configured");
  }
  const ref = doc(db, "appointments", id);
  await updateDoc(ref, {
    status,
    ...(updates && Object.keys(updates).length > 0 ? updates : {}),
    updatedAt: serverTimestamp(),
  });
}

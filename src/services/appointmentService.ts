import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Appointment } from '../types/appointment'

export async function bookAppointment(input: Appointment): Promise<void> {
  if (!db) {
    console.warn(
      '[Appointments] Firestore is not configured. Appointment was not saved.',
    )
    // Fail with a controlled error so UI can show a clear message.
    throw new Error(
      'Online booking is temporarily unavailable. Please try again later or contact the store by phone.',
    )
  }

  const appointmentsCol = collection(db, 'appointments')

  await addDoc(appointmentsCol, {
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    preferredStore: input.preferredStore ?? '',
    preferredDate: input.preferredDate,
    preferredTimeSlot: input.preferredTimeSlot,
    notes: input.notes ?? '',
    status: 'pending',
    createdAt: serverTimestamp(),
  })
}



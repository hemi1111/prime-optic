export type Appointment = {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  preferredStore?: string;
  preferredDate: string;
  preferredTimeSlot: string;
  notes?: string;
  createdAt?: unknown;
  date?: string;
  time?: string;
  status?: string;
  userId?: string;
};

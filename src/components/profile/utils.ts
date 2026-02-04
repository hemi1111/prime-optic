import type { Appointment } from "../../types/appointment";
import type { Order } from "../../types/product";

// Format appointment date
export const formatAppointmentDate = (appointment: Appointment): string => {
  const date = appointment.date || appointment.preferredDate;
  if (!date) return "Date not set";
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      // If it's already a formatted string, return it
      return date;
    }
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return date;
  }
};

// Format appointment time
export const formatAppointmentTime = (appointment: Appointment): string => {
  const time = appointment.time || appointment.preferredTimeSlot;
  if (!time) return "Time not set";
  
  // Handle time slot format (e.g., "09-11" -> "09:00 – 11:00")
  if (time.includes("-") && !time.includes(":")) {
    const [start, end] = time.split("-");
    return `${start}:00 – ${end}:00`;
  }
  return time;
};

// Format order date
export const formatOrderDate = (order: Order): string => {
  if (!order.createdAt) return "Recently placed";
  try {
    const date = order.createdAt?.toDate?.();
    if (!date) return "Recently placed";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Recently placed";
  }
};

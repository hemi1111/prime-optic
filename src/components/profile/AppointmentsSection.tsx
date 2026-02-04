import { useMemo } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import type { Appointment } from "../../types/appointment";
import AppointmentCard from "./AppointmentCard";

interface AppointmentsSectionProps {
  appointments: Appointment[];
}

const AppointmentsSection = ({
  appointments,
}: AppointmentsSectionProps) => {
  const { t } = useTranslation();

  // Sort appointments by date (newest first)
  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const dateA = a.date || a.preferredDate || "";
      const dateB = b.date || b.preferredDate || "";
      return dateB.localeCompare(dateA);
    });
  }, [appointments]);

  return (
    <div className="rounded-2xl bg-white p-8 shadow-soft ring-1 ring-slate-200">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          {t("profile.appointments.title")}
        </h2>
        <p className="text-slate-600">
          {t("profile.appointments.description")}
        </p>
      </div>

      {sortedAppointments.length > 0 ? (
        <div className="mt-6 space-y-4">
          {sortedAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-lg text-slate-600 mb-4">
            {t("profile.appointments.none")}
          </p>
          <p className="text-sm text-slate-500 mb-4">
            {t("profile.appointments.noneDescription")}
          </p>
          <a
            href="/exam"
            className="inline-flex rounded-lg bg-primary-500 px-6 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
          >
            {t("profile.appointments.bookAppointment")}
          </a>
        </div>
      )}
    </div>
  );
};

export default AppointmentsSection;

import { useTranslation } from "../../hooks/useTranslation";
import type { Appointment } from "../../types/appointment";
import { formatAppointmentDate, formatAppointmentTime } from "./utils";

interface AppointmentCardProps {
  appointment: Appointment;
}

const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-4 mb-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">
                    {formatAppointmentDate(appointment)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm">
                    {formatAppointmentTime(appointment)}
                  </span>
                </div>
              </div>
              {appointment.preferredStore && (
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{appointment.preferredStore}</span>
                </div>
              )}
              {appointment.notes && (
                <div className="mt-2 p-2 bg-slate-50 rounded-md">
                  <p className="text-xs text-slate-600 italic">
                    "{appointment.notes}"
                  </p>
                </div>
              )}
              {appointment.id && (
                <p className="text-xs text-slate-400 mt-2">
                  ID: {appointment.id.slice(-8).toUpperCase()}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <span
            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
              appointment.status === "confirmed"
                ? "bg-green-100 text-green-700 border border-green-200"
                : appointment.status === "pending"
                ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {appointment.status === "confirmed"
              ? t("profile.appointments.confirmed")
              : appointment.status === "pending"
              ? t("profile.appointments.pending")
              : t("profile.appointments.cancelled")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;

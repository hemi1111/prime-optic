import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from "../hooks/useTranslation";
import { useToast } from "../hooks/useToast";
import { getReadableErrorMessage } from "../utils/errorHandler";
import type { Appointment } from "../types/appointment";
import {
  queryAllAppointments,
  updateAppointmentStatus,
} from "../services/appointmentService";
import { AdminNav } from "../components/admin";
import { getStatusBadgeClasses } from "../utils/adminUtils";

const AdminAppointmentsPage = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    void loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const all = await queryAllAppointments();
      setAppointments(all);
    } catch (error) {
      const errorMessage = getReadableErrorMessage(error, t);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (
    id: string | undefined,
    status: "pending" | "confirmed" | "cancelled",
  ) => {
    if (!id) return;
    setIsLoading(true);
    try {
      await updateAppointmentStatus(id, status);
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? { ...appt, status } : appt)),
      );
      toast.success(t("toast.admin.appointmentUpdated"));
    } catch (error) {
      const errorMessage = getReadableErrorMessage(error, t);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminNav />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {t("admin.appointments.title")}
          </h1>
          <p className="text-sm text-slate-500">
            {t("admin.appointments.description")}
          </p>
        </div>
        <button
          type="button"
          onClick={loadAppointments}
          disabled={isLoading}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isLoading ? t("common.loading") : t("admin.appointments.refreshButton")}
        </button>
      </div>

      <div className="rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            {t("admin.appointments.title")}
            <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{appointments.length}</span>
          </h2>
        </div>
        {isLoading && appointments.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-sm text-slate-500">
            <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading appointments...
          </div>
        ) : appointments.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-500">
            {t("admin.appointments.empty")}
          </p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-100 bg-slate-50/70">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{t("admin.appointments.table.fullName")}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{t("admin.appointments.table.contact")}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{t("admin.appointments.table.store")}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{t("admin.appointments.table.dateTime")}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{t("admin.appointments.table.status")}</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">{t("admin.appointments.table.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="transition-colors hover:bg-slate-50/70">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{appointment.fullName}</div>
                        {appointment.userId && (
                          <div className="mt-0.5 font-mono text-xs text-slate-400">UID: {appointment.userId.slice(0, 12)}…</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-900">{appointment.email}</div>
                        <div className="mt-0.5 text-xs text-slate-500">{appointment.phone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-slate-900">{appointment.preferredStore || "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{appointment.preferredDate}</div>
                        <div className="mt-0.5 text-xs text-slate-500">{appointment.preferredTimeSlot}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusBadgeClasses(appointment.status ?? "pending")}`}>
                          {appointment.status || "pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={isLoading || appointment.status === "confirmed"}
                            onClick={() => handleStatusChange(appointment.id, "confirmed")}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            {t("admin.appointments.actions.accept")}
                          </button>
                          <button
                            type="button"
                            disabled={isLoading || appointment.status === "cancelled"}
                            onClick={() => handleStatusChange(appointment.id, "cancelled")}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {t("admin.appointments.actions.decline")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="space-y-3 p-4 sm:hidden">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">{appointment.fullName}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{appointment.email}</p>
                      {appointment.phone && <p className="text-xs text-slate-500">{appointment.phone}</p>}
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ${getStatusBadgeClasses(appointment.status ?? "pending")}`}>
                      {appointment.status || "pending"}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-slate-600">
                    {appointment.preferredStore && <p><span className="font-medium">Store:</span> {appointment.preferredStore}</p>}
                    {appointment.preferredDate && <p><span className="font-medium">Date:</span> {appointment.preferredDate} {appointment.preferredTimeSlot}</p>}
                  </div>
                  <div className="mt-3 flex gap-2 border-t border-slate-200 pt-3">
                    <button
                      type="button"
                      disabled={isLoading || appointment.status === "confirmed"}
                      onClick={() => handleStatusChange(appointment.id, "confirmed")}
                      className="flex-1 rounded-lg bg-green-600 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-40"
                    >
                      {t("admin.appointments.actions.accept")}
                    </button>
                    <button
                      type="button"
                      disabled={isLoading || appointment.status === "cancelled"}
                      onClick={() => handleStatusChange(appointment.id, "cancelled")}
                      className="flex-1 rounded-lg bg-red-600 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-40"
                    >
                      {t("admin.appointments.actions.decline")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAppointmentsPage;


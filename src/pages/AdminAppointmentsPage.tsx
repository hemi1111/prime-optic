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
      <div className="flex items-center justify-between">
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
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {isLoading
            ? t("common.loading")
            : t("admin.appointments.refreshButton")}
        </button>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
        {appointments.length === 0 ? (
          <p className="text-sm text-slate-500">
            {t("admin.appointments.empty")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">
                    {t("admin.appointments.table.fullName")}
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">
                    {t("admin.appointments.table.contact")}
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">
                    {t("admin.appointments.table.store")}
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">
                    {t("admin.appointments.table.dateTime")}
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">
                    {t("admin.appointments.table.status")}
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-slate-600">
                    {t("admin.appointments.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">
                        {appointment.fullName}
                      </div>
                      {appointment.userId && (
                        <div className="text-xs text-slate-400">
                          UID: {appointment.userId}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-900">{appointment.email}</div>
                      <div className="text-xs text-slate-500">
                        {appointment.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-900">
                        {appointment.preferredStore || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-900">
                        {appointment.preferredDate}
                      </div>
                      <div className="text-xs text-slate-500">
                        {appointment.preferredTimeSlot}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700">
                        {appointment.status || "pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() =>
                            handleStatusChange(
                              appointment.id,
                              "confirmed",
                            )
                          }
                          className="rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          {t("admin.appointments.actions.accept")}
                        </button>
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() =>
                            handleStatusChange(
                              appointment.id,
                              "cancelled",
                            )
                          }
                          className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          {t("admin.appointments.actions.decline")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppointmentsPage;


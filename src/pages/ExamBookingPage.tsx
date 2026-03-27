import { useState } from "react";

import { bookAppointment } from "../services/appointmentService";
import { useTranslation } from "../hooks/useTranslation";
import { useToast } from "../hooks/useToast";
import { getReadableErrorMessage } from "../utils/errorHandler";
import { useAuthStore } from "../store/useAuthStore";
import { useStoreLocations } from "../hooks/useStoreLocations";

const ExamBookingPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const user = useAuthStore((state) => state.user);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredStore, setPreferredStore] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTimeSlot, setPreferredTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { stores } = useStoreLocations();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await bookAppointment(
        {
          fullName,
          email,
          phone,
          preferredStore,
          preferredDate,
          preferredTimeSlot,
          notes,
        },
        user?.id,
      );
      toast.success(t("toast.appointment.success"));
      setFullName("");
      setEmail("");
      setPhone("");
      setPreferredStore("");
      setPreferredDate("");
      setPreferredTimeSlot("");
      setNotes("");
    } catch (error) {
      console.error(error);
      const errorMessage = getReadableErrorMessage(error, t);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableStores = stores.filter((s) => s.isAvailable);
  const bookingSteps = [
    t("common.contactInformation"),
    t("exam.form.store"),
    t("exam.form.date"),
  ];

  return (
    <div className="relative mx-auto max-w-6xl space-y-8 overflow-hidden lg:space-y-10">
      <div className="pointer-events-none absolute -top-24 right-0 h-52 w-52 rounded-full bg-primary-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-52 w-52 rounded-full bg-sky-200/30 blur-3xl" />

      <header className="space-y-4 text-center">
        <div className="inline-block rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
          {t("common.eyeExamination")}
        </div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
          {t("exam.title")}
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
          {t("common.chooseDateTimeStore")}
        </p>
        <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-2 pt-1">
          {bookingSteps.map((step, index) => (
            <span
              key={step}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-soft"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                {index + 1}
              </span>
              {step}
            </span>
          ))}
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr),minmax(0,400px)] lg:gap-10">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl bg-white/95 p-6 shadow-xl ring-1 ring-slate-200/50 md:p-8"
        >
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 md:p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
              {t("common.contactInformation")}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                id="fullName"
                label={t("common.fullName")}
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
              <Field
                id="phone"
                label={t("common.phoneNumber")}
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </div>
            <Field
              id="email"
              label={t("exam.form.email")}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 md:p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
              {t("common.deliveryOptions")}
            </h2>
            <div className="space-y-1 text-sm">
              <label
                htmlFor="store"
                className="block text-xs font-medium text-slate-700"
              >
                {t("exam.form.store")}
              </label>
              <select
                id="store"
                value={preferredStore}
                onChange={(event) => setPreferredStore(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
              >
                <option value="">{t("exam.form.storePlaceholder")}</option>
                {availableStores.map((store) => (
                  <option key={store.id} value={store.name}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                id="date"
                label={t("exam.form.date")}
                type="date"
                value={preferredDate}
                onChange={(event) => setPreferredDate(event.target.value)}
                required
              />
              <div className="space-y-1 text-sm">
                <label
                  htmlFor="timeSlot"
                  className="block text-xs font-medium text-slate-700"
                >
                  {t("exam.form.time")}
                </label>
                <select
                  id="timeSlot"
                  value={preferredTimeSlot}
                  onChange={(event) => setPreferredTimeSlot(event.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
                >
                  <option value=""></option>
                  <option value="09-11">09:00 – 11:00</option>
                  <option value="11-13">11:00 – 13:00</option>
                  <option value="14-16">14:00 – 16:00</option>
                  <option value="16-18">16:00 – 18:00</option>
                </select>
              </div>
            </div>

            <div className="space-y-1 text-sm">
              <label
                htmlFor="notes"
                className="block text-xs font-medium text-slate-700"
              >
                {t("exam.form.notes")}
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 placeholder:text-slate-400 focus:ring-2"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 bg-size-200 bg-pos-0 px-8 py-4 text-base font-bold text-white shadow-xl transition-all duration-500 hover:scale-105 hover:bg-pos-100 hover:shadow-2xl hover:shadow-primary-500/30 active:scale-95 disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
            style={{
              backgroundSize: "200% 100%",
              backgroundPosition: "0% 0%",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundPosition = "100% 0%";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundPosition = "0% 0%";
              }
            }}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {t("common.sendingRequest")}
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
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
                {t("exam.form.submit")}
              </>
            )}
          </button>
        </form>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 mb-1">
              {t("exam.ourLocations")}
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              {t("exam.ourLocationsDescription")}
            </p>
            <ul className="space-y-4">
              {availableStores.map((store) => (
                <li
                  key={store.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4"
                >
                  <div className="font-medium text-slate-900 text-sm">
                    {store.name}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{store.address}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{store.hours}</p>
                  <a
                    href={`tel:${store.phone.replace(/\s/g, "")}`}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium mt-1 inline-block"
                  >
                    {store.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-slate-50 p-6 ring-1 ring-slate-200/50">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 mb-3">
              {t("exam.whyBookWithUs")}
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </span>
                {t("exam.reasons.qualifiedOptometrists")}
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                </span>
                {t("exam.reasons.modernEquipment")}
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <svg
                    className="h-4 w-4"
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
                </span>
                {t("exam.reasons.sameDayResults")}
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <svg
                    className="h-4 w-4"
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
                </span>
                {t("exam.reasons.multipleLocations")}
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

type FieldProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

const Field = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: FieldProps) => {
  return (
    <div className="space-y-1 text-sm">
      <label htmlFor={id} className="block text-xs font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 placeholder:text-slate-400 focus:ring-2"
      />
    </div>
  );
};

export default ExamBookingPage;

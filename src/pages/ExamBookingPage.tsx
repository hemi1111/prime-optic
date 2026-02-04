import { useState } from "react";

import { bookAppointment } from "../services/appointmentService";
import { useTranslation } from "../hooks/useTranslation";
import { useToast } from "../hooks/useToast";
import { getReadableErrorMessage } from "../utils/errorHandler";
import { useAuthStore } from "../store/useAuthStore";

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

  return (
    <div className="mx-auto max-w-2xl space-y-8">
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
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200/50"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            id="fullName"
            label={t("exam.form.name")}
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />
          <Field
            id="phone"
            label={t("exam.form.phone")}
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
        <Field
          id="store"
          label={t("exam.form.store")}
          placeholder="e.g., City Center branch"
          value={preferredStore}
          onChange={(event) => setPreferredStore(event.target.value)}
        />

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
              <option value="" disabled>
                Select a time range
              </option>
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
            placeholder="Let us know if you have any specific concerns or preferences."
          />
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

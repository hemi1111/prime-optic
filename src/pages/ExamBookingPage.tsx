import { useState } from 'react'
import { bookAppointment } from '../services/appointmentService'
import { useTranslation } from '../hooks/useTranslation'

export function ExamBookingPage() {
  const { t } = useTranslation()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [preferredStore, setPreferredStore] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSuccessMessage(null)
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      await bookAppointment({
        fullName,
        email,
        phone,
        preferredStore,
        preferredDate,
        preferredTimeSlot,
        notes,
      })
      setSuccessMessage(
        'Your eye exam request has been sent. We will contact you shortly to confirm the exact time.',
      )
      setFullName('')
      setEmail('')
      setPhone('')
      setPreferredStore('')
      setPreferredDate('')
      setPreferredTimeSlot('')
      setNotes('')
    } catch (error) {
      console.error(error)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'We could not submit your request right now. Please try again later.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {t('exam.title')}
        </h1>
        <p className="text-sm text-slate-500">
          Choose your preferred date, time and store. Our team will confirm the
          appointment by email or phone.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            id="fullName"
            label={t('exam.form.name')}
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />
          <Field
            id="phone"
            label={t('exam.form.phone')}
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
        </div>
        <Field
          id="email"
          label={t('exam.form.email')}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Field
          id="store"
          label={t('exam.form.store')}
          placeholder="e.g., City Center branch"
          value={preferredStore}
          onChange={(event) => setPreferredStore(event.target.value)}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            id="date"
            label={t('exam.form.date')}
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
              {t('exam.form.time')}
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
            {t('exam.form.notes')}
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

        <div className="flex items-start gap-2 text-xs text-slate-500">
          <input
            id="consent"
            type="checkbox"
            required
            className="mt-0.5 h-3 w-3 rounded border-slate-300 text-primary-500"
          />
          <label htmlFor="consent">
            {t('exam.form.consent')}
          </label>
        </div>

        {successMessage && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
            {t('exam.success')}
          </div>
        )}
        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {t('exam.error')}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primary-600 disabled:opacity-60"
        >
          {isSubmitting ? 'Sending request...' : t('exam.form.submit')}
        </button>
      </form>
    </div>
  )
}

type FieldProps = {
  id: string
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}

function Field({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required,
}: FieldProps) {
  return (
    <div className="space-y-1 text-sm">
      <label
        htmlFor={id}
        className="block text-xs font-medium text-slate-700"
      >
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
  )
}



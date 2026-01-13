import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useTranslation } from '../hooks/useTranslation'

type Mode = 'sign-in' | 'sign-up'

export function AuthPage() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<Mode>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const setUserForDemo = useAuthStore((state) => state.setUserForDemo)
  const navigate = useNavigate()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    // Pure UI demo: set a temporary user and redirect
    setTimeout(() => {
      setUserForDemo({
        id: 'demo-user',
        email,
        displayName: name || 'Customer',
      })
      setIsSubmitting(false)
      navigate('/')
    }, 500)
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {mode === 'sign-in' ? t('auth.signInTitle') : t('auth.signUpTitle')}
        </h1>
        <p className="text-sm text-slate-500">
          Authentication will be powered by Firebase – this page shows the
          final UI and flow.
        </p>
      </header>

      <div className="flex rounded-full bg-slate-100 p-1 text-xs font-medium text-slate-600">
        <button
          type="button"
          onClick={() => setMode('sign-in')}
          className={`flex-1 rounded-full px-3 py-1.5 ${
            mode === 'sign-in'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'hover:text-slate-900'
          }`}
        >
          {t('auth.signIn')}
        </button>
        <button
          type="button"
          onClick={() => setMode('sign-up')}
          className={`flex-1 rounded-full px-3 py-1.5 ${
            mode === 'sign-up'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'hover:text-slate-900'
          }`}
        >
          {t('auth.signUp')}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100"
      >
        {mode === 'sign-up' && (
          <div className="space-y-1 text-sm">
            <label
              htmlFor="name"
              className="block text-xs font-medium text-slate-700"
            >
              {t('auth.name')}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 placeholder:text-slate-400 focus:ring-2"
              placeholder="Your name"
            />
          </div>
        )}

        <div className="space-y-1 text-sm">
          <label
            htmlFor="email"
            className="block text-xs font-medium text-slate-700"
          >
            {t('auth.email')}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 placeholder:text-slate-400 focus:ring-2"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1 text-sm">
          <label
            htmlFor="password"
            className="block text-xs font-medium text-slate-700"
          >
            {t('auth.password')}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 placeholder:text-slate-400 focus:ring-2"
            placeholder="••••••••"
          />
        </div>

        {mode === 'sign-in' && (
          <div className="flex items-center justify-between text-xs text-slate-500">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="h-3 w-3 rounded border-slate-300 text-primary-500"
              />
              <span>{t('auth.rememberMe')}</span>
            </label>
            <button
              type="button"
              className="text-primary-600 hover:text-primary-700"
            >
              {t('auth.forgotPassword')}
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primary-600 disabled:opacity-60"
        >
          {isSubmitting
            ? t('auth.continuing')
            : mode === 'sign-in'
              ? t('auth.signIn')
              : t('auth.createAccount')}
        </button>
      </form>
    </div>
  )
}



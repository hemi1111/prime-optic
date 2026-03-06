import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "../hooks/useTranslation";
import { useToast } from "../hooks/useToast";
import { getReadableErrorMessage } from "../utils/errorHandler";
import {
  signUpWithEmailAndPassword,
  logInWithEmailAndPassword,
  signInWithGoogle,
} from "../services/authService";

type Mode = "sign-in" | "sign-up";

const AuthPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err: unknown) {
      const errorMessage = getReadableErrorMessage(err, t);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (mode === "sign-up") {
        await signUpWithEmailAndPassword(email, password, name);
      } else {
        await logInWithEmailAndPassword(email, password);
      }
      navigate("/");
    } catch (err: any) {
      const errorMessage = getReadableErrorMessage(err, t);
      setError(errorMessage);
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20";

  return (
    <div className="min-h-[calc(100vh-13rem)] flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-primary-50/30 px-4 py-8">
      <div className="w-full max-w-[420px]">
        <header className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="rounded-full bg-primary-500 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              Prime
            </span>
            <span className="text-xl font-semibold tracking-tight text-slate-800">
              Optic
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">
            {mode === "sign-in" ? t("auth.signInTitle") : t("auth.signUpTitle")}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {mode === "sign-in"
              ? t("auth.signInSubtitle")
              : t("auth.signUpSubtitle")}
          </p>
        </header>

        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="flex p-1 bg-slate-100/80">
            <button
              type="button"
              onClick={() => setMode("sign-in")}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                mode === "sign-in"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t("auth.signIn")}
            </button>
            <button
              type="button"
              onClick={() => setMode("sign-up")}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                mode === "sign-up"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t("auth.signUp")}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 pt-5 space-y-4">
            {error && (
              <div className="rounded-xl bg-red-50/90 p-3.5 text-sm text-red-700 border border-red-100 flex items-start gap-3">
                <span className="text-red-500 mt-0.5 shrink-0" aria-hidden>
                  •
                </span>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {mode === "sign-up" && (
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700"
                >
                  {t("common.fullName")}
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                {t("auth.email")}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                {t("auth.password")}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClass}
                placeholder="••••••••"
              />
            </div>

            {mode === "sign-in" && (
              <div className="flex items-center justify-between text-xs text-slate-500">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-slate-300 text-primary-500 focus:ring-primary-500/30"
                  />
                  <span>{t("auth.rememberMe")}</span>
                </label>
                <button
                  type="button"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t("auth.forgotPassword")}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 hover:bg-primary-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {t("auth.continuing")}
                </span>
              ) : mode === "sign-in" ? (
                t("auth.signIn")
              ) : (
                t("auth.createAccount")
              )}
            </button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs font-medium text-slate-400">
                  {t("auth.or")}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isSubmitting}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isGoogleLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                  {t("auth.continuing")}
                </span>
              ) : (
                <>
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-slate-600">
          {mode === "sign-in" ? (
            <>
              {t("auth.noAccount")}{" "}
              <button
                type="button"
                onClick={() => setMode("sign-up")}
                className="font-semibold text-primary-600 hover:text-primary-700"
              >
                {t("auth.signUp")}
              </button>
            </>
          ) : (
            <>
              {t("auth.hasAccount")}{" "}
              <button
                type="button"
                onClick={() => setMode("sign-in")}
                className="font-semibold text-primary-600 hover:text-primary-700"
              >
                {t("auth.signIn")}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;

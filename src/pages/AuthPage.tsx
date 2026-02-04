import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "../hooks/useTranslation";
import { useToast } from "../hooks/useToast";
import { getReadableErrorMessage } from "../utils/errorHandler";
import {
  signUpWithEmailAndPassword,
  logInWithEmailAndPassword,
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
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md space-y-6">
        <header className="space-y-3 text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="rounded-full bg-primary-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-white">
              Prime
            </span>
            <span className="text-2xl font-semibold tracking-tight text-slate-900">
              Optic
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {mode === "sign-in" ? t("auth.signInTitle") : t("auth.signUpTitle")}
          </h1>
          <p className="text-sm text-slate-500">
            {mode === "sign-in"
              ? "Welcome back! Sign in to access your account and bookings."
              : "Join us today and discover premium eyewear solutions."}
          </p>
        </header>

        <div className="flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setMode("sign-in")}
            className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition-all ${
              mode === "sign-in"
                ? "bg-primary-500 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t("auth.signIn")}
          </button>
          <button
            type="button"
            onClick={() => setMode("sign-up")}
            className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition-all ${
              mode === "sign-up"
                ? "bg-primary-500 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t("auth.signUp")}
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200"
        >
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200 flex items-start gap-3">
              <span className="text-lg leading-none mt-0.5">⚠️</span>
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          {mode === "sign-up" && (
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-slate-700"
              >
                {t("auth.name")}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                placeholder="John Doe"
              />
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-700"
            >
              {t("auth.email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-700"
            >
              {t("auth.password")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              placeholder="••••••••"
            />
          </div>

          {mode === "sign-in" && (
            <div className="flex items-center justify-between text-xs text-slate-500">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-3 w-3 rounded border-slate-300 text-primary-500"
                />
                <span>{t("auth.rememberMe")}</span>
              </label>
              <button
                type="button"
                className="text-primary-600 hover:text-primary-700"
              >
                {t("auth.forgotPassword")}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {t("auth.continuing")}
              </span>
            ) : mode === "sign-in" ? (
              t("auth.signIn")
            ) : (
              t("auth.createAccount")
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          {mode === "sign-in" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("sign-up")}
                className="font-semibold text-primary-600 hover:text-primary-700"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("sign-in")}
                className="font-semibold text-primary-600 hover:text-primary-700"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;

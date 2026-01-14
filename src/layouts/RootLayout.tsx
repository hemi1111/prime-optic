import type { ReactNode } from "react";

import { Link, NavLink } from "react-router-dom";

import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from "../hooks/useTranslation";

import LanguageSwitcher from "../components/LanguageSwitcher";

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const user = useAuthStore((state) => state.user);

  const getInitials = (name: string | undefined, email: string): string => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email[0].toUpperCase();
  };

  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="rounded-full bg-primary-500 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Prime
            </span>
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              Optic
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
            <NavLink
              to="/glasses"
              className={({ isActive }) =>
                `hover:text-primary-600 ${isActive ? "text-primary-600" : ""}`
              }
            >
              {t("nav.glasses")}
            </NavLink>
            <NavLink
              to="/sunglasses"
              className={({ isActive }) =>
                `hover:text-primary-600 ${isActive ? "text-primary-600" : ""}`
              }
            >
              {t("nav.sunglasses")}
            </NavLink>
            <NavLink
              to="/exam"
              className={({ isActive }) =>
                `rounded-full border px-3 py-1 text-xs font-medium shadow-sm hover:border-primary-500 hover:text-primary-600 ${
                  isActive
                    ? "border-primary-500 text-primary-600"
                    : "border-slate-200 text-slate-600"
                }`
              }
            >
              {t("nav.eyeExam")}
            </NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {user ? (
              <Link
                to="/profile"
                className="flex items-center gap-3 rounded-full border border-slate-200 px-3 py-1.5 shadow-sm hover:border-primary-500 transition-colors group"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-xs font-semibold text-white group-hover:shadow-md transition-shadow">
                  {getInitials(user.displayName, user.email)}
                </div>
                <span className="hidden text-xs font-medium text-slate-700 group-hover:text-primary-600 md:inline max-w-[120px] truncate">
                  {user.displayName || user.email}
                </span>
              </Link>
            ) : (
              <Link
                to="/auth"
                className="hidden rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm hover:border-primary-500 hover:text-primary-600 md:inline-flex"
              >
                {t("nav.signIn")}
              </Link>
            )}
            <Link
              to="/cart"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:border-primary-500"
            >
              <span className="text-lg" aria-hidden>
                🛒
              </span>
              {itemCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary-500 px-1 text-[10px] font-semibold text-white">
                  {itemCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">{children}</div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="font-semibold text-slate-700">
              {t("footer.shopName")}
            </div>
            <div>{t("footer.tagline")}</div>
          </div>
          <div className="flex flex-wrap gap-4 md:items-center">
            <span>{t("footer.contact")}</span>
            <span>{t("footer.phone")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;

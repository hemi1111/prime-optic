import type { ReactNode } from "react";

import { Link, NavLink } from "react-router-dom";

import { useCartStore } from "../store/useCartStore";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from "../hooks/useTranslation";
import { useUIStore } from "../store/useUIStore";

import LanguageSwitcher from "../components/LanguageSwitcher";

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const favoritesCount = useFavoritesStore((state) =>
    state.getFavoritesCount()
  );
  const user = useAuthStore((state) => state.user);
  const { isMobileNavOpen, openMobileNav, closeMobileNav } = useUIStore();

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
        <div className="mx-auto max-w-6xl px-4 py-3 md:py-4">
          {/* Mobile Layout */}
          <div className="md:hidden flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={openMobileNav}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 bg-white hover:border-primary-500 transition-colors"
              aria-label="Open menu"
            >
              <svg
                className="w-6 h-6 text-slate-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-primary-600 transition-colors">
                Prime Optic
              </span>
            </Link>

            <div className="w-10" />
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-primary-600 transition-colors">
                  Prime Optic
                </span>
                <span className="text-xs text-primary-500 font-medium -mt-1">
                  Premium Eyewear
                </span>
              </div>
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

            <div className="hidden md:flex items-center gap-4">
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
                to="/favorites"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:border-primary-500"
              >
                <svg
                  className="w-5 h-5 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {favoritesCount > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {favoritesCount}
                  </span>
                ) : null}
              </Link>
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
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileNavOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
            onClick={closeMobileNav}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-white to-slate-50 shadow-2xl z-50 md:hidden animate-slide-in-left">
            <div className="flex flex-col h-full">
              <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-slate-800 p-6 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
                <div className="relative flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white"
                      >
                        <path
                          d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-lg font-bold">Prime Optic</div>
                      <div className="text-xs text-primary-100">
                        Premium Eyewear
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeMobileNav}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
                    aria-label="Close menu"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                {user && (
                  <div className="relative flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-white/30 to-white/10 text-sm font-semibold text-white border border-white/30">
                      {getInitials(user.displayName, user.email)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">
                        {user.displayName || "User"}
                      </div>
                      <div className="text-xs text-primary-100 truncate">
                        {user.email}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Navigation */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                <NavLink
                  to="/glasses"
                  onClick={closeMobileNav}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? "bg-primary-50 text-primary-600 shadow-sm"
                        : "text-slate-700 hover:bg-slate-100"
                    }`
                  }
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  {t("nav.glasses")}
                </NavLink>
                <NavLink
                  to="/sunglasses"
                  onClick={closeMobileNav}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? "bg-primary-50 text-primary-600 shadow-sm"
                        : "text-slate-700 hover:bg-slate-100"
                    }`
                  }
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  {t("nav.sunglasses")}
                </NavLink>
                <NavLink
                  to="/exam"
                  onClick={closeMobileNav}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? "bg-primary-50 text-primary-600 shadow-sm"
                        : "text-slate-700 hover:bg-slate-100"
                    }`
                  }
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  {t("nav.eyeExam")}
                </NavLink>

                <div className="pt-2 mt-2 border-t border-slate-200">
                  <Link
                    to="/favorites"
                    onClick={closeMobileNav}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span>Favorites</span>
                    </div>
                    {favoritesCount > 0 && (
                      <span className="inline-flex items-center justify-center h-6 min-w-[1.5rem] px-2 rounded-full bg-red-500 text-xs font-semibold text-white">
                        {favoritesCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/cart"
                    onClick={closeMobileNav}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span>Cart</span>
                    </div>
                    {itemCount > 0 && (
                      <span className="inline-flex items-center justify-center h-6 min-w-[1.5rem] px-2 rounded-full bg-primary-500 text-xs font-semibold text-white">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                </div>

                {user ? (
                  <NavLink
                    to="/profile"
                    onClick={closeMobileNav}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                        isActive
                          ? "bg-primary-50 text-primary-600 shadow-sm"
                          : "text-slate-700 hover:bg-slate-100"
                      }`
                    }
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {t("nav.profile") || "Profile"}
                  </NavLink>
                ) : (
                  <NavLink
                    to="/auth"
                    onClick={closeMobileNav}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                        isActive
                          ? "bg-primary-50 text-primary-600 shadow-sm"
                          : "text-slate-700 hover:bg-slate-100"
                      }`
                    }
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    {t("nav.signIn")}
                  </NavLink>
                )}
              </nav>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-200 bg-white">
                <div className="mb-3">
                  <LanguageSwitcher />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-gradient-to-br from-primary-500 to-primary-600">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-white"
                    >
                      <path
                        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">{t("footer.shopName")}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">{children}</div>
      </main>

      <footer className="border-t border-slate-200 bg-gradient-to-r from-white via-slate-50 to-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-sm">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="font-bold text-slate-700 text-sm">
                {t("footer.shopName")}
              </div>
            </div>
            <div className="text-slate-500 text-sm">{t("footer.tagline")}</div>
          </div>
          <div className="flex flex-wrap gap-6 md:items-center text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              <span>{t("footer.contact")}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{t("footer.phone")}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;

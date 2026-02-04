import { Link, NavLink } from "react-router-dom";

import { useCartStore } from "../store/useCartStore";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from "../hooks/useTranslation";
import { useUIStore } from "../store/useUIStore";
import { getInitials } from "../utils/format";

import LanguageSwitcher from "../components/LanguageSwitcher";

const LogoIcon = () => (
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
);

const MobileNav = () => {
  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const favoritesCount = useFavoritesStore((state) =>
    state.getFavoritesCount()
  );
  const user = useAuthStore((state) => state.user);
  const { isMobileNavOpen, closeMobileNav } = useUIStore();
  const { t } = useTranslation();

  if (!isMobileNavOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
        onClick={closeMobileNav}
        aria-hidden
      />
      <div className="fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-white to-slate-50 shadow-2xl z-50 md:hidden animate-slide-in-left">
        <div className="flex flex-col h-full">
          <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-slate-800 p-6 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm">
                  <LogoIcon />
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                {t("nav.signIn")}
              </NavLink>
            )}
          </nav>

          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="mb-3">
              <LanguageSwitcher />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="flex items-center justify-center w-6 h-6 rounded bg-gradient-to-br from-primary-500 to-primary-600">
                <LogoIcon />
              </div>
              <span className="font-medium">{t("footer.shopName")}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNav;

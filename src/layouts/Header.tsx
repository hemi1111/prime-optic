import { Link, NavLink } from "react-router-dom";

import { useCartStore } from "../store/useCartStore";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from "../hooks/useTranslation";
import { useUIStore } from "../store/useUIStore";
import { getInitials } from "../utils/format";

import LanguageSwitcher from "../components/LanguageSwitcher";

const Logo = () => (
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
);

const Header = () => {
  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const favoritesCount = useFavoritesStore((state) =>
    state.getFavoritesCount()
  );
  const user = useAuthStore((state) => state.user);
  const openMobileNav = useUIStore((state) => state.openMobileNav);
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 md:py-4">
        <div className="md:hidden flex items-center justify-between">
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
              <Logo />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-primary-600 transition-colors">
              Prime Optic
            </span>
          </Link>

          <div className="w-10" />
        </div>

        <div className="hidden md:flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <Logo />
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
  );
};

export default Header;

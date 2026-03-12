import { NavLink } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";

const navLinks = [
  { to: "/admin", end: true, key: "admin.nav.products" },
  { to: "/admin/appointments", end: false, key: "admin.nav.appointments" },
  { to: "/admin/orders", end: false, key: "admin.nav.orders" },
] as const;

const AdminNav = () => {
  const { t } = useTranslation();

  return (
    <nav
      className="overflow-x-auto"
      aria-label="Admin sections"
    >
      <div className="flex min-w-max items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/70 p-1">
        {navLinks.map(({ to, end, key }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `rounded-lg px-5 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "bg-white text-primary-700 shadow-sm ring-1 ring-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`
            }
          >
            {t(key)}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default AdminNav;

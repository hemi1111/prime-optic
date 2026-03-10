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
      className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2"
      aria-label="Admin sections"
    >
      {navLinks.map(({ to, end, key }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary-600 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-200"
            }`
          }
        >
          {t(key)}
        </NavLink>
      ))}
    </nav>
  );
};

export default AdminNav;

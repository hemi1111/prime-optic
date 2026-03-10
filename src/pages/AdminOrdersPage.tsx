import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from "../hooks/useTranslation";
import { useToast } from "../hooks/useToast";
import { getReadableErrorMessage } from "../utils/errorHandler";
import type { Order } from "../types/product";
import {
  queryAllOrders,
  updateOrderStatus,
} from "../services/orderService";
import { AdminNav } from "../components/admin";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const ORDER_STATUSES: Order["status"][] = [
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
];

const AdminOrdersPage = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [salesTimeRange, setSalesTimeRange] = useState<"7" | "30" | "90">("30");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    void loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openOrderId &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenOrderId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openOrderId]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const all = await queryAllOrders();
      setOrders(all);
    } catch (error) {
      const errorMessage = getReadableErrorMessage(error, t);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (
    id: string | undefined,
    status: Order["status"],
  ) => {
    if (!id) return;
    setIsLoading(true);
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status } : order,
        ),
      );
      toast.success(t("toast.admin.orderUpdated"));
    } catch (error) {
      const errorMessage = getReadableErrorMessage(error, t);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  function getOrderDate(order: Order): Date {
    const raw = order.createdAt;
    if (!raw) return new Date(0);
    const o = raw as { toDate?: () => Date };
    if (typeof o.toDate === "function") return o.toDate();
    return raw as Date;
  }

  const dashboardData = useMemo(() => {
    const days = parseInt(salesTimeRange, 10);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setHours(0, 0, 0, 0);
    const filtered = orders.filter((o) => getOrderDate(o) >= cutoff);
    const revenueTotal = filtered
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.total ?? 0), 0);
    const orderCount = filtered.length;
    const avgOrder =
      orderCount > 0 ? revenueTotal / orderCount : 0;

    const dayMap = new Map<string, { date: string; revenue: number; orders: number }>();
    for (let d = days - 1; d >= 0; d--) {
      const dte = new Date();
      dte.setDate(dte.getDate() - d);
      dte.setHours(0, 0, 0, 0);
      const key = dte.toISOString().slice(0, 10);
      dayMap.set(key, { date: key, revenue: 0, orders: 0 });
    }
    filtered.forEach((o) => {
      const key = getOrderDate(o).toISOString().slice(0, 10);
      const cell = dayMap.get(key);
      if (cell) {
        cell.orders += 1;
        if (o.status !== "cancelled") cell.revenue += o.total ?? 0;
      }
    });
    const revenueOverTime = Array.from(dayMap.entries())
      .map(([, v]) => v)
      .sort((a, b) => a.date.localeCompare(b.date));

    const statusCounts: Record<string, number> = {
      pending: 0,
      confirmed: 0,
      preparing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    filtered.forEach((o) => {
      if (o.status && statusCounts[o.status] !== undefined)
        statusCounts[o.status] += 1;
    });
    const ordersByStatus = Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));

    const productCounts = new Map<string, { quantity: number; revenue: number }>();
    filtered.forEach((o) => {
      (o.items ?? []).forEach((item) => {
        const name = item.name || "Unknown";
        const existing = productCounts.get(name) ?? {
          quantity: 0,
          revenue: 0,
        };
        const q = item.quantity ?? 1;
        const rev = (item.price ?? 0) * q;
        productCounts.set(name, {
          quantity: existing.quantity + q,
          revenue: existing.revenue + rev,
        });
      });
    });
    const topProducts = Array.from(productCounts.entries())
      .map(([name, data]) => ({ name, quantity: data.quantity, revenue: data.revenue }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    return {
      revenueTotal,
      orderCount,
      avgOrder,
      revenueOverTime,
      ordersByStatus,
      topProducts,
    };
  }, [orders, salesTimeRange]);

  const CHART_COLORS = ["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#64748b"];

  return (
    <div className="space-y-6">
      <AdminNav />
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {t("admin.orders.title")}
          </h1>
          <p className="text-sm text-slate-500">
            {t("admin.orders.description")}
          </p>
        </div>
        <button
          type="button"
          onClick={loadOrders}
          disabled={isLoading}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {isLoading ? t("common.loading") : t("admin.orders.refreshButton")}
        </button>
      </div>

      {/* Sales dashboard */}
      <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {t("admin.products.dashboard.title")}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">
              {t("admin.products.dashboard.timeRange")}:
            </span>
            <select
              value={salesTimeRange}
              onChange={(e) =>
                setSalesTimeRange(e.target.value as "7" | "30" | "90")
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="7">{t("admin.products.dashboard.last7Days")}</option>
              <option value="30">{t("admin.products.dashboard.last30Days")}</option>
              <option value="90">{t("admin.products.dashboard.last90Days")}</option>
            </select>
          </div>
        </div>
        {isLoading && orders.length === 0 ? (
          <p className="text-sm text-slate-500">
            {t("admin.products.dashboard.loading")}
          </p>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {t("admin.products.dashboard.totalRevenue")}
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {dashboardData.revenueTotal.toFixed(2)} €
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {t("admin.products.dashboard.ordersCount")}
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {dashboardData.orderCount}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {t("admin.products.dashboard.averageOrder")}
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {dashboardData.avgOrder.toFixed(2)} €
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {t("admin.products.dashboard.ordersByStatus")}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {dashboardData.ordersByStatus.filter((s) => s.value > 0).length}{" "}
                  statuses
                </p>
              </div>
            </div>
            {dashboardData.revenueOverTime.length === 0 &&
            dashboardData.topProducts.length === 0 ? (
              <p className="text-sm text-slate-500">
                {t("admin.products.dashboard.noData")}
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="min-h-[280px]">
                  <h3 className="mb-2 text-sm font-medium text-slate-700">
                    {t("admin.products.dashboard.revenueOverTime")}
                  </h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={dashboardData.revenueOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11 }}
                        tickFormatter={(v) =>
                          new Date(v).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })
                        }
                      />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v} €`} />
                      <Tooltip
                        formatter={(value) => [
                          `${Number(value ?? 0).toFixed(2)} €`,
                          t("admin.products.dashboard.totalRevenue"),
                        ]}
                        labelFormatter={(label) =>
                          new Date(label).toLocaleDateString()
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#0ea5e9"
                        fill="#0ea5e9"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="min-h-[280px]">
                  <h3 className="mb-2 text-sm font-medium text-slate-700">
                    {t("admin.products.dashboard.ordersOverTime")}
                  </h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={dashboardData.revenueOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11 }}
                        tickFormatter={(v) =>
                          new Date(v).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })
                        }
                      />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        labelFormatter={(label) =>
                          new Date(label).toLocaleDateString()
                        }
                      />
                      <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="min-h-[280px]">
                  <h3 className="mb-2 text-sm font-medium text-slate-700">
                    {t("admin.products.dashboard.ordersByStatus")}
                  </h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={dashboardData.ordersByStatus.filter((s) => s.value > 0)}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {dashboardData.ordersByStatus
                          .filter((s) => s.value > 0)
                          .map((_, index) => (
                            <Cell
                              key={index}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="min-h-[280px]">
                  <h3 className="mb-2 text-sm font-medium text-slate-700">
                    {t("admin.products.dashboard.topProducts")}
                  </h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                      data={dashboardData.topProducts}
                      layout="vertical"
                      margin={{ left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={120}
                        tick={{ fontSize: 10 }}
                        tickFormatter={(v) =>
                          v.length > 18 ? `${v.slice(0, 18)}…` : v
                        }
                      />
                      <Tooltip
                        formatter={(_value, _name, props) => {
                          const p = props?.payload as { quantity: number; revenue: number } | undefined;
                          if (!p) return null;
                          return `${p.quantity} units, ${p.revenue.toFixed(2)} €`;
                        }}
                      />
                      <Bar dataKey="quantity" fill="#10b981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
        {orders.length === 0 ? (
          <p className="text-sm text-slate-500">
            {t("admin.orders.empty")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">
                    {t("admin.orders.table.order")}
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">
                    {t("admin.orders.table.customer")}
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">
                    {t("admin.orders.table.products")}
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">
                    {t("admin.orders.table.total")}
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">
                    {t("admin.orders.table.status")}
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-slate-600">
                    {t("admin.orders.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">
                        #{order.id?.slice(-8).toUpperCase()}
                      </div>
                      <div className="text-xs text-slate-500">
                        {order.createdAt &&
                          // Firestore Timestamp or Date
                          new Date(
                            order.createdAt?.toDate
                              ? order.createdAt.toDate()
                              : order.createdAt,
                          ).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-900">
                        {order.customerInfo?.fullName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {order.customerInfo?.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <ul className="list-inside list-disc text-slate-700 text-xs space-y-0.5">
                        {(order.items ?? []).length === 0 ? (
                          <li className="text-slate-400">—</li>
                        ) : (
                          (order.items ?? []).map((item, idx) => (
                            <li key={idx}>
                              {item.name} × {item.quantity}
                            </li>
                          ))
                        )}
                      </ul>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900">
                        {order.total.toFixed(2)} €
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700">
                        {t(`admin.orders.status.${order.status}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div
                        ref={openOrderId === order.id ? dropdownRef : null}
                        className="relative flex justify-end"
                      >
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() =>
                            setOpenOrderId((prev) =>
                              prev === order.id ? null : order.id ?? null,
                            )
                          }
                          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                          aria-expanded={openOrderId === order.id}
                          aria-haspopup="true"
                        >
                          {t("admin.orders.table.actions")} ▾
                        </button>
                        {openOrderId === order.id && (
                          <div
                            className="absolute right-0 top-full z-10 mt-1 min-w-[140px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
                            role="menu"
                          >
                            {ORDER_STATUSES.map((status) => (
                              <button
                                key={status}
                                type="button"
                                disabled={isLoading}
                                onClick={() => {
                                  void handleStatusChange(order.id, status);
                                  setOpenOrderId(null);
                                }}
                                className="block w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                                role="menuitem"
                              >
                                {t(`admin.orders.actions.${status === "confirmed" ? "confirm" : status === "cancelled" ? "cancel" : status}`)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;


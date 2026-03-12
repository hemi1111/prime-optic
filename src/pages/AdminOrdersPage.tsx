import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getStatusBadgeClasses } from "../utils/adminUtils";

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isLoading ? t("common.loading") : t("admin.orders.refreshButton")}
        </button>
      </div>

      {/* Sales dashboard */}
      <div className="rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            {t("admin.products.dashboard.title")}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">{t("admin.products.dashboard.timeRange")}:</span>
            <select
              value={salesTimeRange}
              onChange={(e) => setSalesTimeRange(e.target.value as "7" | "30" | "90")}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="7">{t("admin.products.dashboard.last7Days")}</option>
              <option value="30">{t("admin.products.dashboard.last30Days")}</option>
              <option value="90">{t("admin.products.dashboard.last90Days")}</option>
            </select>
          </div>
        </div>
        <div className="p-6">
        {isLoading && orders.length === 0 ? (
          <p className="text-sm text-slate-500">
            {t("admin.products.dashboard.loading")}
          </p>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4 ring-1 ring-slate-100" style={{ borderLeftWidth: 4, borderLeftColor: "#10b981" }}>
                <div className="flex items-start justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t("admin.products.dashboard.totalRevenue")}
                  </p>
                  <div className="rounded-lg bg-emerald-50 p-1.5">
                    <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {dashboardData.revenueTotal.toFixed(2)} €
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 ring-1 ring-slate-100" style={{ borderLeftWidth: 4, borderLeftColor: "#0ea5e9" }}>
                <div className="flex items-start justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t("admin.products.dashboard.ordersCount")}
                  </p>
                  <div className="rounded-lg bg-sky-50 p-1.5">
                    <svg className="h-4 w-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {dashboardData.orderCount}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 ring-1 ring-slate-100" style={{ borderLeftWidth: 4, borderLeftColor: "#8b5cf6" }}>
                <div className="flex items-start justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t("admin.products.dashboard.averageOrder")}
                  </p>
                  <div className="rounded-lg bg-violet-50 p-1.5">
                    <svg className="h-4 w-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {dashboardData.avgOrder.toFixed(2)} €
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 ring-1 ring-slate-100" style={{ borderLeftWidth: 4, borderLeftColor: "#f59e0b" }}>
                <div className="flex items-start justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t("admin.products.dashboard.ordersByStatus")}
                  </p>
                  <div className="rounded-lg bg-amber-50 p-1.5">
                    <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  {dashboardData.ordersByStatus.filter((s) => s.value > 0).length}{" "}active statuses
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
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                        contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
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
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="min-h-[280px]">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                        contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                        labelFormatter={(label) =>
                          new Date(label).toLocaleDateString()
                        }
                      />
                      <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="min-h-[280px]">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="min-h-[280px]">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                        contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
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
      </div>

      <div className="rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            {t("admin.orders.title")}
            <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{orders.length}</span>
          </h2>
        </div>
        {orders.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-500">
            {t("admin.orders.empty")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-100 bg-slate-50/70">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{t("admin.orders.table.order")}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{t("admin.orders.table.customer")}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{t("admin.orders.table.products")}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{t("admin.orders.table.total")}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{t("admin.orders.table.status")}</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">{t("admin.orders.table.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">
                        #{order.id?.slice(-8).toUpperCase()}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {order.createdAt &&
                          new Date(
                            order.createdAt?.toDate
                              ? order.createdAt.toDate()
                              : order.createdAt,
                          ).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">
                        {order.customerInfo?.fullName}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {order.customerInfo?.email}
                      </div>
                    </td>
                    <td className="max-w-[200px] px-4 py-3">
                      <ul className="space-y-0.5 text-xs text-slate-600">
                        {(order.items ?? []).length === 0 ? (
                          <li className="text-slate-400">—</li>
                        ) : (
                          (order.items ?? []).map((item, idx) => (
                            <li key={idx} className="flex items-center gap-1">
                              <span className="h-1 w-1 rounded-full bg-slate-300 shrink-0" />
                              {item.name} × {item.quantity}
                            </li>
                          ))
                        )}
                      </ul>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900">
                        {order.total.toFixed(2)} €
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusBadgeClasses(order.status)}`}>
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
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50"
                          aria-expanded={openOrderId === order.id}
                          aria-haspopup="true"
                          title="Change status"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        {openOrderId === order.id && (
                          <div
                            className="absolute right-0 top-full z-10 mt-1 min-w-[160px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                            role="menu"
                          >
                            <div className="border-b border-slate-100 px-3 py-2">
                              <p className="text-xs font-semibold text-slate-500">Set status</p>
                            </div>
                            {ORDER_STATUSES.map((status) => (
                              <button
                                key={status}
                                type="button"
                                disabled={isLoading}
                                onClick={() => {
                                  void handleStatusChange(order.id, status);
                                  setOpenOrderId(null);
                                }}
                                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium hover:bg-slate-50 disabled:opacity-50 ${order.status === status ? "bg-slate-50 text-primary-600" : "text-slate-700"}`}
                                role="menuitem"
                              >
                                <span className={`h-2 w-2 rounded-full shrink-0 ${getStatusBadgeClasses(status).split(" ")[0]}`} />
                                {t(`admin.orders.actions.${status === "confirmed" ? "confirm" : status === "cancelled" ? "cancel" : status}`)}
                                {order.status === status && (
                                  <svg className="ml-auto h-3 w-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
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


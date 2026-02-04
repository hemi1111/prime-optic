import { useMemo } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import type { Order } from "../../types/product";
import OrderCard from "./OrderCard";

interface OrdersSectionProps {
  orders: Order[];
}

const OrdersSection = ({ orders }: OrdersSectionProps) => {
  const { t } = useTranslation();

  // Sort orders by date (newest first)
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const dateA = a.createdAt?.toDate?.()?.getTime() || 0;
      const dateB = b.createdAt?.toDate?.()?.getTime() || 0;
      return dateB - dateA;
    });
  }, [orders]);

  return (
    <div className="rounded-2xl bg-white p-8 shadow-soft ring-1 ring-slate-200">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          {t("profile.orders.title")}
        </h2>
        <p className="text-slate-600">{t("profile.orders.description")}</p>
      </div>

      {sortedOrders.length > 0 ? (
        <div className="mt-6 space-y-6">
          {sortedOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-lg text-slate-600 mb-4">
            {t("profile.orders.none")}
          </p>
          <p className="text-sm text-slate-500 mb-4">
            {t("profile.orders.noneDescription")}
          </p>
          <div className="flex justify-center gap-3">
            <a
              href="/glasses"
              className="inline-flex rounded-lg bg-primary-500 px-6 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
            >
              {t("cart.browseGlasses")}
            </a>
            <a
              href="/sunglasses"
              className="inline-flex rounded-lg border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-700 hover:border-primary-500 hover:text-primary-600 transition-colors"
            >
              {t("cart.browseSunglasses")}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersSection;

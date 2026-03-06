import { Link } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import { useCurrency } from "../../hooks/useCurrency";

import type { CartItem, DeliveryOption } from "../../types/product";

type OrderSummaryProps = {
  items: CartItem[];
  selectedDelivery: DeliveryOption;
  subtotal: number;
  deliveryFee: number;
  total: number;
};

const OrderSummary = ({
  items,
  selectedDelivery,
  subtotal,
  deliveryFee,
  total,
}: OrderSummaryProps) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  return (
    <aside className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-soft ring-1 ring-slate-100 md:sticky md:top-24 md:self-start">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold tracking-tight text-slate-900">
          {t("common.orderSummary")}
        </h2>
        <Link
          to="/cart"
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          {t("checkout.editCart")}
        </Link>
      </div>
      <ul className="max-h-52 space-y-3 overflow-y-auto text-sm">
        {items.map((item, index) => (
          <li
            key={`${item.id}-${index}`}
            className="flex items-start justify-between gap-2"
          >
            <div className="min-w-0 flex-1">
              <span className="font-medium text-slate-900">{item.name}</span>
              <span className="block text-xs text-slate-500">
                {t("common.qty")} {item.quantity}
                {item.selectedColorName &&
                  " · " + t("common.color") + ": " + item.selectedColorName}
                {item.addBlueLightFilter && " · " + t("common.blueLightFilter")}
              </span>
            </div>
            <span className="shrink-0 font-medium text-slate-900">
              {formatPrice(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>
      <div className="space-y-2 border-t border-slate-200 pt-4 mt-4 text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <span>{t("common.subtotal")}</span>
          <span className="font-medium text-slate-900">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>
            {t("common.delivery")} ({t(`delivery.${selectedDelivery.id}.name`)})
          </span>
          <span className="font-medium text-slate-900">
            {deliveryFee === 0 ? t("common.free") : formatPrice(deliveryFee)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
          <span>{t("common.total")}</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="text-xs text-slate-600 bg-slate-100 rounded-lg p-3 border border-slate-200 mt-3">
          {t("common.paymentCashOnDelivery")}
        </div>
      </div>
    </aside>
  );
};

export default OrderSummary;

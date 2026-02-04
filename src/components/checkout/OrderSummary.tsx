import { useTranslation } from "../../hooks/useTranslation";

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
  return (
    <aside className="space-y-4 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
      <h2 className="text-sm font-semibold tracking-tight text-slate-900">
        {t("common.orderSummary")}
      </h2>
      <ul className="max-h-60 space-y-2 overflow-y-auto text-xs text-slate-600">
        {items.map((item, index) => (
          <li
            key={`${item.id}-${index}`}
            className="flex items-center justify-between"
          >
            <div className="flex flex-1 flex-col">
              <span className="font-medium text-slate-900">{item.name}</span>
              <span className="text-[11px] text-slate-500">
                {t("common.qty")} {item.quantity}
                {item.addBlueLightFilter && " + " + t("common.blueLightFilter")}
              </span>
            </div>
            <span className="font-medium text-slate-900">
              €{(item.price * item.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
      <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
        <div className="flex items-center justify-between">
          <span>{t("common.subtotal")}</span>
          <span className="font-medium text-slate-900">
            €{subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>
            {t("common.delivery")} ({t(`delivery.${selectedDelivery.id}.name`)})
          </span>
          <span className="font-medium text-slate-900">
            {deliveryFee === 0
              ? t("common.free")
              : `€${deliveryFee.toFixed(2)}`}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm font-semibold text-slate-900">
          <span>{t("common.total")}</span>
          <span>€{total.toFixed(2)}</span>
        </div>
        <div className="text-xs text-slate-500 bg-amber-50 p-2 rounded-md border border-amber-200">
          💰 {t("common.paymentCashOnDelivery")}
        </div>
      </div>
    </aside>
  );
};

export default OrderSummary;

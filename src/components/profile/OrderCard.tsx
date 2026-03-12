import { useTranslation } from "../../hooks/useTranslation";
import { useCurrency } from "../../hooks/useCurrency";
import type { Order } from "../../types/product";
import { formatOrderDate } from "./utils";
import OrderItem from "./OrderItem";

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const { t, language } = useTranslation();
  const { formatPrice } = useCurrency();

  const getStatusLabel = (status: string | undefined): string => {
    switch (status) {
      case "delivered":
        return t("profile.orders.status.delivered");
      case "shipped":
        return t("profile.orders.status.shipped");
      case "confirmed":
        return t("profile.orders.status.confirmed");
      case "preparing":
        return "Preparing";
      case "cancelled":
        return "Cancelled";
      default:
        return t("profile.orders.status.pending");
    }
  };

  const getStatusStyles = (status: string | undefined): string => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700 border border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "confirmed":
        return "bg-green-100 text-green-700 border border-green-200";
      case "preparing":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow-md transition-all">
      {/* Order Header */}
      <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {t("profile.orders.order")} #{order.id?.slice(-8).toUpperCase()}
          </h3>
          <p className="text-sm text-slate-500">{formatOrderDate(order, language)}</p>
        </div>
        <span
          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyles(
            order.status
          )}`}
        >
          {getStatusLabel(order.status)}
        </span>
      </div>

      {/* Order Items */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">
          {t("profile.orders.items")} ({order.items?.length || 0})
        </h4>
        {order.items?.map((item, index) => (
          <OrderItem key={`${item.id}-${index}`} item={item} index={index} />
        ))}
      </div>

      {/* Order Summary */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">{t("common.delivery")}:</span>
          <span className="font-medium text-slate-900">
            {order.deliveryInfo?.option?.id
              ? t(`delivery.${order.deliveryInfo.option.id}.name`)
              : order.deliveryInfo?.option?.name || "N/A"}
          </span>
        </div>
        {order.deliveryInfo?.option?.id === "home_delivery" &&
          order.deliveryInfo?.address && (
            <div className="flex items-start justify-between text-sm">
              <span className="text-slate-600">
                {t("profile.orders.address")}:
              </span>
              <span className="text-right text-slate-900 max-w-[60%]">
                {order.deliveryInfo.address.street},{" "}
                {order.deliveryInfo.address.city},{" "}
                {order.deliveryInfo.address.postalCode}
              </span>
            </div>
          )}
        <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-100">
          <span className="text-slate-600">{t("common.subtotal")}:</span>
          <span className="text-slate-900">
            {formatPrice(order.subtotal ?? 0)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">{t("common.deliveryFee")}:</span>
          <span className="text-slate-900">
            {formatPrice(order.deliveryFee ?? 0)}
          </span>
        </div>
        <div className="flex items-center justify-between text-base font-bold pt-2 border-t-2 border-slate-200">
          <span className="text-slate-900">{t("common.total")}:</span>
          <span className="text-primary-600">
            {formatPrice(order.total ?? 0)}
          </span>
        </div>
      </div>

      {/* Payment Info */}
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center gap-2 text-amber-800">
       $
          <span className="text-xs font-medium">
            {t("profile.orders.payment")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;

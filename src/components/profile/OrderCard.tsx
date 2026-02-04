import { useTranslation } from "../../hooks/useTranslation";
import type { Order } from "../../types/product";
import { formatOrderDate } from "./utils";
import OrderItem from "./OrderItem";

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const { t } = useTranslation();

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
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "preparing":
        return "bg-purple-100 text-purple-700 border border-purple-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border border-red-200";
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
          <p className="text-sm text-slate-500">{formatOrderDate(order)}</p>
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
          <span className="text-slate-600">{t("profile.orders.delivery")}:</span>
          <span className="font-medium text-slate-900">
            {order.deliveryInfo?.option?.name || "N/A"}
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
          <span className="text-slate-600">Subtotal:</span>
          <span className="text-slate-900">
            €{order.subtotal?.toFixed(2) || "0.00"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Delivery Fee:</span>
          <span className="text-slate-900">
            €{order.deliveryFee?.toFixed(2) || "0.00"}
          </span>
        </div>
        <div className="flex items-center justify-between text-base font-bold pt-2 border-t-2 border-slate-200">
          <span className="text-slate-900">{t("profile.orders.total")}:</span>
          <span className="text-primary-600">
            €{order.total?.toFixed(2) || "0.00"}
          </span>
        </div>
      </div>

      {/* Payment Info */}
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center gap-2 text-amber-800">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.514 1.106c.562.609 1.288.96 2.357.96 1.069 0 1.795-.35 2.357-.96A1 1 0 0013 14h1a1 1 0 100-2h-1v-.892a4.535 4.535 0 001.676-.662C15.398 9.766 16 8.991 16 8c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0013 5.092V4.151c.391.127.68.317.843.504a1 1 0 101.511-1.106c-.563-.609-1.288-.96-2.354-.96-1.066 0-1.791.351-2.354.96A1 1 0 007 4h1a1 1 0 100 2H7v.892z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs font-medium">
            {t("profile.orders.payment")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;

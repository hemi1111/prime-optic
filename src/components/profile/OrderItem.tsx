import { useTranslation } from "../../hooks/useTranslation";
import type { CartItem } from "../../types/product";

interface OrderItemProps {
  item: CartItem;
  index: number;
}

const OrderItem = ({ item, index }: OrderItemProps) => {
  const { t } = useTranslation();

  const itemPrice =
    item.price +
    (item.addBlueLightFilter ? item.blueLightFilterPrice || 0 : 0);
  const totalPrice = itemPrice * item.quantity;

  return (
    <div className="flex gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
      <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-xs text-slate-400 text-center px-2">
            {t("common.noImage")}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h5 className="text-sm font-semibold text-slate-900 truncate">
              {item.name}
            </h5>
            <p className="text-xs text-slate-500 mt-0.5">{item.brand}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
              <span>Qty: {item.quantity}</span>
              {item.addBlueLightFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Blue Light Filter
                </span>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-sm font-semibold text-slate-900">
              €{totalPrice.toFixed(2)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-slate-500">
                €{itemPrice.toFixed(2)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;

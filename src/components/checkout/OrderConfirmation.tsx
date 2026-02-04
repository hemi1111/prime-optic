import { useTranslation } from "../../hooks/useTranslation";

import type { DeliveryOption } from "../../types/product";

type CustomerInfo = {
  fullName: string;
  email: string;
  phone: string;
};

type DeliveryAddress = {
  street: string;
  city: string;
  postalCode: string;
  country: string;
};

type OrderConfirmationProps = {
  customerInfo: CustomerInfo;
  selectedDelivery: DeliveryOption;
  deliveryAddress: DeliveryAddress;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

const OrderConfirmation = ({
  customerInfo,
  selectedDelivery,
  deliveryAddress,
  onBack,
  onSubmit,
  isSubmitting,
}: OrderConfirmationProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 text-sm">
      <h3 className="font-semibold text-slate-900">
        {t("common.confirmOrder")}
      </h3>

      <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
        <div>
          <h4 className="font-medium text-slate-900">
            {t("common.contactInformation")}
          </h4>
          <p className="text-slate-600">{customerInfo.fullName}</p>
          <p className="text-slate-600">{customerInfo.email}</p>
          <p className="text-slate-600">{customerInfo.phone}</p>
        </div>

        <div>
          <h4 className="font-medium text-slate-900">
            {t("common.deliveryMethod")}
          </h4>
          <p className="text-slate-600">
            {t(`delivery.${selectedDelivery.id}.name`)} -{" "}
            {selectedDelivery.price === 0
              ? t("common.free")
              : `€${selectedDelivery.price}`}
          </p>
          {selectedDelivery.id === "home_delivery" &&
            deliveryAddress.street && (
              <p className="text-slate-600 text-xs">
                {deliveryAddress.street}, {deliveryAddress.city}{" "}
                {deliveryAddress.postalCode}
              </p>
            )}
        </div>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center gap-2 text-amber-800">
          <span>💰</span>
          <span className="font-medium">{t("common.cashOnDelivery")}</span>
        </div>
        <p className="text-xs text-amber-700 mt-1">
          {t("common.confirmDeliveryDetails")}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-700 hover:border-primary-500 hover:text-primary-600"
        >
          {t("checkout.back")}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primary-600 disabled:opacity-50"
        >
          {isSubmitting ? t("common.placingOrder") : t("common.placeOrder")}
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;

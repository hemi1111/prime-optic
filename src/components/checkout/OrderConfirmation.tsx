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
    <div className="space-y-6 text-sm">
      <h3 className="text-base font-bold text-slate-900">
        {t("common.confirmOrder")}
      </h3>

      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
            {t("common.contactInformation")}
          </h4>
          <p className="font-medium text-slate-900">{customerInfo.fullName}</p>
          <p className="text-slate-600">{customerInfo.email}</p>
          <p className="text-slate-600">{customerInfo.phone}</p>
        </div>
        <div className="border-t border-slate-200 pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
            {t("common.deliveryMethod")}
          </h4>
          <p className="font-medium text-slate-900">
            {t(`delivery.${selectedDelivery.id}.name`)}{" "}
            {selectedDelivery.price === 0 ? t("common.free") : `(€${selectedDelivery.price})`}
          </p>
          {selectedDelivery.id === "home_delivery" && deliveryAddress.street && (
            <p className="text-slate-600 mt-0.5">
              {deliveryAddress.street}, {deliveryAddress.city} {deliveryAddress.postalCode}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-100 p-3 text-slate-700">
        <p className="text-xs">
          {t("common.paymentCashOnDelivery")}. {t("common.confirmDeliveryDetails")}
        </p>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border-2 border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-primary-500 hover:text-primary-600 transition"
        >
          {t("checkout.back")}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-3.5 text-sm font-bold text-white shadow-soft hover:from-primary-600 hover:to-primary-700 disabled:opacity-60 transition"
        >
          {isSubmitting ? t("common.placingOrder") : t("common.placeOrder")}
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;

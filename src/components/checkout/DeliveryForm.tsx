import Field from "../ui/Field";

import { deliveryOptions } from "../../services/orderService";
import { useTranslation } from "../../hooks/useTranslation";

import type { DeliveryOption } from "../../types/product";

type DeliveryAddress = {
  street: string;
  city: string;
  postalCode: string;
  country: string;
};

type DeliveryFormProps = {
  selectedDelivery: DeliveryOption;
  setSelectedDelivery: (option: DeliveryOption) => void;
  deliveryAddress: DeliveryAddress;
  setDeliveryAddress: (address: DeliveryAddress) => void;
  onBack: () => void;
  onNext: () => void;
};

const DeliveryForm = ({
  selectedDelivery,
  setSelectedDelivery,
  deliveryAddress,
  setDeliveryAddress,
  onBack,
  onNext,
}: DeliveryFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      selectedDelivery.id === "pickup" ||
      (deliveryAddress.street && deliveryAddress.city)
    ) {
      onNext();
    }
  };

  const { t } = useTranslation();

  return (
    <form className="space-y-4 text-sm" onSubmit={handleSubmit}>
      <h3 className="font-semibold text-slate-900">
        {t("common.deliveryOptions")}
      </h3>

      <div className="space-y-3">
        {deliveryOptions.map((option) => (
          <label
            key={option.id}
            className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedDelivery.id === option.id
                ? "border-primary-500 bg-primary-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <input
              type="radio"
              name="delivery"
              value={option.id}
              checked={selectedDelivery.id === option.id}
              onChange={() => setSelectedDelivery(option)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-medium text-slate-900 flex items-center gap-2">
                {t(`delivery.${option.id}.name`)}
                <span className="text-primary-600 font-semibold">
                  {option.price === 0 ? t("common.free") : `+€${option.price}`}
                </span>
              </div>
              <div className="text-xs text-slate-500">
                {t(`delivery.${option.id}.description`)}
              </div>
              <div className="text-xs text-slate-400">
                {t(`delivery.${option.id}.estimatedDays`)}
              </div>
            </div>
          </label>
        ))}
      </div>

      {selectedDelivery.id === "home_delivery" && (
        <div className="space-y-3 p-4 bg-slate-50 rounded-lg border">
          <h4 className="font-medium text-slate-900">
            {t("checkout.deliveryAddress")}
          </h4>
          <Field
            label={t("common.streetAddress")}
            id="street"
            value={deliveryAddress.street}
            onChange={(e) =>
              setDeliveryAddress({ ...deliveryAddress, street: e.target.value })
            }
            placeholder="Street and number"
            required
          />
          <div className="grid gap-3 md:grid-cols-2">
            <Field
              label={t("common.city")}
              id="city"
              value={deliveryAddress.city}
              onChange={(e) =>
                setDeliveryAddress({ ...deliveryAddress, city: e.target.value })
              }
              placeholder="City"
              required
            />
            <Field
              label={t("common.postalCode")}
              id="postal"
              value={deliveryAddress.postalCode}
              onChange={(e) =>
                setDeliveryAddress({
                  ...deliveryAddress,
                  postalCode: e.target.value,
                })
              }
              placeholder="1001"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-700 hover:border-primary-500 hover:text-primary-600"
        >
          {t("checkout.back")}
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primary-600"
        >
          {t("common.continueToConfirmation")}
        </button>
      </div>
    </form>
  );
};

export default DeliveryForm;

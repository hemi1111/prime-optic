import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";

import { createOrder, deliveryOptions } from "../services/orderService";

import { useTranslation } from "../hooks/useTranslation";
import { useToast } from "../hooks/useToast";
import { getReadableErrorMessage } from "../utils/errorHandler";

import CheckoutStepper from "../components/checkout/CheckoutStepper";
import OrderSummary from "../components/checkout/OrderSummary";
import ContactForm from "../components/checkout/ContactForm";
import DeliveryForm from "../components/checkout/DeliveryForm";
import OrderConfirmation from "../components/checkout/OrderConfirmation";

import type { DeliveryOption } from "../types/product";

type Step = 1 | 2 | 3;

const CheckoutPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [step, setStep] = useState<Step>(1);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>(
    deliveryOptions[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    fullName: user?.displayName || "",
    email: user?.email || "",
    phone: "",
  });

  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "Albania",
  });

  const deliveryFee = selectedDelivery.price;
  const total = subtotal + deliveryFee;

  if (!items.length) {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          No items to checkout
        </h1>
        <p className="text-sm text-slate-500">
          Your cart is empty. Add products first, then return here to complete
          your order.
        </p>
      </div>
    );
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const deliveryInfo: any = {
        option: selectedDelivery,
      };

      if (selectedDelivery.id === "home_delivery" && deliveryAddress) {
        deliveryInfo.address = deliveryAddress;
      }

      // Clean up cart items to remove undefined values
      const cleanItems = items.map((item) => {
        const cleanItem: any = { ...item };
        if (cleanItem.addBlueLightFilter === undefined) {
          cleanItem.addBlueLightFilter = false;
        }
        if (cleanItem.variant === undefined) {
          delete cleanItem.variant;
        }
        return cleanItem;
      });

      const orderId = await createOrder({
        userId: user?.id,
        items: cleanItems,
        customerInfo,
        deliveryInfo,
        subtotal,
        deliveryFee,
        total,
      });

      toast.success(
        `Order placed successfully! Order ID: ${orderId}. You'll receive a confirmation call within 24 hours.`
      );
      clearCart();
      navigate("/");
    } catch (error) {
      console.error("Order creation failed:", error);
      const errorMessage = getReadableErrorMessage(error, t);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Checkout
        </h1>
        <p className="text-sm text-slate-500">
          {t("common.cashOnDelivery")} - pay when you receive your order.{" "}
          {selectedDelivery.id === "home_delivery"
            ? "+€2 delivery fee"
            : "Free store pickup"}
        </p>
      </header>

      <CheckoutStepper currentStep={step} />

      <div className="grid gap-6 md:grid-cols-[minmax(0,3fr),minmax(0,2fr)]">
        <section className="space-y-4 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
          {step === 1 && (
            <ContactForm
              customerInfo={customerInfo}
              setCustomerInfo={setCustomerInfo}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <DeliveryForm
              selectedDelivery={selectedDelivery}
              setSelectedDelivery={setSelectedDelivery}
              deliveryAddress={deliveryAddress}
              setDeliveryAddress={setDeliveryAddress}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <OrderConfirmation
              customerInfo={customerInfo}
              selectedDelivery={selectedDelivery}
              deliveryAddress={deliveryAddress}
              onBack={() => setStep(2)}
              onSubmit={handleFinalSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </section>

        <OrderSummary
          items={items}
          subtotal={subtotal}
          selectedDelivery={selectedDelivery}
          deliveryFee={deliveryFee}
          total={total}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;

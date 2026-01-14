import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";

type Step = 1 | 2 | 3;

const CheckoutPage = () => {
  const items = useCartStore((state) => state.items);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const [step, setStep] = useState<Step>(1);

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

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Checkout
        </h1>
        <p className="text-sm text-slate-500">
          The UI mirrors a real-world checkout. Payment and order creation will
          be connected to Firebase and a payment provider next.
        </p>
      </header>

      <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
        <StepPill active={step === 1} label="Contact details" />
        <div className="h-px flex-1 bg-slate-200" />
        <StepPill active={step === 2} label="Delivery" />
        <div className="h-px flex-1 bg-slate-200" />
        <StepPill active={step === 3} label="Payment" />
      </div>

      <div className="grid gap-6 md:grid-cols-[minmax(0,3fr),minmax(0,2fr)]">
        <section className="space-y-4 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
          {step === 1 && <ContactForm onNext={() => setStep(2)} />}
          {step === 2 && (
            <DeliveryForm onBack={() => setStep(1)} onNext={() => setStep(3)} />
          )}
          {step === 3 && <PaymentForm onBack={() => setStep(2)} />}
        </section>

        <aside className="space-y-4 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
          <h2 className="text-sm font-semibold tracking-tight text-slate-900">
            Order summary
          </h2>
          <ul className="max-h-60 space-y-2 overflow-y-auto text-xs text-slate-600">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <div className="flex flex-1 flex-col">
                  <span className="font-medium text-slate-900">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Qty {item.quantity}
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
              <span>Subtotal</span>
              <span className="font-medium text-slate-900">
                €{subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Estimated shipping</span>
              <span>Calculated next</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm font-semibold text-slate-900">
              <span>Total</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

type StepPillProps = {
  active: boolean;
  label: string;
};

function StepPill({ active, label }: StepPillProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${
        active
          ? "border-primary-500 bg-primary-50 text-primary-700"
          : "border-slate-200 bg-white"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          active ? "bg-primary-500" : "bg-slate-300"
        }`}
      />
      <span>{label}</span>
    </div>
  );
}

type StepFormProps = {
  onNext?: () => void;
  onBack?: () => void;
};

function ContactForm({ onNext }: StepFormProps) {
  return (
    <form
      className="space-y-4 text-sm"
      onSubmit={(event) => {
        event.preventDefault();
        onNext?.();
      }}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="First name" id="first-name" placeholder="Name" />
        <Field label="Last name" id="last-name" placeholder="Surname" />
      </div>
      <Field
        label="Email"
        id="email"
        type="email"
        placeholder="you@example.com"
      />
      <Field label="Phone" id="phone" type="tel" placeholder="+000 000 000" />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primary-600"
      >
        Continue to delivery
      </button>
    </form>
  );
}

function DeliveryForm({ onBack, onNext }: StepFormProps) {
  return (
    <form
      className="space-y-4 text-sm"
      onSubmit={(event) => {
        event.preventDefault();
        onNext?.();
      }}
    >
      <Field label="Address" id="address" placeholder="Street and number" />
      <div className="grid gap-3 md:grid-cols-3">
        <Field label="City" id="city" placeholder="City" />
        <Field label="ZIP" id="zip" placeholder="0000" />
        <Field label="Country" id="country" placeholder="Country" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-700 hover:border-primary-500 hover:text-primary-600"
        >
          Back
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primary-600"
        >
          Continue to payment
        </button>
      </div>
    </form>
  );
}

function PaymentForm({ onBack }: StepFormProps) {
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clear);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Demo: Show success message, clear cart, and redirect
    alert(
      "Order placed successfully! (This is a demo - no real payment was processed)"
    );
    clearCart();
    navigate("/");
    // In production, this would create an order in Firestore and process payment
  };

  return (
    <form className="space-y-4 text-sm" onSubmit={handleSubmit}>
      <Field
        label="Cardholder name"
        id="card-name"
        placeholder="As shown on card"
      />
      <Field
        label="Card number"
        id="card-number"
        placeholder="0000 0000 0000 0000"
      />
      <div className="grid gap-3 md:grid-cols-3">
        <Field label="Expiry" id="expiry" placeholder="MM/YY" />
        <Field label="CVC" id="cvc" placeholder="123" />
        <Field label="Postal code" id="billing-zip" placeholder="0000" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-700 hover:border-primary-500 hover:text-primary-600"
        >
          Back
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primary-600"
        >
          Place order (demo)
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
};

function Field({ id, label, type = "text", placeholder }: FieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 placeholder:text-slate-400 focus:ring-2"
      />
    </div>
  );
}

export default CheckoutPage;

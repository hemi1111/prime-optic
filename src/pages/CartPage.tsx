import { Link, useNavigate } from "react-router-dom";

import { useCartStore } from "../store/useCartStore";
import { useTranslation } from "../hooks/useTranslation";
import { useCurrency } from "../hooks/useCurrency";

const CartPage = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const navigate = useNavigate();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleCheckout = () => {
    if (!items.length) return;
    navigate("/checkout");
  };

  const formatLegacyVariant = (variant?: string): string | null => {
    if (!variant) return null;

    try {
      const parsed = JSON.parse(variant) as {
        rightEye?: Record<string, string>;
        leftEye?: Record<string, string>;
      };

      const formatEye = (label: string, eye?: Record<string, string>) => {
        if (!eye) return null;
        const parts: string[] = [];
        if (eye.sph?.trim()) parts.push(`SPH ${eye.sph.trim()}`);
        if (eye.cyl?.trim()) parts.push(`CYL ${eye.cyl.trim()}`);
        if (eye.axis?.trim()) parts.push(`AXIS ${eye.axis.trim()}`);
        if (eye.add?.trim()) parts.push(`ADD ${eye.add.trim()}`);
        if (parts.length === 0) return null;
        return `${label}: ${parts.join(", ")}`;
      };

      const right = formatEye("OD", parsed.rightEye);
      const left = formatEye("OS", parsed.leftEye);
      const sections = [right, left].filter(Boolean) as string[];

      if (sections.length === 0) {
        return null;
      }

      return sections.join(" | ");
    } catch {
      return variant;
    }
  };

  if (!items.length) {
    return (
      <div className="mx-auto max-w-lg mt-16 space-y-6 text-center">
        <div className="flex justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {t("cart.empty")}
        </h1>
        <p className="text-slate-600">{t("cart.emptyDescription")}</p>
        <p className="text-sm text-slate-500">
          {t("cart.freeShippingNote", { amount: formatPrice(100) })}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/glasses"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:from-primary-600 hover:to-primary-700"
          >
            {t("cart.browseGlasses")}
          </Link>
          <Link
            to="/sunglasses"
            className="inline-flex items-center justify-center rounded-full border-2 border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary-500 hover:text-primary-600"
          >
            {t("cart.browseSunglasses")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,3fr),minmax(0,2fr)]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft ring-1 ring-slate-100">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 mb-4">
          {t("cart.title")} ({items.length}{" "}
          {items.length === 1 ? "item" : "items"})
        </h1>
        <ul className="divide-y divide-slate-100">
          {items.map((item, index) => (
            <li key={`${item.id}-${index}`} className="flex gap-5 py-5 first:pt-0">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-[10px] text-slate-400">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-20 w-auto max-w-full object-contain"
                  />
                ) : (
                  "Item"
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    {item.brand && (
                      <div className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-0.5">
                        {item.brand}
                      </div>
                    )}
                    <div className="font-medium text-slate-900">
                      {item.name}
                    </div>
                    {item.selectedColorName && (
                      <div className="mt-0.5 text-xs text-slate-600">
                        {t("common.color")}: {item.selectedColorName}
                      </div>
                    )}
                    {item.addBlueLightFilter && (
                      <div className="mt-0.5 flex items-center gap-1 text-xs font-medium text-primary-600">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                        </svg>
                        + {t("common.blueLightFilter")}
                      </div>
                    )}
                    {formatLegacyVariant(item.variant) && (
                      <div className="text-xs text-slate-500">
                        {formatLegacyVariant(item.variant)}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      removeItem(
                        item.id,
                        item.addBlueLightFilter,
                        item.selectedColorName
                      )
                    }
                    className="shrink-0 text-xs text-slate-400 hover:text-red-500 transition"
                  >
                    {t("cart.remove")}
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          Math.max(1, item.quantity - 1),
                          item.addBlueLightFilter,
                          item.selectedColorName
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-l-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                    >
                      −
                    </button>
                    <span className="min-w-[2rem] py-1 text-center text-sm font-semibold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1,
                          item.addBlueLightFilter,
                          item.selectedColorName
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-r-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <aside className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-soft ring-1 ring-slate-100 md:sticky md:top-24 md:self-start">
        <h2 className="text-base font-bold tracking-tight text-slate-900 mb-4">
          {t("common.orderSummary")}
        </h2>
        <dl className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <dt>{t("common.subtotal")}</dt>
            <dd className="font-medium text-slate-900">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt>{t("cart.shipping")}</dt>
            <dd className="text-slate-500">{t("cart.shippingAtCheckout")}</dd>
          </div>
        </dl>
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 mt-4 text-base font-bold text-slate-900">
          <span>{t("common.total")}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <button
          type="button"
          onClick={handleCheckout}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:from-primary-600 hover:to-primary-700 hover:shadow-primary-500/20"
        >
          {t("cart.proceedToCheckout")}
        </button>
      </aside>
    </div>
  );
};

export default CartPage;

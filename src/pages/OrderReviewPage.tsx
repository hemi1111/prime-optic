import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuthStore } from "../store/useAuthStore";
import { getOrderById } from "../services/orderService";
import { submitReview } from "../services/ratingService";
import { useTranslation } from "../hooks/useTranslation";
import { useToast } from "../hooks/useToast";
import { getReadableErrorMessage } from "../utils/errorHandler";

import type { CartItem, Order } from "../types/product";

function getUniqueOrderItems(items: CartItem[]): CartItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

const STAR_COUNT = 5;

const OrderReviewPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();
  const user = useAuthStore((state) => state.user);

  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
      return;
    }
    if (!orderId) {
      navigate("/", { replace: true });
      return;
    }
    let cancelled = false;
    getOrderById(orderId).then((o) => {
      if (!cancelled) {
        setOrder(o);
        if (o && o.userId !== user.id) {
          setOrder(null);
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, [orderId, user, navigate]);

  if (user === undefined) return null;
  if (!user) return null;
  if (order === undefined) {
    return (
      <div className="mx-auto max-w-lg text-center py-12 text-slate-600">
        {t("common.loading")}
      </div>
    );
  }
  if (!order) {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {t("review.orderNotFound")}
        </h1>
        <p className="text-sm text-slate-500">{t("review.orderNotFoundDescription")}</p>
        <Link
          to="/"
          className="inline-block rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          {t("review.backToHome")}
        </Link>
      </div>
    );
  }

  const uniqueItems = getUniqueOrderItems(order.items);

  const setRating = (productId: string, value: number) => {
    setRatings((prev) => ({ ...prev, [productId]: value }));
  };

  const handleSubmit = async () => {
    const entries = Object.entries(ratings).filter(([, v]) => v >= 1 && v <= STAR_COUNT);
    if (entries.length === 0) {
      toast.error(t("review.noRatings"));
      return;
    }
    setIsSubmitting(true);
    try {
      for (const [productId, rating] of entries) {
        await submitReview(productId, user.id, orderId!, rating);
      }
      toast.success(t("review.success"));
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Review submission failed:", error);
      toast.error(getReadableErrorMessage(error, t));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {t("review.title")}
        </h1>
        <p className="text-sm text-slate-600">{t("review.subtitle")}</p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft ring-1 ring-slate-100">
        <p className="mb-4 text-sm text-slate-600">{t("review.thankYou")}</p>
        <ul className="space-y-4">
          {uniqueItems.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-lg object-contain bg-slate-50"
                  />
                ) : (
                  <div className="h-14 w-14 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xl">
                    —
                  </div>
                )}
                <span className="font-medium text-slate-900">{item.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="mr-2 text-xs text-slate-500">{t("review.rateProduct")}</span>
                {[...Array(STAR_COUNT)].map((_, i) => {
                  const value = i + 1;
                  const active = (ratings[item.id] ?? 0) >= value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(item.id, value)}
                      className={`text-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded ${
                        active ? "text-yellow-400" : "text-slate-300 hover:text-yellow-300"
                      }`}
                      aria-label={`${value} ${t("common.stars")}`}
                    >
                      ★
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || Object.keys(ratings).length === 0}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? t("review.submitting") : t("review.submit")}
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t("review.skip")}
          </button>
        </div>
      </section>
    </div>
  );
};

export default OrderReviewPage;

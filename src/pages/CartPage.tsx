import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/useCartStore'
import { useTranslation } from '../hooks/useTranslation'

export function CartPage() {
  const { t } = useTranslation()
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const navigate = useNavigate()

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  const handleCheckout = () => {
    if (!items.length) return
    navigate('/checkout')
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {t('cart.empty')}
        </h1>
        <p className="text-sm text-slate-500">
          {t('cart.emptyDescription')}
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/glasses"
            className="inline-flex items-center justify-center rounded-full bg-primary-500 px-5 py-2 text-sm font-semibold text-white shadow-soft hover:bg-primary-600"
          >
            {t('cart.browseGlasses')}
          </Link>
          <Link
            to="/sunglasses"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:border-primary-500 hover:text-primary-600"
          >
            {t('cart.browseSunglasses')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,3fr),minmax(0,2fr)]">
      <section className="space-y-4 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">
          {t('cart.title')} ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>
        <ul className="divide-y divide-slate-100 text-sm">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-100 text-[10px] text-slate-400">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-16 w-auto object-contain"
                  />
                ) : (
                  'Item'
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {item.name}
                    </div>
                    {item.variant ? (
                      <div className="text-xs text-slate-500">
                        {item.variant}
                      </div>
                    ) : null}
                  </div>
                    <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-slate-400 hover:text-red-500"
                  >
                    {t('cart.remove')}
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          Math.max(1, item.quantity - 1),
                        )
                      }
                      className="px-1 text-slate-500 hover:text-slate-800"
                    >
                      -
                    </button>
                    <span className="px-2 text-xs font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="px-1 text-slate-500 hover:text-slate-800"
                    >
                      +
                    </button>
                  </div>
                  <div className="font-semibold text-slate-900">
                    €{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <aside className="space-y-4 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
        <h2 className="text-sm font-semibold tracking-tight text-slate-900">
          {t('cart.orderSummary')}
        </h2>
        <dl className="space-y-2 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <dt>{t('cart.subtotal')}</dt>
            <dd className="font-medium text-slate-900">
              €{subtotal.toFixed(2)}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt>{t('cart.shipping')}</dt>
            <dd>{t('cart.shipping')}</dd>
          </div>
        </dl>
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm font-semibold text-slate-900">
          <span>{t('cart.total')}</span>
          <span>€{subtotal.toFixed(2)}</span>
        </div>
        <button
          type="button"
          onClick={handleCheckout}
          className="inline-flex w-full items-center justify-center rounded-full bg-primary-500 px-6 py-2 text-sm font-semibold text-white shadow-soft hover:bg-primary-600"
        >
          {t('cart.proceedToCheckout')}
        </button>
      </aside>
    </div>
  )
}



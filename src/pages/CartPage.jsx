import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTranslation } from "../i18n/index";
import { useLangPath } from "../hooks/useLangPath";

function EmptyState() {
  const { t } = useTranslation();
  const withLang = useLangPath();

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 pt-32 text-center">
      <p className="text-sm uppercase tracking-[0.25em] text-gray-400">
        Nike Shop
      </p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-black dark:text-white">
        {t.cart.emptyTitle}
      </h1>
      <p className="mt-3 max-w-lg text-sm text-gray-500 dark:text-gray-400">
        {t.cart.emptyText}
      </p>
      <Link
        to={withLang("/")}
        className="mt-8 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-black"
      >
        {t.cart.continueShopping}
      </Link>
    </section>
  );
}

export function CartPage() {
  const navigate = useNavigate();
  const { items, subtotal, removeItem, updateQuantity } = useCart();
  const { t } = useTranslation();
  const withLang = useLangPath();
  const delivery = subtotal > 250 ? 0 : 15;
  const total = subtotal + delivery;

  if (!items.length) {
    return <EmptyState />;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
            {t.cart.title}
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-black dark:text-white">
            {t.cart.heading}
          </h1>
        </div>
        <Link
          to={withLang("/")}
          className="text-sm font-medium text-gray-500 underline underline-offset-4 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
        >
          {t.cart.continueShopping}
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
        <section className="space-y-4">
          {items.map((item) => (
            <article
              key={`${item.id}-${item.size}`}
              className="grid gap-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:grid-cols-[140px_1fr]"
            >
              <div className="overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-contain p-4"
                />
              </div>

              <div className="flex flex-col justify-between gap-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-black dark:text-white">
                      {item.name}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {item.category}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {t.cart.sizeLabel}: {item.size}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-black dark:text-white">
                    ${Number(item.price || 0).toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center rounded-full border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.size, item.quantity - 1)
                      }
                      className="px-4 py-2 text-lg text-gray-600 dark:text-gray-300"
                    >
                      -
                    </button>
                    <span className="min-w-10 text-center text-sm font-semibold text-black dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.size, item.quantity + 1)
                      }
                      className="px-4 py-2 text-lg text-gray-600 dark:text-gray-300"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id, item.size)}
                    className="text-sm font-semibold text-rose-500 transition hover:text-rose-600"
                  >
                    {t.cart.remove}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <aside className="h-fit rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl font-black text-black dark:text-white">
            {t.cart.summary}
          </h2>
          <div className="mt-6 space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center justify-between">
              <span>{t.cart.subtotal}</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{t.cart.delivery}</span>
              <span>{delivery === 0 ? t.cart.free : `$${delivery.toFixed(2)}`}</span>
            </div>
            <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-4 text-base font-bold text-black dark:border-gray-700 dark:text-white">
              <span>{t.cart.total}</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate(withLang("/checkout"))}
            className="mt-6 w-full rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-black"
          >
            {t.cart.checkout}
          </button>
        </aside>
      </div>
    </div>
  );
}

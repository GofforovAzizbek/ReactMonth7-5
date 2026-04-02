import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field } from "formik";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axiosInstance from "../Config/axios";
import { useCart } from "../context/CartContext";
import { useTranslation } from "../i18n/index";
import { useLangPath } from "../hooks/useLangPath";

const initialValues = {
  customer: "",
  email: "",
  phone: "",
  address: "",
};

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const withLang = useLangPath();
  const queryClient = useQueryClient();
  const delivery = subtotal > 250 ? 0 : 15;
  const total = subtotal + delivery;

  const orderMutation = useMutation({
    mutationFn: async (values) => {
      const payload = {
        id: Date.now(),
        customer: values.customer.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        address: values.address.trim(),
        product: items.map((item) => `${item.name} x${item.quantity}`).join(", "),
        amount: Number(total.toFixed(2)),
        date: new Date().toISOString().slice(0, 10),
        status: "pending",
        items,
      };

      await axiosInstance.post("/orders", payload);
    },
    onSuccess: async () => {
      clearCart();
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      navigate(withLang("/"));
    },
  });

  if (!items.length) {
    return <Navigate to={withLang("/cart")} replace />;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
          {t.checkout.eyebrow}
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-black dark:text-white">
          {t.checkout.heading}
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.85fr]">
        <Formik
          initialValues={initialValues}
          validate={(values) => {
            const errors = {};
            if (!values.customer.trim()) errors.customer = t.checkout.required;
            if (!values.email.trim()) {
              errors.email = t.checkout.required;
            } else if (!/\S+@\S+\.\S+/.test(values.email)) {
              errors.email = t.checkout.invalidEmail;
            }
            if (!values.phone.trim()) errors.phone = t.checkout.required;
            if (!values.address.trim()) errors.address = t.checkout.required;
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            await orderMutation.mutateAsync(values);
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="mb-2 block">{t.checkout.fullName}</span>
                  <Field
                    name="customer"
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-black dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />
                  {touched.customer && errors.customer ? (
                    <p className="mt-1 text-xs text-rose-500">{errors.customer}</p>
                  ) : null}
                </label>

                <label className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="mb-2 block">{t.checkout.email}</span>
                  <Field
                    name="email"
                    type="email"
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-black dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />
                  {touched.email && errors.email ? (
                    <p className="mt-1 text-xs text-rose-500">{errors.email}</p>
                  ) : null}
                </label>
              </div>

              <div className="mt-4 grid gap-4">
                <label className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="mb-2 block">{t.checkout.phone}</span>
                  <Field
                    name="phone"
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-black dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />
                  {touched.phone && errors.phone ? (
                    <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>
                  ) : null}
                </label>

                <label className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="mb-2 block">{t.checkout.address}</span>
                  <Field
                    as="textarea"
                    name="address"
                    className="min-h-32 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-black dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />
                  {touched.address && errors.address ? (
                    <p className="mt-1 text-xs text-rose-500">{errors.address}</p>
                  ) : null}
                </label>
              </div>

              {orderMutation.isError ? (
                <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/40">
                  {t.checkout.submitError}
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to={withLang("/cart")}
                  className="rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-black dark:border-gray-700 dark:text-gray-200"
                >
                  {t.checkout.backToCart}
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || orderMutation.isPending}
                  className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60 dark:bg-white dark:text-black"
                >
                  {orderMutation.isPending
                    ? t.checkout.submitting
                    : t.checkout.submit}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <aside className="h-fit rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl font-black text-black dark:text-white">
            {t.checkout.orderSummary}
          </h2>

          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex items-center gap-3 rounded-2xl bg-white p-3 dark:bg-gray-950"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded-xl object-contain bg-gray-100 p-2 dark:bg-gray-800"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-black dark:text-white">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.size} · {t.checkout.qty} {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-black dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-300">
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
        </aside>
      </div>
    </div>
  );
}

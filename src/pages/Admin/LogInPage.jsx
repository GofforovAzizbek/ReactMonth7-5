import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { useAuth } from "../../context/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState("");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b131d] px-4 py-10 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(14,165,233,0.22),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(251,146,60,0.20),transparent_38%)]" />
      <div className="absolute inset-0 opacity-40 [background:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/8 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-200/90">
          Nike Control Access
        </p>
        <h1 className="mb-2 text-3xl font-black tracking-tight text-white">
          Admin Sign In
        </h1>
        <p className="mb-7 text-sm text-slate-300">
          Enter your secure account data to continue to dashboard.
        </p>

        <Formik
          initialValues={{ username: "", password: "" }}
          validate={(values) => {
            const errors = {};
            if (!values.username.trim()) errors.username = "Required";
            if (!values.password.trim()) errors.password = "Required";
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setError("");
            const result = await login(values);
            if (!result.ok) setError(result.message);
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              <label className="block text-sm text-slate-200">
                <span className="mb-1 block text-xs uppercase tracking-[0.16em] text-slate-400">
                  Username
                </span>
                <Field
                  name="username"
                  type="text"
                  placeholder="admin"
                  className="w-full rounded-xl border border-white/20 bg-slate-950/55 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-300"
                  autoComplete="username"
                />
                {touched.username && errors.username ? (
                  <p className="mt-1 text-xs text-rose-300">{errors.username}</p>
                ) : null}
              </label>

              <label className="block text-sm text-slate-200">
                <span className="mb-1 block text-xs uppercase tracking-[0.16em] text-slate-400">
                  Password
                </span>
                <Field
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-white/20 bg-slate-950/55 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-300"
                  autoComplete="current-password"
                />
                {touched.password && errors.password ? (
                  <p className="mt-1 text-xs text-rose-300">{errors.password}</p>
                ) : null}
              </label>

              {error ? (
                <p className="rounded-xl border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-sky-400 to-orange-400 px-4 py-3 text-sm font-bold uppercase tracking-[0.15em] text-slate-900 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Checking..." : "Enter Admin Panel"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 rounded-xl border border-slate-300/20 bg-slate-900/35 px-4 py-3 text-xs text-slate-300">
          Demo: `admin` / `admin123`
        </div>
      </div>
    </div>
  );
}

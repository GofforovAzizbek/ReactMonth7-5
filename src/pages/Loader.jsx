import { useTranslation } from "../i18n/index";

function SkeletonLine({ className = "" }) {
  return (
    <div
      className={`overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800 ${className}`}
    >
      <div className="skeleton-slide h-full w-full" />
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="transition-colors duration-300 bg-white dark:bg-gray-950">
      <div className="relative overflow-hidden bg-gradient-to-br from-neutral-100 via-white to-neutral-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="mx-auto grid min-h-[470px] max-w-7xl items-center gap-10 px-6 pb-14 pt-32 md:px-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <SkeletonLine className="h-4 w-28" />
            <SkeletonLine className="h-16 w-full max-w-xl rounded-3xl" />
            <SkeletonLine className="h-5 w-full max-w-2xl rounded-3xl" />
            <div className="flex gap-3 pt-3">
              <SkeletonLine className="h-12 w-36 rounded-full" />
              <SkeletonLine className="h-12 w-40 rounded-full" />
            </div>
          </div>
          <div className="mx-auto flex h-[320px] w-full max-w-md items-center justify-center rounded-[2rem] bg-white/60 p-8 shadow-xl dark:bg-white/5">
            <div className="skeleton-slide h-full w-full rounded-[1.5rem] bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 md:px-10">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <SkeletonLine className="h-8 w-64 rounded-2xl" />
            <SkeletonLine className="h-4 w-40" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SkeletonLine className="h-12 w-72 rounded-full" />
            <div className="flex gap-3">
              <SkeletonLine className="h-10 w-16 rounded-full" />
              <SkeletonLine className="h-10 w-10 rounded-full" />
              <SkeletonLine className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 md:gap-8">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
                <div className="skeleton-slide aspect-square w-full bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="space-y-3 p-3">
                <SkeletonLine className="h-4 w-32" />
                <SkeletonLine className="h-3 w-20" />
                <SkeletonLine className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminPanelSkeleton() {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <article
            key={index}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <SkeletonLine className="h-3 w-20 bg-slate-200" />
            <SkeletonLine className="mt-4 h-9 w-24 rounded-2xl bg-slate-200" />
            <SkeletonLine className="mt-3 h-3 w-28 bg-slate-200" />
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <SkeletonLine className="h-5 w-40 rounded-2xl bg-slate-200" />
        </div>
        <div className="space-y-4 p-5">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="grid grid-cols-5 gap-4 rounded-2xl bg-slate-50 px-4 py-4"
            >
              <SkeletonLine className="h-4 w-16 bg-slate-200" />
              <SkeletonLine className="h-4 w-24 bg-slate-200" />
              <SkeletonLine className="h-4 w-32 bg-slate-200" />
              <SkeletonLine className="h-4 w-20 bg-slate-200" />
              <SkeletonLine className="h-4 w-18 bg-slate-200" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function AdminTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <SkeletonLine className="h-8 w-40 rounded-2xl bg-slate-200" />
          <SkeletonLine className="h-3 w-28 bg-slate-200" />
        </div>
        <SkeletonLine className="h-11 w-36 rounded-xl bg-slate-200" />
      </div>

      <SkeletonLine className="h-11 w-full rounded-xl bg-slate-200" />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="space-y-4 p-5">
          {Array.from({ length: 7 }, (_, index) => (
            <div
              key={index}
              className="grid grid-cols-6 gap-4 rounded-2xl bg-slate-50 px-4 py-4"
            >
              {Array.from({ length: 6 }, (_, column) => (
                <SkeletonLine
                  key={column}
                  className="h-4 w-full bg-slate-200"
                />
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function Loader() {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-white/95 backdrop-blur-sm transition-colors duration-300 dark:bg-gray-950/95">
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-18 w-18 overflow-hidden rounded-full border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div
            className="absolute inset-2 rounded-full border-4 border-transparent border-t-black dark:border-t-white"
            style={{ animation: "spin 3.8s linear infinite", opacity: 0.8 }}
          />
          <div className="absolute inset-0 skeleton-slide rounded-full bg-gray-100 dark:bg-gray-800" />
        </div>
        <div className="space-y-2 text-center">
          <span className="block font-display text-xs uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
            {t.loader.loading}
          </span>
          <div className="mx-auto h-1.5 w-36 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
            <div className="loading-slide h-full rounded-full bg-black dark:bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

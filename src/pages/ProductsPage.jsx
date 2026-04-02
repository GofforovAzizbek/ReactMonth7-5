import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "./ProductCard";
import { HeroBanner } from "./HeroBanner";
import { ProductGridSkeleton } from "./Loader";
import { useTranslation } from "../i18n/index";
import axiosInstance from "../Config/axios";

const normalizeProductsPage = (payload) => {
  if (Array.isArray(payload)) {
    return {
      data: payload,
      pages: 1,
      items: payload.length,
    };
  }

  return {
    data: Array.isArray(payload?.data) ? payload.data : [],
    pages: Math.max(1, Number(payload?.pages) || 1),
    items: Number(payload?.items) || 0,
  };
};

export function ProductsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const PER_PAGE = 4;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const search = searchParams.get("q") || "";

  const updateParams = (updates) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });

    setSearchParams(nextParams, { replace: true });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["products", page, search],
    queryFn: async () => {
      const query = search.trim();
      const params = {
        _page: page,
        _per_page: PER_PAGE,
      };

      if (query) {
        params._where = JSON.stringify({
          or: [
            { name: { contains: query } },
            { category: { contains: query } },
            { description: { contains: query } },
          ],
        });
      }

      const res = await axiosInstance.get("/products", { params });
      return normalizeProductsPage(res.data);
    },
  });

  const products = data?.data ?? [];
  const totalPages = data?.pages ?? 1;
  const totalItems = data?.items ?? 0;

  useEffect(() => {
    if (!data || page <= totalPages) return;
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(totalPages));
    setSearchParams(nextParams, { replace: true });
  }, [data, page, searchParams, setSearchParams, totalPages]);

  if (isLoading) return <ProductGridSkeleton />;

  return (
    <div className="transition-colors duration-300 bg-white dark:bg-gray-950">
      <HeroBanner />

      <div className="px-6 pt-16 pb-6 mx-auto max-w-7xl md:px-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-black font-display dark:text-white">
              {t.products.heading}
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {totalItems} {t.products.results}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={search}
              onChange={(event) => {
                updateParams({
                  q: event.target.value.trim() ? event.target.value : null,
                  page: 1,
                });
              }}
              placeholder={t.products.searchPlaceholder}
              className="min-w-72 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 outline-none transition focus:border-black dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
            <div className="flex items-center gap-3">
              <span className="font-sans text-sm text-gray-500 transition-colors cursor-pointer dark:text-gray-400 hover:text-black dark:hover:text-white">
                {t.products.shop}
              </span>
              <button
                onClick={() => updateParams({ page: Math.max(1, page - 1) })}
                disabled={page === 1}
                className="flex items-center justify-center text-black transition-colors border border-gray-300 rounded-full dark:border-gray-700 w-9 h-9 hover:border-black dark:hover:border-white dark:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={() => updateParams({ page: Math.min(totalPages, page + 1) })}
                disabled={page === totalPages}
                className="flex items-center justify-center text-black transition-colors border border-gray-300 rounded-full dark:border-gray-700 w-9 h-9 hover:border-black dark:hover:border-white dark:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-24 mx-auto max-w-7xl md:px-10">
        {products.length ? (
          <>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 md:gap-8">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => updateParams({ page: index + 1 })}
                  className={`h-10 min-w-10 rounded-full px-3 text-sm font-semibold transition ${
                    page === index + 1
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "border border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-200 px-6 py-16 text-center dark:border-gray-800">
            <p className="text-lg font-semibold text-black dark:text-white">
              {t.products.noResultsTitle}
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t.products.noResultsText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useMemo } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../Config/axios";
import { AuthProvider, ProtectedRoute, useAuth } from "../context/AuthContext";
import { DashboardPage } from "./Admin/Dashboard";
import { ProductsAdminPage } from "./Admin/ProductsAdminPage";
import { OrdersPage } from "./Admin/OrdersPage";
import { AdminPanelSkeleton, AdminTableSkeleton } from "./Loader";

const pages = [
  { id: "dashboard", label: "Dashboard" },
  { id: "products", label: "Products" },
  { id: "orders", label: "Orders" },
];

const normalizeCollection = (payload) =>
  Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];

function AdminPanel() {
  const { admin, logout } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const validPages = pages.map((item) => item.id);
  const page = validPages.includes(searchParams.get("tab"))
    ? searchParams.get("tab")
    : "dashboard";

  const setPage = (nextPage) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", nextPage);
    setSearchParams(nextParams, { replace: true });
  };

  const {
    data: products = [],
    isLoading: loadingProducts,
    isError: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosInstance.get("/products");
      return normalizeCollection(res.data);
    },
  });

  const {
    data: orders = [],
    isLoading: loadingOrders,
    isError: ordersError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axiosInstance.get("/orders");
      return normalizeCollection(res.data);
    },
  });

  const createProduct = useMutation({
    mutationFn: async (payload) => {
      await axiosInstance.post("/products", payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, payload }) => {
      await axiosInstance.patch(`/products/${id}`, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id) => {
      await axiosInstance.delete(`/products/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      await axiosInstance.patch(`/orders/${id}`, { status });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const activeLabel = useMemo(
    () => pages.find((item) => item.id === page)?.label || "Dashboard",
    [page],
  );
  const hasDataError = productsError || ordersError;

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col gap-4 p-4 md:p-6">
        <header className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                Nike Admin
              </p>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                {activeLabel}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right">
                <p className="text-sm font-semibold text-slate-800">{admin?.name}</p>
                <p className="text-xs text-slate-500">
                  {admin?.role} · @{admin?.username}
                </p>
              </div>
              <button
                onClick={logout}
                className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700"
              >
                Log out
              </button>
            </div>
          </div>
          <nav className="mt-4 flex flex-wrap gap-2">
            {pages.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                  page === item.id
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </header>

        <main className="flex-1">
          {hasDataError && page !== "dashboard" ? (
            <section className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 shadow-sm">
              Unable to load admin statistics right now. Please check the backend
              connection and try again.
            </section>
          ) : null}
          {page === "dashboard" ? (
            <DashboardPage />
          ) : null}
          {page === "products" ? (
            loadingProducts ? (
              <AdminTableSkeleton />
            ) : !productsError ? (
              <ProductsAdminPage
                products={products}
                loading={loadingProducts}
                saving={createProduct.isPending || updateProduct.isPending}
                deletingId={deleteProduct.variables ?? null}
                onCreate={(payload) => createProduct.mutateAsync(payload)}
                onUpdate={(id, payload) =>
                  updateProduct.mutateAsync({ id, payload })
                }
                onDelete={(id) => deleteProduct.mutateAsync(id)}
              />
            ) : null
          ) : null}
          {page === "orders" ? (
            loadingOrders ? (
              <AdminTableSkeleton />
            ) : !ordersError ? (
              <OrdersPage
                orders={orders}
                loading={loadingOrders}
                updatingId={updateOrderStatus.variables?.id ?? null}
                onUpdateStatus={(id, status) =>
                  updateOrderStatus.mutateAsync({ id, status })
                }
              />
            ) : null
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AdminPanel />
      </ProtectedRoute>
    </AuthProvider>
  );
}

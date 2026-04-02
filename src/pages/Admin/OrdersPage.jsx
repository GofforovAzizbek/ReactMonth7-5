import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const statusOptions = ["pending", "delivered", "cancelled"];

export function OrdersPage({ orders, loading, updatingId, onUpdateStatus }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("orderSearch") || "";
  const filter = searchParams.get("status") || "all";

  const updateParams = (updates) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });

    setSearchParams(nextParams, { replace: true });
  };

  const filtered = useMemo(
    () =>
      orders.filter((item) => {
        const q = search.toLowerCase();
        const bySearch =
          String(item.id).toLowerCase().includes(q) ||
          (item.customer || "").toLowerCase().includes(q) ||
          (item.product || "").toLowerCase().includes(q);
        const byFilter = filter === "all" || item.status === filter;
        return bySearch && byFilter;
      }),
    [orders, search, filter],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Orders</h2>
          <p className="text-sm text-slate-500">{orders.length} total orders</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {["all", ...statusOptions].map((tab) => (
          <button
            key={tab}
            onClick={() => updateParams({ status: tab })}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] ${
              filter === tab
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-600"
            }`}
          >
            {tab}
          </button>
        ))}
        <input
          value={search}
          onChange={(e) => updateParams({ orderSearch: e.target.value })}
          placeholder="Search order, customer, product"
          className="ml-auto min-w-56 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Loading orders...
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      #{order.id}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{order.customer}</p>
                      <p className="text-xs text-slate-500">{order.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{order.product}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      ${Number(order.amount || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{order.date}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          order.status === "delivered"
                            ? "bg-emerald-100 text-emerald-700"
                            : order.status === "cancelled"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {statusOptions.map((status) => (
                          <button
                            key={status}
                            onClick={() => onUpdateStatus(order.id, status)}
                            disabled={updatingId === order.id || status === order.status}
                            className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 disabled:opacity-40"
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {!loading && filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    No orders found
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../Config/axios";
import { AdminPanelSkeleton } from "../Loader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#475569",
        boxWidth: 12,
        usePointStyle: true,
        pointStyle: "circle",
      },
    },
  },
};

const normalizeCollection = (payload) =>
  Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];

const fetchCollection = async (resource) => {
  const res = await axiosInstance.get(`/${resource}`);
  return normalizeCollection(res.data);
};

function MetricCard({ label, value, hint, accent = "text-slate-900" }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className={`mt-3 text-3xl font-black tracking-tight ${accent}`}>{value}</p>
      <p className="mt-2 text-xs text-slate-500">{hint}</p>
    </article>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="h-[320px] p-5">{children}</div>
    </section>
  );
}

function EmptyChartState({ message }) {
  return (
    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center text-sm text-slate-400">
      {message}
    </div>
  );
}

function BarChartCard({ title, subtitle, data, options, emptyMessage }) {
  return (
    <ChartCard title={title} subtitle={subtitle}>
      {data.labels.length ? (
        <Bar data={data} options={options} />
      ) : (
        <EmptyChartState message={emptyMessage} />
      )}
    </ChartCard>
  );
}

function PieChartCard({ title, subtitle, data, options, emptyMessage }) {
  return (
    <ChartCard title={title} subtitle={subtitle}>
      {data.labels.length ? (
        <Pie data={data} options={options} />
      ) : (
        <EmptyChartState message={emptyMessage} />
      )}
    </ChartCard>
  );
}

const buildPriceRangeData = (products) => {
  const ranges = [
    { label: "0-50", min: 0, max: 50, count: 0 },
    { label: "50-100", min: 50, max: 100, count: 0 },
    { label: "100-200", min: 100, max: 200, count: 0 },
    { label: "200+", min: 200, max: Number.POSITIVE_INFINITY, count: 0 },
  ];

  products.forEach((product) => {
    const price = Number(product.price || 0);

    if (price < 50) {
      ranges[0].count += 1;
    } else if (price < 100) {
      ranges[1].count += 1;
    } else if (price < 200) {
      ranges[2].count += 1;
    } else {
      ranges[3].count += 1;
    }
  });

  return {
    labels: ranges.map((range) => range.label),
    datasets: [
      {
        label: "Products",
        data: ranges.map((range) => range.count),
        backgroundColor: ["#dbeafe", "#93c5fd", "#38bdf8", "#0f172a"],
        borderRadius: 12,
      },
    ],
  };
};

const buildTopProductsData = (products) => {
  const topProducts = [...products]
    .sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
    .slice(0, 5);

  return {
    labels: topProducts.map((product) => product.name || "Unnamed"),
    datasets: [
      {
        label: "Price",
        data: topProducts.map((product) => Number(product.price || 0)),
        backgroundColor: "#0f172a",
        borderRadius: 12,
      },
    ],
  };
};

const buildOrderStatusData = (orders) => {
  const statusMap = new Map([
    ["cancelled", 0],
    ["delivered", 0],
  ]);

  orders.forEach((order) => {
    const status = String(order.status || "").toLowerCase();
    if (statusMap.has(status)) {
      statusMap.set(status, statusMap.get(status) + 1);
    }
  });

  return {
    labels: ["Cancelled", "Delivered"],
    datasets: [
      {
        label: "Orders",
        data: [statusMap.get("cancelled"), statusMap.get("delivered")],
        backgroundColor: ["#fb7185", "#34d399"],
        borderWidth: 0,
      },
    ],
  };
};

const productsBarOptions = {
  ...baseChartOptions,
  plugins: {
    ...baseChartOptions.plugins,
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
        color: "#64748b",
      },
      grid: {
        color: "#e2e8f0",
      },
    },
    x: {
      ticks: {
        color: "#64748b",
      },
      grid: {
        display: false,
      },
    },
  },
};

const priceComparisonOptions = {
  ...productsBarOptions,
  indexAxis: "y",
};

const orderStatusOptions = {
  ...baseChartOptions,
  plugins: {
    ...baseChartOptions.plugins,
    legend: {
      position: "bottom",
      labels: {
        color: "#475569",
        boxWidth: 12,
        padding: 18,
        usePointStyle: true,
      },
    },
  },
};

function DashboardContent({ products, orders }) {
  const priceRangeData = buildPriceRangeData(products);
  const topProductsData = buildTopProductsData(products);
  const orderStatusData = buildOrderStatusData(orders);
  const deliveredCount = orderStatusData.datasets[0].data[1] || 0;
  const cancelledCount = orderStatusData.datasets[0].data[0] || 0;

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label="Total Products"
          value={products.length}
          hint="Current catalog size"
        />
        <MetricCard
          label="Delivered Orders"
          value={deliveredCount}
          hint="Completed purchases"
          accent="text-emerald-600"
        />
        <MetricCard
          label="Cancelled Orders"
          value={cancelledCount}
          hint="Orders not completed"
          accent="text-rose-600"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <BarChartCard
          title="Products Price Distribution"
          subtitle="Grouped by price range"
          data={priceRangeData}
          options={productsBarOptions}
          emptyMessage="No products available for price distribution."
        />
        <BarChartCard
          title="Top 5 Most Expensive Products"
          subtitle="Product names compared by price"
          data={topProductsData}
          options={priceComparisonOptions}
          emptyMessage="No products available for price comparison."
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-lg font-bold text-slate-900">Price Range Summary</h2>
            <p className="mt-1 text-sm text-slate-500">
              Quick breakdown of products across price bands
            </p>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            {priceRangeData.labels.map((label, index) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-black text-slate-900">
                  {priceRangeData.datasets[0].data[index]}
                </p>
              </div>
            ))}
          </div>
        </div>

        <PieChartCard
          title="Orders Status"
          subtitle="Cancelled vs delivered orders"
          data={orderStatusData}
          options={orderStatusOptions}
          emptyMessage="No delivered or cancelled orders yet."
        />
      </section>
    </div>
  );
}

export function DashboardPage() {
  const {
    data: products = [],
    isLoading: loadingProducts,
    isError: productsError,
  } = useQuery({
    queryKey: ["dashboard", "products"],
    queryFn: () => fetchCollection("products"),
  });

  const {
    data: orders = [],
    isLoading: loadingOrders,
    isError: ordersError,
  } = useQuery({
    queryKey: ["dashboard", "orders"],
    queryFn: () => fetchCollection("orders"),
  });

  if (loadingProducts || loadingOrders) {
    return <AdminPanelSkeleton />;
  }

  if (productsError || ordersError) {
    return (
      <section className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 shadow-sm">
        Unable to load dashboard statistics. Please check the backend and try
        again.
      </section>
    );
  }

  return <DashboardContent products={products} orders={orders} />;
}

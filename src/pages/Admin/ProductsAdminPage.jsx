import { useMemo, useState } from "react";
import { Field, Form, Formik } from "formik";
import { useSearchParams } from "react-router-dom";

const initialForm = {
  name: "",
  category: "",
  price: "",
  stock: "",
  description: "",
  rating: "",
  image: "",
};

function ProductModal({ mode, data, saving, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">
            {mode === "create" ? "Create Product" : "Edit Product"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-2 py-1 text-sm text-slate-500"
          >
            Close
          </button>
        </div>

        <Formik
          initialValues={data}
          enableReinitialize
          validate={(values) => {
            const errors = {};
            if (!values.name.trim()) errors.name = "Required";
            if (!values.category.trim()) errors.category = "Required";
            if (!values.price) errors.price = "Required";
            if (!values.image.trim()) errors.image = "Required";
            return errors;
          }}
          onSubmit={async (values) => {
            await onSubmit(values);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Field
                    name="name"
                    placeholder="Product name"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                  {touched.name && errors.name ? (
                    <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
                  ) : null}
                </div>
                <div>
                  <Field
                    name="category"
                    placeholder="Category"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                  {touched.category && errors.category ? (
                    <p className="mt-1 text-xs text-rose-500">{errors.category}</p>
                  ) : null}
                </div>
                <div>
                  <Field
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                  {touched.price && errors.price ? (
                    <p className="mt-1 text-xs text-rose-500">{errors.price}</p>
                  ) : null}
                </div>
                <Field
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="Stock"
                  className="rounded-xl border border-slate-200 px-3 py-2"
                />
                <Field
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="Rating 0-5"
                  className="rounded-xl border border-slate-200 px-3 py-2"
                />
                <div>
                  <Field
                    name="image"
                    placeholder="Image URL"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                  {touched.image && errors.image ? (
                    <p className="mt-1 text-xs text-rose-500">{errors.image}</p>
                  ) : null}
                </div>
              </div>

              <Field
                as="textarea"
                name="description"
                placeholder="Description"
                className="mt-3 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2"
              />

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving ? "Saving..." : mode === "create" ? "Create" : "Update"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export function ProductsAdminPage({
  products,
  loading,
  saving,
  deletingId,
  onCreate,
  onUpdate,
  onDelete,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [modal, setModal] = useState(null);
  const search = searchParams.get("productSearch") || "";

  const setSearch = (value) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value.trim()) {
      nextParams.set("productSearch", value);
    } else {
      nextParams.delete("productSearch");
    }

    setSearchParams(nextParams, { replace: true });
  };

  const filtered = useMemo(
    () =>
      products.filter((item) => {
        const q = search.toLowerCase();
        return (
          (item.name || "").toLowerCase().includes(q) ||
          (item.category || "").toLowerCase().includes(q)
        );
      }),
    [products, search],
  );

  const openCreate = () => {
    setModal({ mode: "create", data: initialForm });
  };

  const openEdit = (product) => {
    setModal({
      mode: "edit",
      id: product.id,
      data: {
        name: product.name || "",
        category: product.category || "",
        price: String(product.price ?? ""),
        stock: String(product.stock ?? ""),
        description: product.description || "",
        rating: String(product.rating ?? ""),
        image: product.image || "",
      },
    });
  };

  const handleSubmit = async (values) => {
    if (!modal) return;

    const payload = {
      name: values.name.trim(),
      category: values.category.trim(),
      price: Number(values.price),
      stock: Number(values.stock || 0),
      description: values.description.trim(),
      rating: Number(values.rating || 0),
      image: values.image.trim(),
    };

    if (modal.mode === "create") {
      await onCreate(payload);
    } else {
      await onUpdate(modal.id, payload);
    }

    setModal(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Products</h2>
          <p className="text-sm text-slate-500">{products.length} items in db</p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          + New Product
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2"
      />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Loading products...
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{product.category}</td>
                    <td className="px-4 py-3 text-slate-700">
                      ${Number(product.price || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{product.stock}</td>
                    <td className="px-4 py-3 text-slate-700">{product.rating}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 disabled:opacity-60"
                        >
                          {deletingId === product.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {!loading && filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Nothing found
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {modal ? (
        <ProductModal
          mode={modal.mode}
          data={modal.data}
          saving={saving}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
        />
      ) : null}
    </div>
  );
}

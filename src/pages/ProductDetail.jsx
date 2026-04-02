import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Loader } from "./Loader";
import { useTranslation } from "../i18n/index";
import axiosInstance from "../Config/axios";
import { useCart } from "../context/CartContext";
import { useLangPath } from "../hooks/useLangPath";

const getProductSizes = (product) => {
  const category = String(product?.category || "").toLowerCase();

  if (category.includes("running") || category.includes("racing")) {
    return ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"];
  }

  if (category.includes("lifestyle")) {
    return ["US 6", "US 7", "US 8", "US 9", "US 10", "US 11"];
  }

  return ["US 6", "US 7", "US 8", "US 9", "US 10", "US 11", "US 12"];
};

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addItem } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSize = searchParams.get("size");
  const [addedToCart, setAddedToCart] = useState(false);
  const withLang = useLangPath();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/products/${id}`);
      return res.data?.data ?? res.data ?? null;
    },
  });

  useEffect(() => {
    const cachedCard = document.querySelector(`[data-product-id="${id}"]`);
    if (cachedCard) {
      cachedCard.style.opacity = "";
      cachedCard.style.transform = "";
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      const sizeSection = document.querySelector("[data-section='sizes']");
      if (sizeSection) {
        sizeSection.classList.add(
          "ring-2",
          "ring-red-400",
          "ring-offset-4",
          "rounded-lg",
        );
        setTimeout(() => {
          sizeSection.classList.remove(
            "ring-2",
            "ring-red-400",
            "ring-offset-4",
            "rounded-lg",
          );
        }, 1500);
      }
      return;
    }
    addItem(product, selectedSize);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (isLoading) return <Loader />;
  if (!product)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-950">
        <p className="font-sans text-gray-500 dark:text-gray-400">
          {t.detail.notFound}
        </p>
      </div>
    );

  const productName = product.name || product.title || "Nike Shoe";
  const sizes = getProductSizes(product);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 pt-[127px]">
      {/* Back button */}
      <div className="px-6 py-6 mx-auto max-w-7xl md:px-10">
        <button
          onClick={() => navigate(withLang("/"))}
          className="flex items-center gap-2 font-sans text-sm text-gray-500 transition-colors dark:text-gray-400 hover:text-black dark:hover:text-white group"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t.detail.back}
        </button>
      </div>

      {/* Product layout */}
      <div className="px-6 pb-24 mx-auto max-w-7xl md:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-20">
          {/* Image */}
          <div className="animate-fade-up-1">
            <div className="flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-2xl aspect-square">
              <img
                src={product.image}
                alt={productName}
                className="object-contain w-full h-full p-10"
              />
            </div>
            <div className="flex gap-3 mt-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-center w-20 h-20 transition-all bg-gray-100 rounded-lg cursor-pointer dark:bg-gray-800 hover:ring-2 hover:ring-black dark:hover:ring-white"
                >
                  <img
                    src={product.image}
                    alt={productName}
                    className="object-contain w-full h-full p-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="animate-fade-up-2">
            <span className="inline-block bg-orange-500 text-white font-sans text-[10px] font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wide mb-4">
              {t.detail.justIn}
            </span>

            <h1 className="mb-1 text-3xl font-black leading-none tracking-tight text-black dark:text-white font-display md:text-4xl">
              {productName}
            </h1>
            <p className="mb-1 font-sans text-sm text-gray-500 dark:text-gray-400">
              {product.category}
            </p>
            <p className="mb-6 font-sans text-sm text-gray-400 dark:text-gray-500">
              {t.detail.oneColour}
            </p>
            <p className="mb-8 text-2xl font-bold text-black dark:text-white font-display">
              ${product.price}
            </p>

            <div className="mb-8 flex items-center gap-4 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-300">
              <span>{t.detail.rating}: {product.rating}</span>
              <span>{t.detail.stock}: {product.stock}</span>
            </div>

            {product.description && (
              <p className="pt-6 mb-8 font-sans text-sm leading-relaxed text-gray-600 border-t border-gray-100 dark:text-gray-400 dark:border-gray-800">
                {product.description}
              </p>
            )}

            {/* Sizes */}
            <div
              data-section="sizes"
              className="mb-8 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-sans text-sm font-semibold text-black dark:text-white">
                  {t.detail.selectSize}
                </p>
                <span className="font-sans text-xs text-gray-400 underline cursor-pointer hover:text-black dark:hover:text-white underline-offset-2">
                  {t.detail.sizeGuide}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      const nextParams = new URLSearchParams(searchParams);
                      nextParams.set("size", size);
                      setSearchParams(nextParams, { replace: true });
                    }}
                    className={`py-3 rounded-lg border font-sans text-sm transition-all
                      ${
                        selectedSize === size
                          ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                          : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to bag */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-full font-sans font-semibold text-sm transition-all duration-300
                ${
                  addedToCart
                    ? "bg-green-500 text-white"
                    : "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                }`}
            >
              {addedToCart ? t.detail.addedToBag : t.detail.addToBag}
            </button>

            <button className="w-full py-4 mt-3 font-sans text-sm font-semibold text-black transition-colors border border-gray-300 rounded-full dark:border-gray-700 dark:text-white hover:border-black dark:hover:border-white">
              {t.detail.favourite}
            </button>

            {/* Features */}
            <div className="pt-6 mt-8 space-y-4 border-t border-gray-100 dark:border-gray-800">
              {[
                { icon: "🚚", label: t.detail.freeDelivery },
                { icon: "📦", label: t.detail.freeReturns },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-lg">{icon}</span>
                  <span className="font-sans text-sm text-gray-600 dark:text-gray-400">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

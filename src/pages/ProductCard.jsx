import { useNavigate } from "react-router-dom";
import { useTranslation } from "../i18n/index";
import { useLangPath } from "../hooks/useLangPath";

export function ProductCard({ product, index }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const withLang = useLangPath();
  const productName = product.name || product.title || "Nike Shoe";

  const handleClick = () => {
    const card = document.querySelector(`[data-product-id="${product.id}"]`);
    if (card) {
      card.style.opacity = "0.5";
      card.style.transform = "scale(0.97)";
      card.style.transition = "all 0.2s ease";
    }
    setTimeout(() => navigate(withLang(`/products/${product.id}`)), 200);
  };

  return (
    <div
      data-product-id={product.id}
      onClick={handleClick}
      className="cursor-pointer group animate-fade-up-1"
      style={{ animationDelay: `${index * 0.08}s`, animationFillMode: "both" }}
    >
      {/* Image */}
      <div className="relative mb-3 overflow-hidden rounded-xl aspect-square bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center w-full h-full transition-colors duration-300 bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700">
          <img
            src={product.image}
            alt={productName}
            className="object-contain w-full h-full p-6 transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Just In tag */}
        <span className="absolute top-3 left-3 bg-orange-500 text-white font-sans text-[10px] font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wide">
          {t.detail.justIn}
        </span>

        {/* Wishlist */}
        <button
          className="absolute transition-opacity opacity-0 top-3 right-3 group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 0 1 6.364 0L12 7.636l1.318-1.318a4.5 4.5 0 1 1 6.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 0 1 0-6.364z"
            />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-sans text-sm font-semibold text-black transition-all dark:text-white group-hover:underline">
            {productName}
          </p>
          <p className="font-sans text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {product.category}
          </p>
          <p className="font-sans text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {t.detail.oneColour}
          </p>
        </div>
        <p className="ml-4 font-sans text-sm font-semibold text-black dark:text-white whitespace-nowrap">
          ${product.price}
        </p>
      </div>
    </div>
  );
}

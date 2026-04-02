import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation, LANG_LABELS } from "../i18n/index";
import { useTheme } from "./ThemeContext";
import { useCart } from "../context/CartContext";
import logo from "../assets/logo.svg";
import { useLangPath } from "../hooks/useLangPath";
/* ─── Sun Icon ────────────────────────────────────────────── */
function SunIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 3v1m0 16v1m8.66-13H20m-16 0H2.34M19.07 4.93l-.71.71M5.64 18.36l-.71.71M19.07 19.07l-.71-.71M5.64 5.64l-.71-.71M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z"
      />
    </svg>
  );
}

/* ─── Moon Icon ───────────────────────────────────────────── */
function MoonIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
      />
    </svg>
  );
}

/* ─── Navbar ─────────────────────────────────────────────── */
export function Navbar() {
  const { t, lang, changeLang, langs } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const withLang = useLangPath();

  const switchLanguage = (nextLang) => {
    changeLang(nextLang);

    const segments = location.pathname.split("/").filter(Boolean);
    const currentFirst = segments[0];
    const nextSegments = [...segments];

    if (langs.includes(currentFirst)) {
      nextSegments[0] = nextLang;
    } else {
      nextSegments.unshift(nextLang);
    }

    const nextPathname = `/${nextSegments.join("/")}`;
    navigate(`${nextPathname}${location.search}${location.hash}`, { replace: true });
    setLangOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center transition-colors duration-300 bg-white border-b border-gray-100 dark:bg-gray-950 dark:border-gray-800 animate-slide-down">
      <div className="max-w-[1344px] w-full mx-auto flex items-center justify-between px-8 py-4 transition-colors duration-300 bg-white border-b border-gray-100 dark:bg-gray-950 dark:border-gray-800 animate-slide-down">
        <Link to={withLang("/")} className="shrink-0">
          <img
            src={logo}
            alt="Nike"
            className="transition duration-300 dark:invert"
          />
        </Link>

        <div className="items-center hidden gap-8 md:flex">
          {t.nav.links.map((item) => (
            <Link
              key={item.href}
              to={withLang(item.href)}
              className="font-sans text-sm text-gray-700 transition-colors cursor-pointer dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2.5 md:gap-3">
          <div className="relative">
            <button
              onClick={() => setLangOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold font-sans text-gray-700 transition-all hover:border-black dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:hover:border-white"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 0c-2.5 2.5-4 5.7-4 10s1.5 7.5 4 10m0-20c2.5 2.5 4 5.7 4 10s-1.5 7.5-4 10M2 12h20"
                />
              </svg>
              {LANG_LABELS[lang]}
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {langOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangOpen(false)}
                />
                <div className="absolute right-0 z-50 mt-2 overflow-hidden bg-white border border-gray-100 shadow-xl w-36 rounded-xl dark:bg-gray-900 dark:border-gray-700">
                  {langs.map((l) => (
                    <button
                      key={l}
                      onClick={() => switchLanguage(l)}
                      className={`w-full text-left px-4 py-2.5 font-sans text-sm transition-colors flex items-center justify-between
                      ${
                        lang === l
                          ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {LANG_LABELS[l]}
                      {lang === l && (
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="relative h-8 w-[60px] flex-shrink-0 rounded-full bg-gray-200 transition-colors duration-300 focus:outline-none dark:bg-gray-700"
            >
              <span
                className={`absolute left-2 top-1/2 -translate-y-1/2 text-amber-400 transition-opacity duration-200 pointer-events-none ${
                  theme === "dark" ? "opacity-0" : "opacity-100"
                }`}
              >
                <SunIcon />
              </span>
              <span
                className={`absolute right-2 top-1/2 -translate-y-1/2 text-slate-200 transition-opacity duration-200 pointer-events-none ${
                  theme === "dark" ? "opacity-100" : "opacity-0"
                }`}
              >
                <MoonIcon />
              </span>
              <span
                className="absolute left-0.5 top-0.5 h-7 w-7 rounded-full bg-white shadow-md transition-transform duration-300 pointer-events-none dark:translate-x-7 dark:bg-white"
              />
            </button>

          <Link
            to="/admin"
            className="hidden rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-700 transition hover:border-black dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 md:inline-flex"
          >
            Admin
          </Link>

          <Link
            to={withLang("/cart")}
            className="relative rounded-full p-2 text-black transition hover:bg-gray-100 dark:text-white dark:hover:bg-gray-900"
            aria-label="Cart"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {itemCount ? (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </nav>
  );
}

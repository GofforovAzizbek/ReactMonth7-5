import { useEffect } from "react";
import {
  Navigate,
  useLocation,
  useParams,
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import { Navbar } from "./pages/Navbar";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetail } from "./pages/ProductDetail";
import { I18nProvider } from "./i18n";
import { ThemeProvider } from "./pages/ThemeContext";
import AdminApp from "./pages/AdminPanel";
import { Footer } from "./pages/Footer";
import { CartProvider } from "./context/CartContext";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { SUPPORTED_LANGS, useTranslation } from "./i18n";

function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, [hash]);

  return null;
}

function RouteLanguageSync() {
  const { lang: langFromUrl } = useParams();
  const { lang, changeLang } = useTranslation();

  useEffect(() => {
    if (langFromUrl && SUPPORTED_LANGS.includes(langFromUrl) && langFromUrl !== lang) {
      changeLang(langFromUrl);
    }
  }, [changeLang, lang, langFromUrl]);

  return null;
}

function LanguageRedirect() {
  const { lang } = useTranslation();
  return <Navigate to={`/${lang}`} replace />;
}

function LanguageGuard({ children }) {
  const { lang } = useParams();

  if (!lang || !SUPPORTED_LANGS.includes(lang)) {
    return <Navigate to="/en" replace />;
  }

  return children;
}

function RootLayout() {
  return (
    <div className="min-h-screen transition-colors duration-300 bg-white dark:bg-gray-950">
      <Navbar />
      <ScrollToHash />
      <RouteLanguageSync />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <LanguageRedirect />,
  },
  {
    path: "/:lang",
    element: (
      <LanguageGuard>
        <RootLayout />
      </LanguageGuard>
    ),
    children: [
      { index: true, element: <ProductsPage /> },
      { path: "products/:id", element: <ProductDetail /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminApp />,
  },
]);

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

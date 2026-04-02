import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5500",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

if (import.meta.env.DEV && typeof window !== "undefined") {
  const interceptorsInstalled = window.__NIKE_API_DEBUG_INTERCEPTORS__;

  if (!interceptorsInstalled) {
    window.__NIKE_API_DEBUG_INTERCEPTORS__ = true;

    axiosInstance.interceptors.request.use((config) => {
      const nextConfig = { ...config };
      nextConfig.metadata = {
        startedAt: Date.now(),
      };

      const method = String(nextConfig.method || "GET").toUpperCase();
      console.info(`[API request] ${method} ${nextConfig.baseURL}${nextConfig.url}`, {
        params: nextConfig.params,
        data: nextConfig.data,
      });

      return nextConfig;
    });

    axiosInstance.interceptors.response.use(
      (response) => {
        const method = String(response.config.method || "GET").toUpperCase();
        const startedAt = response.config.metadata?.startedAt || Date.now();
        const duration = Date.now() - startedAt;

        console.info(
          `[API response] ${method} ${response.config.baseURL}${response.config.url} -> ${response.status} (${duration}ms)`,
          response.data,
        );

        return response;
      },
      (error) => {
        const method = String(error.config?.method || "GET").toUpperCase();
        const startedAt = error.config?.metadata?.startedAt || Date.now();
        const duration = Date.now() - startedAt;

        console.error(
          `[API error] ${method} ${error.config?.baseURL || ""}${error.config?.url || ""} (${duration}ms)`,
          error.response?.data || error.message,
        );

        return Promise.reject(error);
      },
    );
  }
}

export default axiosInstance;

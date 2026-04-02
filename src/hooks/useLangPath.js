import { useCallback } from "react";
import { useTranslation } from "../i18n";

export function useLangPath() {
  const { lang } = useTranslation();

  return useCallback(
    (pathname, extraParams = {}) => {
      const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
      const params = new URLSearchParams();

      Object.entries(extraParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          params.set(key, String(value));
        }
      });

      const search = params.toString();
      const pathWithLang = `/${lang}${cleanPath === "/" ? "" : cleanPath}`;

      return search ? `${pathWithLang}?${search}` : pathWithLang;
    },
    [lang],
  );
}

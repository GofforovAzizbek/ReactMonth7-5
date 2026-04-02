import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axiosInstance from "../Config/axios";

const STORAGE_KEY = "nike_admin_session_v2";

export const useAuthStore = create(
  persist(
    (set) => ({
      admin: null,
      login: async ({ username, password }) => {
        if (!username || !password) {
          return { ok: false, message: "All fields are required" };
        }

        try {
          const res = await axiosInstance.get("/admins", {
            params: {
              username: username.trim().toLowerCase(),
              password,
            },
          });

          const matched = Array.isArray(res.data) ? res.data[0] : null;
          if (!matched) {
            return { ok: false, message: "Wrong username or password" };
          }

          const user = {
            id: matched.id,
            name: matched.name,
            role: matched.role,
            username: matched.username,
          };

          set({ admin: user });
          return { ok: true };
        } catch (error) {
          console.error("Login error:", error);
          return { ok: false, message: "Server unavailable. Check backend." };
        }
      },
      logout: () => set({ admin: null }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ admin: state.admin }),
    },
  ),
);

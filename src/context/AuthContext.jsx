/* eslint-disable react-refresh/only-export-components */
import { useAuthStore } from "../store/useAuthStore";
import { LoginPage } from "../pages/Admin/LogInPage";

export function AuthProvider({ children }) {
  return children;
}

export function useAuth() {
  const admin = useAuthStore((state) => state.admin);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  return { admin, login, logout };
}

export function ProtectedRoute({ children }) {
  const { admin } = useAuth();
  if (!admin) return <LoginPage />;
  return children;
}

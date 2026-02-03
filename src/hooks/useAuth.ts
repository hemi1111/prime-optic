import { useAuthStore } from "../store/useAuthStore";

export const useAuth = () => {
  const { user } = useAuthStore();

  const isAdmin = user?.role === "admin";
  const isAuthenticated = !!user;

  return {
    user,
    isAuthenticated,
    isAdmin,
  };
};

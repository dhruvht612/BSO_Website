import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken, setToken } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/api/auth/me", { auth: true })
      .then((data) => setUser(data.user))
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login: async (email, password) => {
        const data = await api.post("/api/auth/login", { email, password });
        setToken(data.token);
        setUser(data.user);
        return data.user;
      },
      register: async (name, email, password) => {
        const data = await api.post("/api/auth/register", { name, email, password });
        setToken(data.token);
        setUser(data.user);
        return data.user;
      },
      logout: () => {
        setToken(null);
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { tokens } from "../api/client";
import { userApi } from "../api/services";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(!!tokens.access);

  useEffect(() => {
    const out = () => setIsAuth(false);
    window.addEventListener("auth:logout", out);
    return () => window.removeEventListener("auth:logout", out);
  }, []);

  const login = useCallback((data) => { tokens.set(data.access_token, data.refresh_token); setIsAuth(true); }, []);
  const logout = useCallback(async () => {
    try { await userApi.logout(); } catch { /* ignore */ }
    tokens.clear(); setIsAuth(false);
  }, []);

  return <AuthContext.Provider value={{ isAuth, login, logout }}>{children}</AuthContext.Provider>;
}

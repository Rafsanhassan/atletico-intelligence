import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("ai_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncUser = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
      return data;
    } catch (error) {
      localStorage.removeItem("ai_token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      syncUser();
      return;
    }
    setLoading(false);
  }, [token]);

  const resolveRedirect = (role) => {
    if (role === "league_admin") {
      return "/admin/dashboard";
    }
    if (role === "match_official") {
      return "/official/dashboard";
    }
    if (role === "team_viewer" || role === "team_official") {
      return "/viewer/dashboard";
    }
    return "/";
  };

  const login = async (email, password) => {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);

    const { data } = await api.post("/auth/login", form, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    localStorage.setItem("ai_token", data.access_token);
    setToken(data.access_token);
    const currentUser = await syncUser();
    navigate(resolveRedirect(currentUser?.role));
  };

  const logout = () => {
    localStorage.removeItem("ai_token");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      loading,
      login,
      logout,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  userId: string | null;
  token: string | null;
  login: (id: string, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedToken = localStorage.getItem("token");
    if (storedUserId && storedToken) {
      setUserId(storedUserId);
      setToken(storedToken);
    }
  }, []);

  const login = (id: string, token: string) => {
    localStorage.setItem("userId", id);
    localStorage.setItem("token", token);
    setUserId(id);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setUserId(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ userId, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

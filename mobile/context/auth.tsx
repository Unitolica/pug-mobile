import { api } from '@/services/api';
import React, { createContext, useContext, useState } from 'react';

type User = {
  id: string
  name: string
  email: string
}
type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  async function login(email: string, password: string) {
    setIsLoading(true)
    try {
      await api.post("/auth", { email, password });
      const { data } = await api.get("/user/me");
      setIsLoggedIn(true)
      setUser(data);
    } catch (err) {
      console.error("error on get me", err.message, err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }
  async function logout() {
    try {
      setIsLoggedIn(false)
    } catch (err) {
    }
  }

  return <AuthContext.Provider value={{ isLoggedIn, user, login, logout, isLoading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

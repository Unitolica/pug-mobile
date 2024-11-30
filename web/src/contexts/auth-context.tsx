import React, { createContext, useContext, useCallback, ReactNode, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { api } from "@/services/api"

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_QUERY_KEY = ["user-me"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      try {
        const { data } = await api.get<User>("/user/me");
        return data;
      } catch (error) {
        if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
  });

  const fetchMe = useCallback(async () => {
    try {
      await queryClient.refetchQueries({ queryKey: USER_QUERY_KEY });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Fetch user error:", error.response?.data);
      }
      throw error;
    }
  }, [queryClient]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await api.post<{ user: User }>("/auth", {
        email,
        password,
      });
      await fetchMe()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Login failed");
      }
      throw error;
    }
  }, [fetchMe]);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");

      queryClient.setQueryData(USER_QUERY_KEY, {});
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Logout error:", error.response?.data);
      }
      throw error;
    }
  }, [queryClient]);

  const isLoggedIn = Object.keys(user ?? {}).length > 0

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoggedIn,
        login,
        logout,
        fetchMe,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

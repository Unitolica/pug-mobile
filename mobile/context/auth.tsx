import { api } from '@/services/api';
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string
  name: string
  email: string
  registration: string
  thisMonthHours: number
  UserOnCourses: {
    course: {
      id: string
      name: string
      abreviation: string
      university: {
        id: string
        name: string
        description: string
      }
    }
  }[],
  UsersOnProjects: {
    project: {
      id: string
      name: string
      description: string
      hours: number
      CoursesOnProjects: {
        course: {
          name: string
          abreviation: string
          university: {
            id: string
            name: string
            description: string
          }
        }
      }[]
    }
  }[],
  requestedTimeLogs: {
    id: string,
    description?: string,
    geolocalization?: string,
    init: Date,
    end: Date,
    projectId: string,
    approvedById?: string,
    deniedById?: string,
    createdAt: Date,
  }[]
}

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  fetchMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMe = async () => {
    try {
      const { data } = await api.get("/user/me");
      console.info(JSON.stringify(data, null, 2))
      setUser(data);
      setIsLoggedIn(true);
    } catch (err) {
      console.error("error on get me", err.message, err);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  async function login(email: string, password: string) {
    setIsLoading(true);
    try {
      await api.post("/auth", { email, password });
      await fetchMe();
    } catch (err) {
      console.error("error on login", err.message, err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    setIsLoggedIn(false);
    setUser(null);
  }

  useEffect(() => {
    fetchMe();
    const interval = setInterval(() => fetchMe(), 1000 * 5);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, logout, isLoading, fetchMe }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

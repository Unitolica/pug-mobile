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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [ user, setUser ] = useState<User | null>(
{
        id: "1",
        name: "Gabriel Rocha",
        email: "gabriel04.roch@catolicasc.edu.br"
      }
  );
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  async function login (email: string, password: string) {
    try {
      setIsLoggedIn(true)
      setUser({
        id: "1",
        name: "Gabriel Rocha",
        email: "gabriel04.roch@catolicasc.edu.br"
      })
    } catch (err) {
      throw err
    }
  }
  async function logout () {
    try {
      setIsLoggedIn(false)
    } catch (err) {

    }
  }

  return <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

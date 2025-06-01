
"use client";

import type { User, UserRole } from '@/types/user';
import { getAllUsers } from '@/lib/user-data'; 
import { useRouter, usePathname } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  currentUser: { email: string; name: string; role: UserRole; id: string } | null;
  isLoadingAuth: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; role: UserRole; id: string } | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const loadUserFromStorage = useCallback(() => {
    setIsLoadingAuth(true);
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('currentUser'); 
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  useEffect(() => {
    if (!isLoadingAuth) {
      if (!currentUser && pathname !== '/login') {
        router.push('/login');
      } else if (currentUser && pathname === '/login') {
        router.push('/');
      }
    }
  }, [currentUser, pathname, router, isLoadingAuth]);


  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoadingAuth(true);
    const users = await getAllUsers(); 
    // WARNING: Plain text password comparison. Highly insecure. For demo only.
    const user = users.find(u => u.email === email && u.password === pass); 

    if (user) {
      const userData = { email: user.email, name: user.name, role: user.role, id: user.id };
      setCurrentUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setIsLoadingAuth(false);
      router.push('/');
      return true;
    }
    setIsLoadingAuth(false);
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  if (isLoadingAuth && pathname !== '/login') {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Autenticando...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser, isLoadingAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

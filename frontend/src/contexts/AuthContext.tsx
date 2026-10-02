import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'registrar' | 'member';
  is_verified: boolean;
  reg_no?: string;
  phone?: string;
  department?: string;
  year_of_study?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, full_name: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  isInitialized: boolean;   // ← NEW: true once localStorage has been checked
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);   // ← NEW

  useEffect(() => {
    console.log('🚀 AuthProvider: initializing from localStorage');
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('✅ Found stored session:', parsedUser.email, '| role:', parsedUser.role);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (err) {
        console.error('❌ Failed to parse stored user:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      console.log('ℹ️ No stored session found');
    }
    
    // ✅ Mark initialization complete
    setIsInitialized(true);
    console.log('✅ AuthProvider initialized');
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      const res = await api.signin(email, password);
      if (!res.success) {
        throw new Error(res.error || 'Login failed');
      }
      
      console.log('✅ Login successful:', res.user.email, '| role:', res.user.role);
      
      setUser(res.user);
      setToken(res.session?.access_token || '');
      localStorage.setItem('token', res.session?.access_token || '');
      localStorage.setItem('user', JSON.stringify(res.user));
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, full_name: string) => {
    setIsLoading(true);
    try {
      if (!email || !email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address' };
      }
      if (!password || password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }
      if (!full_name || full_name.trim().length < 2) {
        return { success: false, error: 'Please enter your full name' };
      }

      const res = await api.signup(email, password, full_name);
      
      if (!res.success) {
        return { success: false, error: res.error || 'Registration failed.' };
      }
      
      return { success: true, message: 'Account created successfully!' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading, isInitialized }}>
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
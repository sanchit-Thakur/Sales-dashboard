'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  brandAccess: string[];
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (name: string, email: string, password: string, role?: string) => Promise<{ success: boolean; message?: string }>;
  demoLogin: (persona: 'datascience' | 'exec' | 'brandlead') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/sales', '/auth') || 'http://localhost:5001/api/auth';

const DEMO_PERSONAS: Record<string, User> = {
  datascience: {
    id: 'usr-ds-lead',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@omnisales.ai',
    role: 'Lead Data Scientist',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    brandAccess: ['All']
  },
  exec: {
    id: 'usr-vp-sales',
    name: 'Marcus Vance',
    email: 'marcus.vance@omnisales.ai',
    role: 'VP of Commercial Sales',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    brandAccess: ['All']
  },
  brandlead: {
    id: 'usr-brand-lead',
    name: 'Elena Rostova',
    email: 'elena.rostova@auratech.io',
    role: 'Brand Portfolio Director',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    brandAccess: ['AuraTech', 'PulseAudio']
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('omnisales_auth_token');
      const storedUser = localStorage.getItem('omnisales_user_profile');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        // Default to Data Scientist Lead persona for seamless demo experience
        const defaultUser = DEMO_PERSONAS.datascience;
        setUser(defaultUser);
        setToken('omnisales-demo-token-ds');
        localStorage.setItem('omnisales_user_profile', JSON.stringify(defaultUser));
        localStorage.setItem('omnisales_auth_token', 'omnisales-demo-token-ds');
      }
    } catch (_e) {
      setUser(DEMO_PERSONAS.datascience);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, { email, password }, { timeout: 3000 });
      const { user: userData, token: jwtToken } = res.data.data;

      setUser(userData);
      setToken(jwtToken);
      localStorage.setItem('omnisales_auth_token', jwtToken);
      localStorage.setItem('omnisales_user_profile', JSON.stringify(userData));

      return { success: true };
    } catch (err: any) {
      // Fallback local auth for testing
      const foundPersona = Object.values(DEMO_PERSONAS).find(p => p.email.toLowerCase() === email.toLowerCase());
      if (foundPersona && password === 'password123') {
        setUser(foundPersona);
        setToken('omnisales-demo-token');
        localStorage.setItem('omnisales_auth_token', 'omnisales-demo-token');
        localStorage.setItem('omnisales_user_profile', JSON.stringify(foundPersona));
        return { success: true };
      }

      return {
        success: false,
        message: err.response?.data?.message || 'Invalid email or password.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role?: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/signup`, { name, email, password, role }, { timeout: 3000 });
      const { user: userData, token: jwtToken } = res.data.data;

      setUser(userData);
      setToken(jwtToken);
      localStorage.setItem('omnisales_auth_token', jwtToken);
      localStorage.setItem('omnisales_user_profile', JSON.stringify(userData));

      return { success: true };
    } catch (err: any) {
      // Fallback signup locally
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: role || 'Data Scientist',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        brandAccess: ['All']
      };

      setUser(newUser);
      setToken(`omnisales-token-${newUser.id}`);
      localStorage.setItem('omnisales_auth_token', `omnisales-token-${newUser.id}`);
      localStorage.setItem('omnisales_user_profile', JSON.stringify(newUser));

      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (personaKey: 'datascience' | 'exec' | 'brandlead') => {
    const selected = DEMO_PERSONAS[personaKey] || DEMO_PERSONAS.datascience;
    setUser(selected);
    const mockTok = `omnisales-jwt-${selected.id}`;
    setToken(mockTok);
    localStorage.setItem('omnisales_auth_token', mockTok);
    localStorage.setItem('omnisales_user_profile', JSON.stringify(selected));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('omnisales_auth_token');
    localStorage.removeItem('omnisales_user_profile');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

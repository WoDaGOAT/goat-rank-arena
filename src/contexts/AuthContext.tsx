
import React, { createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthState } from '@/hooks/useAuthState';
import type { AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isModerator: false,
  isModeratorOrAdmin: false,
  signOut: async () => {},
  logout: async () => {},
  openLoginDialog: () => {},
  savePreLoginUrl: () => {},
  getAndClearPreLoginUrl: () => null,
  refetchUser: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('AuthProvider: Initializing');
  
  const authState = useAuthState();

  const signOut = async () => {
    console.log('AuthProvider: Signing out');
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('AuthProvider: Error signing out:', error);
    }
  };

  const logout = signOut;

  const openLoginDialog = () => {
    console.log('AuthProvider: Opening login dialog');
  };

  const savePreLoginUrl = (url: string) => {
    try {
      localStorage.setItem('preLoginUrl', url);
    } catch (error) {
      console.error('AuthProvider: Error saving preLoginUrl:', error);
    }
  };

  const getAndClearPreLoginUrl = () => {
    try {
      const url = localStorage.getItem('preLoginUrl');
      if (url) {
        localStorage.removeItem('preLoginUrl');
      }
      return url;
    } catch (error) {
      console.error('AuthProvider: Error getting preLoginUrl:', error);
      return null;
    }
  };

  console.log('AuthProvider: Rendering with loading =', authState.loading, 'isAdmin =', authState.isAdmin);

  return (
    <AuthContext.Provider value={{
      ...authState,
      signOut,
      logout,
      openLoginDialog,
      savePreLoginUrl,
      getAndClearPreLoginUrl,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

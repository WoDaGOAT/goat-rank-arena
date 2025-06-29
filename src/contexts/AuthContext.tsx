import { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { setSentryUser, addSentryBreadcrumb } from '@/lib/sentryUtils';
import { useAuthState } from '@/hooks/useAuthState';
import type { AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogMode, setAuthDialogMode] = useState<'login' | 'signup'>('login');
  const [preLoginUrl, setPreLoginUrl] = useState<string | null>(null);
  
  const {
    user,
    profile,
    loading,
    isAdmin,
    isModerator,
    isModeratorOrAdmin,
    refetchUser,
  } = useAuthState();

  // Set up Sentry user context when user changes
  useEffect(() => {
    setSentryUser(user);
    
    if (user) {
      addSentryBreadcrumb('User session active', 'auth', 'info', {
        userId: user.id,
        email: user.email,
        hasProfile: !!profile
      });
    }
  }, [user, profile]);

  // Close auth dialog when user successfully logs in
  useEffect(() => {
    if (user && authDialogOpen) {
      setAuthDialogOpen(false);
    }
  }, [user, authDialogOpen]);

  const signUp = async (credentials: { email: string; password: string; options?: any }) => {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: credentials.options
    });
    if (error) throw error;
    return data;
  };

  const signIn = async (credentials: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
    
    addSentryBreadcrumb('User signed out', 'auth', 'info');
    setSentryUser(null);
  };

  const logout = async () => {
    await signOut();
  };

  const openAuthDialog = (mode: 'login' | 'signup' = 'login') => {
    console.log('Opening auth dialog in mode:', mode);
    setAuthDialogMode(mode);
    setAuthDialogOpen(true);
  };

  const closeAuthDialog = () => {
    console.log('Closing auth dialog');
    setAuthDialogOpen(false);
  };

  // Legacy support for existing openLoginDialog calls
  const openLoginDialog = () => {
    openAuthDialog('login');
  };

  const closeLoginDialog = () => {
    closeAuthDialog();
  };

  const savePreLoginUrl = (url: string) => {
    setPreLoginUrl(url);
  };

  const getAndClearPreLoginUrl = (): string | null => {
    const url = preLoginUrl;
    setPreLoginUrl(null);
    return url;
  };

  const value: AuthContextType = {
    user,
    profile,
    session: null, // Not used in this implementation
    loading,
    isAdmin,
    isModerator,
    isModeratorOrAdmin,
    signUp,
    signIn,
    signOut,
    logout,
    openLoginDialog,
    closeLoginDialog,
    loginDialogOpen: authDialogOpen, // For backward compatibility
    openAuthDialog,
    closeAuthDialog,
    authDialogOpen,
    authDialogMode,
    savePreLoginUrl,
    getAndClearPreLoginUrl,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

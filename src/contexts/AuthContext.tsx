import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { setSentryUser } from '@/lib/sentryUtils';
import { analytics } from '@/lib/analytics';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (updates: any) => Promise<void>;
  openLoginDialog: () => void;
  closeLoginDialog: () => void;
  isLoginDialogOpen: boolean;
  savePreLoginUrl: (url: string) => void;
  preLoginUrl: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [preLoginUrl, setPreLoginUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }
    getSession()
  }, [])

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) throw error;
      setUser(user);
      analytics.trackSignUp('email');
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      setUser(user);
      setSession(session);
    } catch (error: any) {
      console.error("Error signing in:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing in with Google:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing in with Facebook:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Error resetting password:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user!.id);
      if (error) throw error;
      setUser({ ...user, ...data });
    } catch (error: any) {
      console.error("Error updating user:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const openLoginDialog = () => {
    setIsLoginDialogOpen(true);
  };

  const closeLoginDialog = () => {
    setIsLoginDialogOpen(false);
  };

  const savePreLoginUrl = (url: string) => {
    setPreLoginUrl(url);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, 'Session:', !!session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in:', session.user.id);
        setUser(session.user);
        setSentryUser(session.user);
        
        // Track user sign in and set analytics user ID
        analytics.setUserId(session.user.id);
        
        // Determine sign up method based on app_metadata
        let signUpMethod: 'email' | 'google' | 'facebook' = 'email';
        if (session.user.app_metadata?.provider === 'google') {
          signUpMethod = 'google';
        } else if (session.user.app_metadata?.provider === 'facebook') {
          signUpMethod = 'facebook';
        }
        
        // Track sign up for new users
        if (event === 'SIGNED_IN') {
          analytics.trackSignUp(signUpMethod);
        }
        
        // Fetch and set user properties for analytics
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('created_at')
            .eq('id', session.user.id)
            .single();
            
          analytics.setUserProperties({
            user_id: session.user.id,
            user_type: 'authenticated',
            registration_date: profile?.created_at || session.user.created_at
          });
        } catch (error) {
          console.error('Error fetching user profile for analytics:', error);
        }
        
        // Clear pre-login URL if user was redirected after login
        if (preLoginUrl) {
          const urlToNavigate = preLoginUrl;
          setPreLoginUrl(null);
          navigate(urlToNavigate);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
        setSentryUser(null);
        analytics.setUserId('');
        analytics.setUserProperties({ user_type: 'anonymous' });
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate, preLoginUrl]);

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    signInWithFacebook,
    resetPassword,
    updateUser,
    openLoginDialog,
    closeLoginDialog,
    isLoginDialogOpen,
    savePreLoginUrl,
    preLoginUrl,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

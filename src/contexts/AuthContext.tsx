
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { setSentryUser } from '@/lib/sentryUtils';
import { analytics } from '@/lib/analytics';
import { useAuthState } from '@/hooks/useAuthState';
import { useUserRoles } from '@/hooks/useUserRoles';
import type { AuthContextType, Profile } from '@/types/auth';

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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [preLoginUrl, setPreLoginUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  // Use the user roles hook
  const {
    isAdmin,
    isModerator,
    isModeratorOrAdmin,
    fetchUserRoles,
    updateRoleStates,
    clearRoles,
  } = useUserRoles();

  // Fetch user profile and roles
  const refetchUser = async () => {
    if (!user) return;
    
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }

      // Fetch and update roles
      const roles = await fetchUserRoles(user.id);
      updateRoleStates(roles);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }
    getSession()
  }, [])

  const signUp = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) throw error;
      setUser(user);
      analytics.trackSignUp('email');
      return { data: { user }, error: null };
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      setUser(user);
      setSession(session);
      return { data: { user, session }, error: null };
    } catch (error: any) {
      console.error("Error signing in:", error.message);
      return { data: null, error };
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
      setProfile(null);
      clearRoles();
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Alias for signOut for backward compatibility
  const logout = signOut;

  const openLoginDialog = () => {
    setIsLoginDialogOpen(true);
  };

  const closeLoginDialog = () => {
    setIsLoginDialogOpen(false);
  };

  const savePreLoginUrl = (url: string) => {
    setPreLoginUrl(url);
  };

  const getAndClearPreLoginUrl = (): string | null => {
    const url = preLoginUrl;
    setPreLoginUrl(null);
    return url;
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, 'Session:', !!session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in:', session.user.id);
        setUser(session.user);
        setSession(session);
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
        
        // Fetch user profile and roles
        setTimeout(() => {
          refetchUser();
        }, 0);
        
        // Set user properties for analytics
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
        setSession(null);
        setProfile(null);
        clearRoles();
        setSentryUser(null);
        analytics.setUserId('');
        analytics.setUserProperties({ user_type: 'anonymous' });
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate, preLoginUrl, fetchUserRoles, updateRoleStates, clearRoles]);

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    isAdmin,
    isModerator,
    isModeratorOrAdmin,
    signUp,
    signIn,
    signOut,
    logout,
    openLoginDialog,
    savePreLoginUrl,
    getAndClearPreLoginUrl,
    refetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* Login dialog would go here if needed */}
    </AuthContext.Provider>
  );
};

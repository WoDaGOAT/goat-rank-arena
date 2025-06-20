
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isModeratorOrAdmin: boolean;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Alias for signOut
  openLoginDialog: () => void;
  savePreLoginUrl: (url: string) => void;
  getAndClearPreLoginUrl: () => string | null;
  refetchUser: () => Promise<void>;
}

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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isModeratorOrAdmin, setIsModeratorOrAdmin] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const checkUserRoles = async (userId: string) => {
    try {
      const [adminResult, moderatorResult, moderatorOrAdminResult] = await Promise.all([
        supabase.rpc('is_admin', { p_user_id: userId }),
        supabase.rpc('is_moderator', { p_user_id: userId }),
        supabase.rpc('is_moderator_or_admin', { p_user_id: userId })
      ]);

      setIsAdmin(adminResult.data || false);
      setIsModerator(moderatorResult.data || false);
      setIsModeratorOrAdmin(moderatorOrAdminResult.data || false);
    } catch (error) {
      console.error('Error checking user roles:', error);
      setIsAdmin(false);
      setIsModerator(false);
      setIsModeratorOrAdmin(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      setProfile(null);
    } else {
      setProfile(profileData);
    }
  };

  const refetchUser = async () => {
    if (user) {
      await Promise.all([
        fetchProfile(user.id),
        checkUserRoles(user.id)
      ]);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await Promise.all([
          fetchProfile(session.user.id),
          checkUserRoles(session.user.id)
        ]);
      }
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await Promise.all([
          fetchProfile(session.user.id),
          checkUserRoles(session.user.id)
        ]);
      } else {
        setProfile(null);
        setIsAdmin(false);
        setIsModerator(false);
        setIsModeratorOrAdmin(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const logout = signOut; // Alias for signOut

  const openLoginDialog = () => {
    setLoginDialogOpen(true);
  };

  const savePreLoginUrl = (url: string) => {
    localStorage.setItem('preLoginUrl', url);
  };

  const getAndClearPreLoginUrl = () => {
    const url = localStorage.getItem('preLoginUrl');
    if (url) {
      localStorage.removeItem('preLoginUrl');
    }
    return url;
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      isAdmin,
      isModerator,
      isModeratorOrAdmin,
      signOut,
      logout,
      openLoginDialog,
      savePreLoginUrl,
      getAndClearPreLoginUrl,
      refetchUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

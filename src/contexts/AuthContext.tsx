
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
  console.log('AuthProvider: Initializing');
  
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isModeratorOrAdmin, setIsModeratorOrAdmin] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const checkUserRoles = async (userId: string) => {
    console.log('AuthProvider: Checking user roles for', userId);
    try {
      // Use Promise.allSettled to prevent one failed request from breaking all others
      const [adminResult, moderatorResult, moderatorOrAdminResult] = await Promise.allSettled([
        supabase.rpc('is_admin', { p_user_id: userId }),
        supabase.rpc('is_moderator', { p_user_id: userId }),
        supabase.rpc('is_moderator_or_admin', { p_user_id: userId })
      ]);

      console.log('AuthProvider: Role check results', {
        admin: adminResult.status === 'fulfilled' ? adminResult.value.data : 'failed',
        moderator: moderatorResult.status === 'fulfilled' ? moderatorResult.value.data : 'failed',
        moderatorOrAdmin: moderatorOrAdminResult.status === 'fulfilled' ? moderatorOrAdminResult.value.data : 'failed'
      });

      setIsAdmin(adminResult.status === 'fulfilled' ? (adminResult.value.data || false) : false);
      setIsModerator(moderatorResult.status === 'fulfilled' ? (moderatorResult.value.data || false) : false);
      setIsModeratorOrAdmin(moderatorOrAdminResult.status === 'fulfilled' ? (moderatorOrAdminResult.value.data || false) : false);
    } catch (error) {
      console.error('AuthProvider: Error checking user roles:', error);
      setIsAdmin(false);
      setIsModerator(false);
      setIsModeratorOrAdmin(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    console.log('AuthProvider: Fetching profile for', userId);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('AuthProvider: Error fetching profile:', profileError);
        setProfile(null);
      } else {
        console.log('AuthProvider: Profile fetched successfully');
        setProfile(profileData);
      }
    } catch (error) {
      console.error('AuthProvider: Profile fetch failed:', error);
      setProfile(null);
    }
  };

  const refetchUser = async () => {
    if (user) {
      await Promise.allSettled([
        fetchProfile(user.id),
        checkUserRoles(user.id)
      ]);
    }
  };

  useEffect(() => {
    console.log('AuthProvider: useEffect started');
    
    const getSession = async () => {
      try {
        console.log('AuthProvider: Getting initial session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthProvider: Error getting session:', error);
        }
        
        console.log('AuthProvider: Initial session:', session ? 'Found' : 'None');
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use Promise.allSettled to prevent auth initialization from failing if role checks fail
          await Promise.allSettled([
            fetchProfile(session.user.id),
            checkUserRoles(session.user.id)
          ]);
        }
        setLoading(false);
        console.log('AuthProvider: Initial setup complete');
      } catch (error) {
        console.error('AuthProvider: Error in getSession:', error);
        setLoading(false);
      }
    };

    getSession();

    console.log('AuthProvider: Setting up auth state listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthProvider: Auth state changed:', event, session ? 'Session exists' : 'No session');
      
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await Promise.allSettled([
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

    return () => {
      console.log('AuthProvider: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log('AuthProvider: Signing out');
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('AuthProvider: Error signing out:', error);
    }
  };

  const logout = signOut; // Alias for signOut

  const openLoginDialog = () => {
    setLoginDialogOpen(true);
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

  console.log('AuthProvider: Rendering with loading =', loading);

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

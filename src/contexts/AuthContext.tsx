
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isModeratorOrAdmin: boolean;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
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

  const fetchUserRoles = async (userId: string): Promise<AppRole[]> => {
    console.log('AuthProvider: Fetching roles for user', userId);
    try {
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (rolesError) {
        console.error('AuthProvider: Error fetching roles:', rolesError);
        return [];
      }

      const roles = rolesData?.map(r => r.role) || [];
      console.log('AuthProvider: User roles fetched:', roles);
      return roles;
    } catch (error) {
      console.error('AuthProvider: Role fetch failed:', error);
      return [];
    }
  };

  const updateRoleStates = (roles: AppRole[]) => {
    const adminRole = roles.includes('admin');
    const moderatorRole = roles.includes('moderator');
    
    setIsAdmin(adminRole);
    setIsModerator(moderatorRole);
    setIsModeratorOrAdmin(adminRole || moderatorRole);
    
    console.log('AuthProvider: Role states updated', { 
      isAdmin: adminRole, 
      isModerator: moderatorRole, 
      isModeratorOrAdmin: adminRole || moderatorRole 
    });
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

  const fetchUserData = async (userId: string) => {
    console.log('AuthProvider: Fetching user data for', userId);
    
    // Fetch both profile and roles
    await Promise.all([
      fetchProfile(userId),
      fetchUserRoles(userId).then(roles => updateRoleStates(roles))
    ]);
  };

  const refetchUser = async () => {
    console.log('AuthProvider: Refetching user data');
    if (user) {
      await fetchUserData(user.id);
    }
  };

  useEffect(() => {
    console.log('AuthProvider: useEffect started');
    
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('AuthProvider: Getting initial session');
        
        // Set up auth state listener first
        console.log('AuthProvider: Setting up auth state listener');
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('AuthProvider: Auth state changed:', event, session ? 'Session exists' : 'No session');
          
          if (!mounted) return;

          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Fetch user data with roles
            setTimeout(() => {
              if (mounted) {
                fetchUserData(session.user.id);
              }
            }, 0);
          } else {
            setProfile(null);
            setIsAdmin(false);
            setIsModerator(false);
            setIsModeratorOrAdmin(false);
          }
          
          if (mounted) {
            setLoading(false);
          }
        });

        // Then get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthProvider: Error getting session:', error);
        }
        
        console.log('AuthProvider: Initial session:', session ? 'Found' : 'None');
        
        if (mounted) {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            setTimeout(() => {
              if (mounted) {
                fetchUserData(session.user.id);
              }
            }, 0);
          }
          setLoading(false);
        }

        console.log('AuthProvider: Initial setup complete');

        return () => {
          console.log('AuthProvider: Cleaning up subscription');
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('AuthProvider: Error in initialization:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const cleanup = initializeAuth();
    
    return () => {
      mounted = false;
      cleanup.then(cleanupFn => cleanupFn && cleanupFn());
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

  console.log('AuthProvider: Rendering with loading =', loading, 'isAdmin =', isAdmin);

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

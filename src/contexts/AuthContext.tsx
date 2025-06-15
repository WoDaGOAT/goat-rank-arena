
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import LoginDialog from '@/components/auth/LoginDialog';

export type Profile = Database['public']['Tables']['profiles']['Row'] & {
  country?: string | null;
  favorite_sports?: string[] | null;
};

type AppRole = Database['public']['Enums']['app_role'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  roles: AppRole[];
  isAdmin: boolean;
  loading: boolean;
  refetchUser: () => Promise<void>;
  openLoginDialog: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  roles: [],
  isAdmin: false,
  loading: true,
  refetchUser: async () => {},
  openLoginDialog: () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const fetchUserAndProfile = useCallback(async () => {
    setLoading(true);
    const { data: { session }, error: sessionError } = await supabase!.auth.getSession();
    
    if (sessionError) {
        console.error("Error fetching session:", sessionError);
        setLoading(false);
        return;
    }

    setSession(session);
    const currentUser = session?.user ?? null;
    setUser(currentUser);

    if (currentUser) {
      const { data: profileData, error: profileError } = await supabase!
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError.message);
      }
      setProfile(profileData);

      const { data: rolesData, error: rolesError } = await supabase!
        .from('user_roles')
        .select('role')
        .eq('user_id', currentUser.id);
      
      if (rolesError) {
        console.error("Error fetching user roles:", rolesError.message);
      }
      const userRoles = rolesData ? rolesData.map(r => r.role) : [];
      setRoles(userRoles);

    } else {
      setProfile(null);
      setRoles([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUserAndProfile();

    const { data: { subscription } } = supabase!.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (_event === 'SIGNED_IN' || _event === 'USER_UPDATED' || _event === 'SIGNED_OUT') {
        fetchUserAndProfile();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserAndProfile]);

  const logout = async () => {
    await supabase!.auth.signOut();
  };

  const openLoginDialog = () => setIsLoginDialogOpen(true);

  const isAdmin = roles.includes('admin');

  const value = {
    user,
    session,
    profile,
    roles,
    isAdmin,
    loading,
    refetchUser: fetchUserAndProfile,
    openLoginDialog,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      <LoginDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} />
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

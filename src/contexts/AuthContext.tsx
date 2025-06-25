import { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { setSentryUser, addSentryBreadcrumb } from '@/lib/sentryUtils';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (credentials: { email?: string; password?: string }) => Promise<any>;
  signIn: (credentials: { email?: string; password?: string }) => Promise<any>;
  signOut: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setSession(session ?? null);
      setSentryUser(currentUser);
      
      if (currentUser) {
        addSentryBreadcrumb('User session restored', 'auth', 'info', {
          userId: currentUser.id,
          email: currentUser.email
        });
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setSession(session ?? null);
      setSentryUser(currentUser);
      
      if (event === 'SIGNED_IN' && currentUser) {
        addSentryBreadcrumb('User signed in', 'auth', 'info', {
          userId: currentUser.id,
          email: currentUser.email,
          provider: currentUser.app_metadata?.provider
        });
      } else if (event === 'SIGNED_OUT') {
        addSentryBreadcrumb('User signed out', 'auth', 'info');
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (credentials: { email?: string; password?: string }) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp(credentials);
    setLoading(false);
    if (error) throw error;
    return data;
  };

  const signIn = async (credentials: { email?: string; password?: string }) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    setLoading(false);
    if (error) throw error;
    return data;
  };

  const signOut = async (): Promise<boolean> => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) {
      console.error('Sign out error:', error);
      return false;
    }
    return true;
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
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

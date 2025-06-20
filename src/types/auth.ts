
import type { User } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type AppRole = Database['public']['Enums']['app_role'];

export interface AuthContextType {
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

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isModeratorOrAdmin: boolean;
}

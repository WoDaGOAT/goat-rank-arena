
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useUserRoles } from './useUserRoles';
import { useUserProfile } from './useUserProfile';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    isAdmin,
    isModerator,
    isModeratorOrAdmin,
    fetchUserRoles,
    updateRoleStates,
    clearRoles,
  } = useUserRoles();

  const {
    profile,
    fetchProfile,
    clearProfile,
  } = useUserProfile();

  const fetchUserData = useCallback(async (userId: string) => {
    console.log('useAuthState: Fetching user data for', userId);
    
    // Fetch both profile and roles
    await Promise.all([
      fetchProfile(userId),
      fetchUserRoles(userId).then(roles => updateRoleStates(roles))
    ]);
  }, [fetchProfile, fetchUserRoles, updateRoleStates]);

  const refetchUser = useCallback(async () => {
    console.log('useAuthState: Refetching user data');
    if (user) {
      await fetchUserData(user.id);
    }
  }, [user, fetchUserData]);

  useEffect(() => {
    console.log('useAuthState: useEffect started');
    
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('useAuthState: Getting initial session');
        
        // Set up auth state listener first
        console.log('useAuthState: Setting up auth state listener');
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('useAuthState: Auth state changed:', event, session ? 'Session exists' : 'No session');
          
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
            clearProfile();
            clearRoles();
          }
          
          if (mounted) {
            setLoading(false);
          }
        });

        // Then get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('useAuthState: Error getting session:', error);
        }
        
        console.log('useAuthState: Initial session:', session ? 'Found' : 'None');
        
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

        console.log('useAuthState: Initial setup complete');

        return () => {
          console.log('useAuthState: Cleaning up subscription');
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('useAuthState: Error in initialization:', error);
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
  }, [fetchUserData, clearProfile, clearRoles]);

  return {
    user,
    profile,
    loading,
    isAdmin,
    isModerator,
    isModeratorOrAdmin,
    refetchUser,
  };
};

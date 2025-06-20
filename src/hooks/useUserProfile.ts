
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/auth';

export const useUserProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    console.log('useUserProfile: Fetching profile for', userId);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('useUserProfile: Error fetching profile:', profileError);
        setProfile(null);
      } else {
        console.log('useUserProfile: Profile fetched successfully');
        setProfile(profileData);
      }
    } catch (error) {
      console.error('useUserProfile: Profile fetch failed:', error);
      setProfile(null);
    }
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(null);
  }, []);

  return {
    profile,
    fetchProfile,
    clearProfile,
  };
};

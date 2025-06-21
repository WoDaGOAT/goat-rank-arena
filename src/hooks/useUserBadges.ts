
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { UserBadge } from '@/types/badges';

export const useUserBadges = () => {
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserBadges = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_badges')
          .select('*')
          .eq('user_id', user.id)
          .order('earned_at', { ascending: false });

        if (error) throw error;

        // Map database records to UserBadge type with badge details from BADGES constant
        const { BADGES } = await import('@/data/badges');
        const mappedBadges: UserBadge[] = data.map(userBadge => ({
          id: userBadge.id,
          badge_id: userBadge.badge_id,
          user_id: userBadge.user_id,
          earned_at: userBadge.earned_at,
          badge: BADGES.find(b => b.id === userBadge.badge_id)!
        })).filter(ub => ub.badge); // Filter out badges that don't exist in BADGES

        setUserBadges(mappedBadges);
      } catch (error) {
        console.error('Error fetching user badges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBadges();
  }, [user]);

  return { userBadges, loading };
};

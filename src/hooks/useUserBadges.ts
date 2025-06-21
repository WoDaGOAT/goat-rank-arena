
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
        setUserBadges([]);
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

        console.log('Raw user badges from database:', data);

        // Map database records to UserBadge type with badge details from BADGES constant
        const { BADGES } = await import('@/data/badges');
        const mappedBadges: UserBadge[] = data.map(userBadge => {
          const badge = BADGES.find(b => b.id === userBadge.badge_id);
          console.log(`Mapping badge ${userBadge.badge_id}: found=${!!badge}`);
          
          return {
            id: userBadge.id,
            badge_id: userBadge.badge_id,
            user_id: userBadge.user_id,
            earned_at: userBadge.earned_at,
            badge: badge!
          };
        }).filter(ub => ub.badge); // Filter out badges that don't exist in BADGES

        console.log('Mapped user badges:', mappedBadges);
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

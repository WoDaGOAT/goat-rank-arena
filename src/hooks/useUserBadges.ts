
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
        console.log('Fetching badges for user:', user.id);
        
        const { data, error } = await supabase
          .from('user_badges')
          .select('*')
          .eq('user_id', user.id)
          .order('earned_at', { ascending: false });

        if (error) {
          console.error('Error fetching user badges:', error);
          throw error;
        }

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
        setUserBadges([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBadges();
  }, [user]);

  // Function to manually trigger badge check and refresh
  const refreshBadges = async () => {
    if (!user) return;
    
    try {
      console.log('Manually triggering badge check for user:', user.id);
      const { error } = await supabase.rpc('check_and_award_badges', {
        p_user_id: user.id
      });
      
      if (error) {
        console.error('Error checking badges:', error);
      } else {
        console.log('Badge check completed successfully, refreshing badges...');
        // Refetch badges after checking
        const { data } = await supabase
          .from('user_badges')
          .select('*')
          .eq('user_id', user.id)
          .order('earned_at', { ascending: false });

        if (data) {
          const { BADGES } = await import('@/data/badges');
          const mappedBadges: UserBadge[] = data.map(userBadge => {
            const badge = BADGES.find(b => b.id === userBadge.badge_id);
            return {
              id: userBadge.id,
              badge_id: userBadge.badge_id,
              user_id: userBadge.user_id,
              earned_at: userBadge.earned_at,
              badge: badge!
            };
          }).filter(ub => ub.badge);
          
          setUserBadges(mappedBadges);
        }
      }
    } catch (error) {
      console.error('Error calling badge check function:', error);
    }
  };

  return { userBadges, loading, refreshBadges };
};


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
        console.log('Available badges:', BADGES.map(b => ({ id: b.id, icon: b.icon })));
        
        const mappedBadges: UserBadge[] = data.map(userBadge => {
          const badge = BADGES.find(b => b.id === userBadge.badge_id);
          console.log(`Mapping badge ${userBadge.badge_id}: found=${!!badge}`, badge ? { name: badge.name, icon: badge.icon } : 'NOT FOUND');
          
          if (!badge) {
            console.warn(`Badge definition not found for badge_id: ${userBadge.badge_id}`);
            return null;
          }
          
          return {
            id: userBadge.id,
            badge_id: userBadge.badge_id,
            user_id: userBadge.user_id,
            earned_at: userBadge.earned_at,
            badge: badge
          };
        }).filter((ub): ub is UserBadge => ub !== null); // Filter out null values with type guard

        console.log('Successfully mapped user badges:', mappedBadges);
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
            if (!badge) {
              console.warn(`Badge definition not found for badge_id: ${userBadge.badge_id}`);
              return null;
            }
            return {
              id: userBadge.id,
              badge_id: userBadge.badge_id,
              user_id: userBadge.user_id,
              earned_at: userBadge.earned_at,
              badge: badge
            };
          }).filter((ub): ub is UserBadge => ub !== null);
          
          console.log('Refreshed badges:', mappedBadges);
          setUserBadges(mappedBadges);
        }
      }
    } catch (error) {
      console.error('Error calling badge check function:', error);
    }
  };

  return { userBadges, loading, refreshBadges };
};

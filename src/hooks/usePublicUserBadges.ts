
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { UserBadge } from '@/types/badges';

export const usePublicUserBadges = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['publicUserBadges', userId],
    queryFn: async () => {
      if (!userId) return [];

      try {
        const { data, error } = await supabase
          .from('user_badges')
          .select('*')
          .eq('user_id', userId)
          .order('earned_at', { ascending: false });

        if (error) {
          console.error('Error fetching user badges:', error);
          throw error;
        }

        // Map database records to UserBadge type with badge details from BADGES constant
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

        return mappedBadges;
      } catch (error) {
        console.error('Error fetching user badges:', error);
        return [];
      }
    },
    enabled: !!userId,
  });
};

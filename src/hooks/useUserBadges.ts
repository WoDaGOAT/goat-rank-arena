
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { UserBadge } from "@/types/badges";
import { badgeCache } from "@/utils/badgeCache";

export const useUserBadges = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['user-badges', user?.id],
    queryFn: async (): Promise<UserBadge[]> => {
      if (!user?.id) {
        return [];
      }

      console.log('Fetching user badges for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_badges')
        .select('id, badge_id, earned_at')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) {
        console.error('Error fetching user badges:', error);
        throw error;
      }

      console.log('User badges fetched:', data);
      
      // Map to UserBadge type with badge details from cache
      const mappedBadges: UserBadge[] = (data || []).map(userBadge => {
        const badge = badgeCache.getBadge(userBadge.badge_id);
        
        if (!badge) {
          console.warn(`Badge definition not found for badge_id: ${userBadge.badge_id}`);
          return null;
        }
        
        return {
          id: userBadge.id,
          badge_id: userBadge.badge_id,
          user_id: user.id,
          earned_at: userBadge.earned_at,
          badge: badge
        };
      }).filter((ub): ub is UserBadge => ub !== null);

      return mappedBadges;
    },
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes - badges don't change frequently
    gcTime: 60 * 60 * 1000, // 1 hour - keep badges in cache longer
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  const refreshBadges = () => {
    queryClient.invalidateQueries({ queryKey: ['user-badges', user?.id] });
  };

  return {
    userBadges: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refreshBadges,
    ...query
  };
};

// Hook for public user badges (for viewing other users' profiles)
export const usePublicUserBadges = (userId: string | undefined) => {
  const query = useQuery({
    queryKey: ['public-user-badges', userId],
    queryFn: async (): Promise<UserBadge[]> => {
      if (!userId) {
        return [];
      }

      const { data, error } = await supabase
        .from('user_badges')
        .select('id, badge_id, earned_at')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) {
        console.error('Error fetching public user badges:', error);
        throw error;
      }

      // Map to UserBadge type with badge details from cache
      const mappedBadges: UserBadge[] = (data || []).map(userBadge => {
        const badge = badgeCache.getBadge(userBadge.badge_id);
        
        if (!badge) {
          console.warn(`Badge definition not found for badge_id: ${userBadge.badge_id}`);
          return null;
        }
        
        return {
          id: userBadge.id,
          badge_id: userBadge.badge_id,
          user_id: userId,
          earned_at: userBadge.earned_at,
          badge: badge
        };
      }).filter((ub): ub is UserBadge => ub !== null);

      return mappedBadges;
    },
    enabled: !!userId,
    staleTime: 15 * 60 * 1000, // 15 minutes - public badges change even less frequently
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    refetchOnWindowFocus: false,
  });

  return {
    userBadges: query.data || [],
    loading: query.isLoading,
    error: query.error,
    ...query
  };
};


import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UserBadge {
  id: string;
  badge_id: string;
  earned_at: string;
  badge?: {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: string;
  };
}

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
      return data || [];
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

      return data || [];
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

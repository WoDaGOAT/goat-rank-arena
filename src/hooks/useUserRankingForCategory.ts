
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export const useUserRankingForCategory = (categoryId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userRanking', categoryId, user?.id],
    queryFn: async () => {
      console.log('🔍 useUserRankingForCategory - Fetching user ranking:', { categoryId, userId: user?.id });
      
      if (!user?.id || !categoryId) {
        console.log('🔍 useUserRankingForCategory - No user or categoryId, returning null');
        return null;
      }

      try {
        const { data, error } = await supabase
          .from('user_rankings')
          .select('id, title, created_at')
          .eq('user_id', user.id)
          .eq('category_id', categoryId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('🔍 useUserRankingForCategory - Error fetching user ranking:', error);
          throw error;
        }

        // More strict validation - ensure we have a complete ranking
        if (!data || data.length === 0) {
          console.log('🔍 useUserRankingForCategory - No ranking found');
          return null;
        }

        const ranking = data[0];
        
        // Validate that the ranking has a proper ID
        if (!ranking.id || ranking.id.trim() === '') {
          console.log('🔍 useUserRankingForCategory - Invalid ranking ID, treating as no ranking');
          return null;
        }

        console.log('🔍 useUserRankingForCategory - Found ranking:', ranking);
        return ranking;
      } catch (error) {
        console.error('🔍 useUserRankingForCategory - Fatal error:', error);
        return null;
      }
    },
    enabled: !!user?.id && !!categoryId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: true, // Refetch when returning to the page
    refetchOnMount: true, // Always refetch on mount to get fresh data
  });
};

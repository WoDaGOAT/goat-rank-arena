
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export const useUserRankingForCategory = (categoryId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['userRanking', categoryId, user?.id];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      console.log('🔍 useUserRankingForCategory - Fetching user ranking:', { categoryId, userId: user?.id });
      
      if (!user?.id || !categoryId) {
        console.log('🔍 useUserRankingForCategory - No user or categoryId, returning null');
        return null;
      }

      try {
        // Query to get user ranking WITH athlete count to check completeness
        const { data, error } = await supabase
          .from('user_rankings')
          .select(`
            id, 
            title, 
            created_at,
            ranking_athletes!inner(id)
          `)
          .eq('user_id', user.id)
          .eq('category_id', categoryId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('🔍 useUserRankingForCategory - Error fetching user ranking:', error);
          throw error;
        }

        // Check if we have a ranking AND it has athletes
        if (!data || data.length === 0) {
          console.log('🔍 useUserRankingForCategory - No ranking found');
          return null;
        }

        const ranking = data[0];
        const athleteCount = ranking.ranking_athletes?.length || 0;
        
        // Only consider it a valid ranking if it has at least 3 athletes (minimum requirement)
        if (athleteCount < 3) {
          console.log('🔍 useUserRankingForCategory - Ranking incomplete, only has', athleteCount, 'athletes');
          return null;
        }

        console.log('🔍 useUserRankingForCategory - Found complete ranking:', {
          id: ranking.id,
          athleteCount,
          title: ranking.title
        });
        
        return {
          id: ranking.id,
          title: ranking.title,
          created_at: ranking.created_at
        };
      } catch (error) {
        console.error('🔍 useUserRankingForCategory - Fatal error:', error);
        return null;
      }
    },
    enabled: !!user?.id && !!categoryId,
    staleTime: 1000 * 30, // 30 seconds - fresh data for better UX
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: false, // Disable to reduce unnecessary requests
    retry: 1,
  });

  // Add logging to track query state changes
  useEffect(() => {
    console.log('🔍 useUserRankingForCategory - Query state changed:', {
      categoryId,
      userId: user?.id,
      hasData: !!query.data,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      isStale: queryClient.getQueryState(queryKey)?.isInvalidated,
      data: query.data
    });
  }, [query.data, query.isLoading, query.isFetching, categoryId, user?.id, queryClient, queryKey]);

  return query;
};

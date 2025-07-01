
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

type RankingStatus = 'empty' | 'incomplete' | 'complete';

interface RankingData {
  id: string;
  title?: string;
  created_at?: string;
  athleteCount?: number;
}

interface UserRankingResult {
  status: RankingStatus;
  ranking: RankingData | null;
}

export const useUserRankingForCategory = (categoryId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['userRanking', categoryId, user?.id];

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<UserRankingResult> => {
      console.log('🔍 useUserRankingForCategory - Fetching user ranking:', { categoryId, userId: user?.id });
      
      if (!user?.id || !categoryId) {
        console.log('🔍 useUserRankingForCategory - No user or categoryId, returning empty');
        return { status: 'empty', ranking: null };
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

        // Check if we have a ranking
        if (!data || data.length === 0) {
          console.log('🔍 useUserRankingForCategory - No ranking found, returning empty');
          return { status: 'empty', ranking: null };
        }

        const ranking = data[0];
        const athleteCount = ranking.ranking_athletes?.length || 0;
        
        console.log('🔍 useUserRankingForCategory - Found ranking:', {
          id: ranking.id,
          athleteCount,
          title: ranking.title
        });

        // Return different states based on completeness
        if (athleteCount === 0) {
          console.log('🔍 useUserRankingForCategory - Ranking has no athletes, returning empty');
          return { status: 'empty', ranking: null };
        }

        if (athleteCount < 3) {
          console.log('🔍 useUserRankingForCategory - Ranking incomplete, only has', athleteCount, 'athletes');
          return { 
            status: 'incomplete', 
            ranking: { 
              id: ranking.id, 
              athleteCount,
              title: ranking.title,
              created_at: ranking.created_at
            } 
          };
        }

        console.log('🔍 useUserRankingForCategory - Found complete ranking');
        return { 
          status: 'complete', 
          ranking: { 
            id: ranking.id, 
            title: ranking.title, 
            created_at: ranking.created_at,
            athleteCount
          } 
        };
      } catch (error) {
        console.error('🔍 useUserRankingForCategory - Fatal error:', error);
        return { status: 'empty', ranking: null };
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
    const result = query.data;
    console.log('🔍 useUserRankingForCategory - Query state changed:', {
      categoryId,
      userId: user?.id,
      status: result?.status || 'loading',
      hasRanking: !!result?.ranking,
      rankingId: result?.ranking?.id,
      athleteCount: result?.ranking?.athleteCount,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      isStale: queryClient.getQueryState(queryKey)?.isInvalidated,
    });
  }, [query.data, query.isLoading, query.isFetching, categoryId, user?.id, queryClient, queryKey]);

  return {
    ...query,
    status: query.data?.status || 'empty',
    ranking: query.data?.ranking || null
  };
};

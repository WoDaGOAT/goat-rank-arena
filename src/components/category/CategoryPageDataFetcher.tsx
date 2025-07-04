
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useUserRankingForCategory } from "@/hooks/useUserRankingForCategory";
import { useLeaderboardData } from "@/hooks/useLeaderboardData";
import { useEffect } from "react";

type DbCategory = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
};

interface CategoryPageDataFetcherProps {
  categoryId: string;
  children: (data: {
    dbCategory: DbCategory | null;
    userRankingStatus: 'empty' | 'incomplete' | 'complete';
    userRanking: any;
    submittedRankingsCount: number;
    leaderboardAthletes: any[];
    isLoading: boolean;
    errors: {
      categoryError: any;
      leaderboardError: any;
      userRankingError: any;
      rankingsCountError: any;
    };
    refetch: {
      refetchCategory: () => void;
      refetchLeaderboard: () => void;
    };
  }) => React.ReactNode;
}

const CategoryPageDataFetcher = ({ categoryId, children }: CategoryPageDataFetcherProps) => {
  const queryClient = useQueryClient();
  
  console.log('🔧 CategoryPageDataFetcher - START:', { categoryId });
  
  // Force invalidation of user ranking queries when category changes or component mounts
  useEffect(() => {
    if (categoryId) {
      console.log('🔧 CategoryPageDataFetcher - Force invalidating queries for category:', categoryId);
      
      // Nuclear option: remove queries entirely to force fresh fetch
      queryClient.removeQueries({ queryKey: ['userRanking', categoryId] });
      queryClient.removeQueries({ queryKey: ['categoryRankingsCount', categoryId] });
      
      // Clear any stale localStorage that might interfere
      try {
        const storageKey = 'wodagoat_athlete_selection';
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const selectionData = JSON.parse(saved);
          // Clear if it's for a different category or expired
          if (selectionData.categoryId !== categoryId || 
              (selectionData.expiresAt && Date.now() > selectionData.expiresAt)) {
            localStorage.removeItem(storageKey);
            console.log('🔧 CategoryPageDataFetcher - Cleared stale localStorage selection');
          }
        }
      } catch (error) {
        console.warn('🔧 CategoryPageDataFetcher - Failed to check localStorage:', error);
      }
    }
  }, [categoryId, queryClient]);
  
  // Check if user has existing ranking for this category
  const { status: userRankingStatus, ranking: userRanking, isLoading: isLoadingUserRanking, isFetching: isFetchingUserRanking, error: userRankingError } = useUserRankingForCategory(categoryId);
  
  console.log('🔧 CategoryPageDataFetcher - User ranking result:', {
    userRankingStatus,
    userRanking: userRanking ? { id: userRanking.id, athleteCount: userRanking.athleteCount } : null,
    categoryId,
    isLoadingUserRanking,
    isFetchingUserRanking
  });

  // Fetch category data from Supabase
  const { data: dbCategory, isLoading: isLoadingCategory, error: categoryError, refetch: refetchCategory } = useQuery<DbCategory | null>({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      console.log('🔧 CategoryPageDataFetcher - Fetching category data for ID:', categoryId);
      
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('id', categoryId)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('🔧 CategoryPageDataFetcher - Error fetching category:', error);
          throw error;
        }
        
        console.log('🔧 CategoryPageDataFetcher - Category data fetched:', data);
        return data;
      } catch (error) {
        console.error('🔧 CategoryPageDataFetcher - Fatal category fetch error:', error);
        throw error;
      }
    },
    enabled: !!categoryId,
    retry: (failureCount, error) => {
      const errorMessage = error?.message || '';
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        return failureCount < 2;
      }
      return false;
    },
  });

  // Fetch submitted rankings count for this category
  const { data: submittedRankingsCount, isLoading: isLoadingRankingsCount, error: rankingsCountError } = useQuery({
    queryKey: ['categoryRankingsCount', categoryId],
    queryFn: async () => {
      if (!categoryId) return 0;
      
      try {
        console.log('🔧 CategoryPageDataFetcher - Fetching rankings count for category:', categoryId);
        
        const { count, error } = await supabase
          .from('user_rankings')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', categoryId);
        
        if (error) {
          console.error('🔧 CategoryPageDataFetcher - Error fetching rankings count:', error);
          return 0;
        }
        
        console.log('🔧 CategoryPageDataFetcher - Rankings count result:', count);
        return count || 0;
      } catch (error) {
        console.error('🔧 CategoryPageDataFetcher - Fatal rankings count error:', error);
        return 0;
      }
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: (failureCount, error) => {
      const errorMessage = error?.message || '';
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        return failureCount < 2;
      }
      return false;
    },
  });

  // Fetch optimized leaderboard data
  const { data: leaderboardAthletes, isLoading: isLoadingLeaderboard, error: leaderboardError, refetch: refetchLeaderboard } = useLeaderboardData(categoryId || "");

  const isLoading = isLoadingCategory || isLoadingLeaderboard || isLoadingRankingsCount || isLoadingUserRanking || isFetchingUserRanking;

  console.log('🔧 CategoryPageDataFetcher - FINAL STATE:', {
    isLoading,
    dbCategory: !!dbCategory,
    categoryName: dbCategory?.name,
    userRankingStatus,
    userRanking: userRanking ? { id: userRanking.id, athleteCount: userRanking.athleteCount } : null,
    submittedRankingsCount,
    leaderboardAthletesCount: leaderboardAthletes?.length || 0,
    hasErrors: !!(categoryError || leaderboardError || userRankingError || rankingsCountError)
  });

  const handleRetry = () => {
    console.log('🔧 CategoryPageDataFetcher - Retrying all queries...');
    refetchCategory();
    refetchLeaderboard();
    queryClient.invalidateQueries({ queryKey: ['categoryRankingsCount', categoryId] });
    queryClient.invalidateQueries({ queryKey: ['userRanking', categoryId] });
  };

  return (
    <>
      {children({
        dbCategory,
        userRankingStatus,
        userRanking,
        submittedRankingsCount: submittedRankingsCount || 0,
        leaderboardAthletes: leaderboardAthletes || [],
        isLoading,
        errors: {
          categoryError,
          leaderboardError,
          userRankingError,
          rankingsCountError
        },
        refetch: {
          refetchCategory,
          refetchLeaderboard: handleRetry
        }
      })}
    </>
  );
};

export default CategoryPageDataFetcher;

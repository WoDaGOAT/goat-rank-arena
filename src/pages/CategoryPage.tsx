
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRankingForCategory } from "@/hooks/useUserRankingForCategory";
import { useLeaderboardData } from "@/hooks/useLeaderboardData";
import { Helmet } from "react-helmet-async";
import CategoryPageHeader from "@/components/category/CategoryPageHeader";
import CategoryPageContent from "@/components/category/CategoryPageContent";
import FloatingActionButton from "@/components/category/FloatingActionButton";
import CategoryNotFound from "@/components/category/CategoryNotFound";
import CategoryNetworkError from "@/components/category/CategoryNetworkError";

type DbCategory = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
};

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  console.log('CategoryPage - URL categoryId from params:', categoryId);
  console.log('CategoryPage - Current user:', user?.id);
  
  // Ensure we have a valid categoryId before proceeding
  if (!categoryId) {
    console.error('CategoryPage - No categoryId found in URL params');
    return <CategoryNotFound />;
  }
  
  // Check if user has existing ranking for this category
  const { data: userRanking, isLoading: isLoadingUserRanking, error: userRankingError } = useUserRankingForCategory(categoryId);
  
  console.log('CategoryPage - User ranking for this category:', {
    userRanking,
    categoryId,
    hasRanking: Boolean(userRanking)
  });

  // Fetch category data from Supabase
  const { data: dbCategory, isLoading: isLoadingCategory, error: categoryError, refetch: refetchCategory } = useQuery<DbCategory | null>({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      console.log('CategoryPage - Fetching category data for ID:', categoryId);
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('CategoryPage - Error fetching category:', error);
        throw error;
      }
      
      console.log('CategoryPage - Category data fetched:', data);
      return data;
    },
    enabled: !!categoryId,
    retry: (failureCount, error) => {
      // Only retry network errors, not data-not-found errors
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
      
      const { count, error } = await supabase
        .from('user_rankings')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId);
      
      if (error) {
        console.error('Error fetching rankings count:', error);
        return 0;
      }
      
      return count || 0;
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

  const isLoading = isLoadingCategory || isLoadingLeaderboard || isLoadingRankingsCount;

  // Check if we have network connectivity issues
  const hasNetworkError = (error: any) => {
    const errorMessage = error?.message || '';
    return errorMessage.includes('Failed to fetch') || 
           errorMessage.includes('NetworkError') || 
           errorMessage.includes('TypeError: Failed to fetch');
  };

  const isNetworkError = hasNetworkError(categoryError) || 
                        hasNetworkError(leaderboardError) || 
                        hasNetworkError(userRankingError) ||
                        hasNetworkError(rankingsCountError);

  // Handle network errors with retry functionality
  if (isNetworkError && !isLoading) {
    const handleRetry = () => {
      console.log('CategoryPage - Retrying all queries...');
      refetchCategory();
      refetchLeaderboard();
      queryClient.invalidateQueries({ queryKey: ['categoryRankingsCount', categoryId] });
      queryClient.invalidateQueries({ queryKey: ['userRanking', categoryId] });
    };

    return <CategoryNetworkError onRetry={handleRetry} />;
  }

  // Handle other errors
  if ((categoryError || leaderboardError) && !isNetworkError) {
    console.error('Category page error:', { categoryError, leaderboardError });
  }

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Loading Category... | Wodagoat</title>
          <meta name="description" content="Loading category details, leaderboards, and community rankings." />
        </Helmet>
        <div className="flex flex-col flex-grow min-h-screen px-3 sm:px-4 md:px-8" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
          <div className="container mx-auto py-4 sm:py-6 md:py-8 flex-grow">
            <Skeleton className="h-10 sm:h-12 w-32 sm:w-48 mb-6 sm:mb-8" />
            <Skeleton className="h-8 sm:h-10 w-3/4 mb-2" />
            <Skeleton className="h-4 sm:h-6 w-1/2 mb-6 sm:mb-8" />
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="w-full lg:w-2/3 xl:w-3/5"><Skeleton className="h-80 sm:h-96 w-full" /></div>
              <div className="w-full lg:w-1/3 xl:w-2/5 space-y-4 sm:space-y-6"><Skeleton className="h-40 sm:h-48 w-full" /></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!dbCategory) {
    return <CategoryNotFound />;
  }

  // Determine button state based on user authentication and existing ranking
  const hasExistingRanking = Boolean(user && userRanking);
  
  console.log('CategoryPage - FloatingActionButton props being passed:', {
    hasExistingRanking,
    userRankingId: userRanking?.id,
    categoryId: categoryId, // Make sure we're passing the current categoryId
    isLoadingUserRanking
  });

  return (
    <>
      <Helmet>
        <title>{`${dbCategory.name} - GOAT Debate | Wodagoat`}</title>
        <meta name="description" content={dbCategory.description || `Join the GOAT debate for ${dbCategory.name}. Create rankings, view leaderboards, and share your opinion with a global community of sports fans.`} />
      </Helmet>
      <div className="flex flex-col flex-grow min-h-screen px-3 sm:px-4 md:px-8" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
        <div className="container mx-auto py-4 sm:py-6 md:py-8 flex-grow">
          <CategoryPageHeader 
            categoryName={dbCategory.name}
            categoryDescription={dbCategory.description}
          />

          <CategoryPageContent
            categoryId={categoryId}
            leaderboardAthletes={leaderboardAthletes || []}
            submittedRankingsCount={submittedRankingsCount || 0}
            categoryName={dbCategory.name}
          />

          <FloatingActionButton
            hasExistingRanking={hasExistingRanking}
            userRankingId={userRanking?.id}
            categoryId={categoryId} // Ensure we pass the current categoryId
            isLoadingUserRanking={isLoadingUserRanking}
          />
        </div>
      </div>
    </>
  );
};

export default CategoryPage;


import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
  
  // Check if user has existing ranking for this category
  const { data: userRanking, isLoading: isLoadingUserRanking } = useUserRankingForCategory(categoryId);
  
  // Fetch category data from Supabase
  const { data: dbCategory, isLoading: isLoadingCategory } = useQuery<DbCategory | null>({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId || "")
        .single();
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      return data;
    },
    enabled: !!categoryId,
  });

  // Fetch submitted rankings count for this category
  const { data: submittedRankingsCount, isLoading: isLoadingRankingsCount } = useQuery({
    queryKey: ['categoryRankingsCount', categoryId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('user_rankings')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId || "");
      
      if (error) {
        throw error;
      }
      
      return count || 0;
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
  });

  // Fetch real leaderboard data using the shared hook
  const { data: leaderboardAthletes, isLoading: isLoadingLeaderboard } = useLeaderboardData(categoryId || "");

  const isLoading = isLoadingCategory || isLoadingLeaderboard || isLoadingRankingsCount;

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
            categoryId={categoryId!}
            leaderboardAthletes={leaderboardAthletes || []}
            submittedRankingsCount={submittedRankingsCount || 0}
            categoryName={dbCategory.name}
          />

          <FloatingActionButton
            hasExistingRanking={hasExistingRanking}
            userRankingId={userRanking?.id}
            categoryId={categoryId!}
            isLoadingUserRanking={isLoadingUserRanking}
          />
        </div>
      </div>
    </>
  );
};

export default CategoryPage;

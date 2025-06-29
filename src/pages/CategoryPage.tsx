
import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet-async";
import CategoryPageContent from "@/components/category/CategoryPageContent";
import FloatingActionButton from "@/components/category/FloatingActionButton";
import CategoryNotFound from "@/components/category/CategoryNotFound";
import CategoryPageLoading from "@/components/category/CategoryPageLoading";
import CategoryPageErrorHandler from "@/components/category/CategoryPageErrorHandler";
import CategoryPageDataFetcher from "@/components/category/CategoryPageDataFetcher";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { user } = useAuth();
  
  console.log('🚀 CategoryPage - RENDER START:', {
    categoryId,
    userId: user?.id,
    currentUrl: window.location.href
  });
  
  // Ensure we have a valid categoryId before proceeding
  if (!categoryId) {
    console.error('❌ CategoryPage - No categoryId found in URL params');
    return <CategoryNotFound />;
  }

  return (
    <CategoryPageDataFetcher categoryId={categoryId}>
      {({ 
        dbCategory, 
        userRanking, 
        submittedRankingsCount, 
        leaderboardAthletes, 
        isLoading, 
        errors,
        refetch 
      }) => {
        const { categoryError, leaderboardError, userRankingError, rankingsCountError } = errors;

        console.log('🚀 CategoryPage - DATA FETCHER RESULT:', {
          hasDbCategory: !!dbCategory,
          categoryName: dbCategory?.name,
          hasUserRanking: !!userRanking,
          userRankingId: userRanking?.id,
          submittedRankingsCount,
          leaderboardAthletesCount: leaderboardAthletes?.length || 0,
          isLoading,
          hasErrors: !!(categoryError || leaderboardError || userRankingError || rankingsCountError)
        });

        if (isLoading) {
          console.log('🚀 CategoryPage - SHOWING LOADING STATE');
          return <CategoryPageLoading />;
        }

        // Handle errors
        const errorComponent = (
          <CategoryPageErrorHandler
            categoryError={categoryError}
            leaderboardError={leaderboardError}
            userRankingError={userRankingError}
            rankingsCountError={rankingsCountError}
            isLoading={isLoading}
            onRetry={refetch.refetchLeaderboard}
          />
        );

        if (errorComponent) {
          const errorResult = React.isValidElement(errorComponent) ? errorComponent : null;
          if (errorResult) {
            console.log('🚀 CategoryPage - SHOWING ERROR COMPONENT');
            return errorResult;
          }
        }

        if (!dbCategory) {
          console.log('🚀 CategoryPage - NO CATEGORY FOUND');
          return <CategoryNotFound />;
        }

        // Determine button state based on user authentication and existing ranking
        const hasExistingRanking = Boolean(user && userRanking);
        
        console.log('🚀 CategoryPage - FLOATING ACTION BUTTON PROPS:', {
          hasExistingRanking,
          userRankingId: userRanking?.id,
          categoryId: categoryId,
          isLoadingUserRanking: false,
          userAuthenticated: !!user
        });

        console.log('🚀 CategoryPage - RENDERING MAIN CONTENT');

        return (
          <>
            <Helmet>
              <title>{`${dbCategory.name} - GOAT Debate | Wodagoat`}</title>
              <meta name="description" content={dbCategory.description || `Join the GOAT debate for ${dbCategory.name}. Create rankings, view leaderboards, and share your opinion with a global community of sports fans.`} />
            </Helmet>
            <div className="flex flex-col flex-grow min-h-screen px-3 sm:px-4 md:px-8" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
              <div className="container mx-auto py-4 sm:py-6 md:py-8 flex-grow">
                <CategoryPageContent
                  categoryId={categoryId}
                  leaderboardAthletes={leaderboardAthletes}
                  submittedRankingsCount={submittedRankingsCount}
                  categoryName={dbCategory.name}
                  categoryDescription={dbCategory.description}
                />

                <FloatingActionButton
                  hasExistingRanking={hasExistingRanking}
                  userRankingId={userRanking?.id}
                  categoryId={categoryId}
                  isLoadingUserRanking={false}
                />
              </div>
            </div>
          </>
        );
      }}
    </CategoryPageDataFetcher>
  );
};

export default CategoryPage;

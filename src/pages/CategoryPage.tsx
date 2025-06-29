
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
          errorSummary: {
            categoryError: !!categoryError,
            leaderboardError: !!leaderboardError,
            userRankingError: !!userRankingError,
            rankingsCountError: !!rankingsCountError
          }
        });

        if (isLoading) {
          console.log('🚀 CategoryPage - SHOWING LOADING STATE');
          return <CategoryPageLoading />;
        }

        // Check for CRITICAL errors only - this should return null for non-critical errors
        const errorHandler = (
          <CategoryPageErrorHandler
            categoryError={categoryError}
            leaderboardError={leaderboardError}
            userRankingError={userRankingError}
            rankingsCountError={rankingsCountError}
            isLoading={isLoading}
            onRetry={refetch.refetchLeaderboard}
          />
        );

        // Only block the page if there's an actual error component returned
        if (errorHandler !== null && React.isValidElement(errorHandler)) {
          console.log('🚀 CategoryPage - SHOWING CRITICAL ERROR');
          return errorHandler;
        }

        // If no category data, show not found
        if (!dbCategory) {
          console.log('🚀 CategoryPage - NO CATEGORY DATA');
          return <CategoryNotFound />;
        }

        // We have valid category data - render the page
        const hasExistingRanking = Boolean(user && userRanking);
        
        console.log('🚀 CategoryPage - RENDERING MAIN CONTENT:', {
          categoryName: dbCategory.name,
          hasExistingRanking,
          userRankingId: userRanking?.id,
          submittedRankingsCount,
          leaderboardCount: leaderboardAthletes?.length || 0
        });

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

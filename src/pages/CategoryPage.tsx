
import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet-async";
import CategoryPageContent from "@/components/category/CategoryPageContent";
import FloatingActionButton from "@/components/category/FloatingActionButton";
import CategoryNotFound from "@/components/category/CategoryNotFound";
import CategoryPageLoading from "@/components/category/CategoryPageLoading";
import CategoryNetworkError from "@/components/category/CategoryNetworkError";
import CategoryPageDataFetcher from "@/components/category/CategoryPageDataFetcher";
import ComingSoonPage from "./ComingSoonPage";

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

  // Helper function to check if an error is critical
  const isCriticalError = (error: any) => {
    if (!error) return false;
    
    const errorMessage = error?.message || '';
    const criticalPatterns = [
      'JWT expired',
      'Unauthorized', 
      'Authentication failed',
      'Invalid category',
      'Category not found',
      'Database connection failed'
    ];
    
    return criticalPatterns.some(pattern => 
      errorMessage.toLowerCase().includes(pattern.toLowerCase())
    );
  };

  // Helper function to check for persistent network errors
  const isPersistentNetworkError = (error: any) => {
    if (!error) return false;
    
    const errorMessage = error?.message || '';
    return (errorMessage.includes('Failed to fetch') || 
           errorMessage.includes('NetworkError') ||
           error?.code === 'NETWORK_ERROR') &&
           !errorMessage.includes('ad blocker') &&
           !errorMessage.includes('extension');
  };

  // Helper function to check if category is a competition category
  const isCompetitionCategory = (categoryName: string, parentCategoryName?: string) => {
    const competitionKeywords = [
      'premier league',
      'laliga', 
      'la liga',
      'serie a',
      'bundesliga',
      'ligue 1',
      'champions league',
      'world cup',
      'euro',
      'copa america',
      'competition',
      'tournament',
      'league',
      'championship'
    ];
    
    const nameToCheck = (categoryName || '').toLowerCase();
    const parentToCheck = (parentCategoryName || '').toLowerCase();
    
    return competitionKeywords.some(keyword => 
      nameToCheck.includes(keyword) || parentToCheck.includes(keyword)
    ) || parentToCheck.includes('competition');
  };

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

        // Check for CRITICAL category errors that should block the page
        if (categoryError && isCriticalError(categoryError)) {
          console.log('🚨 CRITICAL: Category error detected:', categoryError);
          return <CategoryNotFound />;
        }

        // Check for persistent network errors that affect category loading
        if (categoryError && isPersistentNetworkError(categoryError)) {
          console.log('🌐 PERSISTENT NETWORK ERROR:', categoryError);
          return <CategoryNetworkError onRetry={refetch.refetchLeaderboard} />;
        }

        // Log other errors but don't block the UI - they're not critical
        if (leaderboardError || userRankingError || rankingsCountError) {
          console.log('⚠️ NON-CRITICAL ERRORS (not blocking UI):', {
            leaderboardError: leaderboardError?.message,
            userRankingError: userRankingError?.message,
            rankingsCountError: rankingsCountError?.message
          });
        }

        // If no category data, show not found
        if (!dbCategory) {
          console.log('🚀 CategoryPage - NO CATEGORY DATA');
          return <CategoryNotFound />;
        }

        // Check if this is a competition category and show coming soon page
        if (isCompetitionCategory(dbCategory.name)) {
          console.log('🚀 CategoryPage - SHOWING COMING SOON for competition category:', dbCategory.name);
          return <ComingSoonPage categoryName={dbCategory.name} />;
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


import { useParams } from "react-router-dom";
import CategoryPageDataFetcher from "@/components/category/CategoryPageDataFetcher";
import CategoryPageContent from "@/components/category/CategoryPageContent";
import CategoryPageLoading from "@/components/category/CategoryPageLoading";
import CategoryPageErrorHandler from "@/components/category/CategoryPageErrorHandler";
import CategoryNetworkError from "@/components/category/CategoryNetworkError";
import CategoryNotFound from "@/components/category/CategoryNotFound";
import FloatingActionButton from "@/components/category/FloatingActionButton";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  if (!categoryId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Category ID not found</p>
      </div>
    );
  }

  return (
    <CategoryPageDataFetcher categoryId={categoryId}>
      {({ 
        dbCategory, 
        userRankingStatus,
        userRanking,
        submittedRankingsCount, 
        leaderboardAthletes, 
        isLoading, 
        errors, 
        refetch 
      }) => {
        // Always render FloatingActionButton to prevent layout shifts
        const floatingButton = (
          <FloatingActionButton
            userRankingStatus={userRankingStatus}
            userRankingId={userRanking?.id}
            categoryId={categoryId}
            isLoadingUserRanking={isLoading}
            isFetchingUserRanking={false}
          />
        );

        // Show loading state
        if (isLoading) {
          return (
            <>
              <CategoryPageLoading />
              {floatingButton}
            </>
          );
        }

        // Handle critical errors (category not found or network issues)
        if (errors.categoryError) {
          const errorMessage = errors.categoryError?.message || '';
          if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
            return (
              <>
                <CategoryNetworkError onRetry={refetch.refetchCategory} />
                {floatingButton}
              </>
            );
          }
          return (
            <>
              <CategoryNotFound />
              {floatingButton}
            </>
          );
        }

        // Handle leaderboard errors
        if (errors.leaderboardError) {
          const errorMessage = errors.leaderboardError?.message || '';
          if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
            return (
              <>
                <CategoryNetworkError onRetry={refetch.refetchLeaderboard} />
                {floatingButton}
              </>
            );
          }
        }

        // Show content if we have category data
        if (dbCategory) {
          return (
            <>
              <CategoryPageContent
                categoryId={categoryId}
                leaderboardAthletes={leaderboardAthletes}
                submittedRankingsCount={submittedRankingsCount}
                categoryName={dbCategory.name}
                categoryDescription={dbCategory.description}
              />
              {floatingButton}
              <CategoryPageErrorHandler
                categoryError={errors.categoryError}
                leaderboardError={errors.leaderboardError}
                userRankingError={errors.userRankingError}
                rankingsCountError={errors.rankingsCountError}
                isLoading={isLoading}
                onRetry={refetch.refetchLeaderboard}
              />
            </>
          );
        }

        // Fallback for unknown state
        return (
          <>
            <CategoryNotFound />
            {floatingButton}
          </>
        );
      }}
    </CategoryPageDataFetcher>
  );
};

export default CategoryPage;

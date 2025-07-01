
import { useParams } from "react-router-dom";
import { useMemo } from "react";
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
    <div key={categoryId} className="flex flex-col w-full min-h-screen px-4 pb-4 lg:pb-20">
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
          // Memoize FAB props to prevent unnecessary re-renders
          const fabProps = useMemo(() => ({
            userRankingStatus,
            userRankingId: userRanking?.id,
            categoryId,
            isLoading
          }), [userRankingStatus, userRanking?.id, categoryId, isLoading]);

          // Show loading state
          if (isLoading) {
            return <CategoryPageLoading />;
          }

          // Handle critical errors (category not found or network issues)
          if (errors.categoryError) {
            const errorMessage = errors.categoryError?.message || '';
            if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
              return <CategoryNetworkError onRetry={refetch.refetchCategory} />;
            }
            return <CategoryNotFound />;
          }

          // Handle leaderboard errors
          if (errors.leaderboardError) {
            const errorMessage = errors.leaderboardError?.message || '';
            if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
              return <CategoryNetworkError onRetry={refetch.refetchLeaderboard} />;
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
                <CategoryPageErrorHandler
                  categoryError={errors.categoryError}
                  leaderboardError={errors.leaderboardError}
                  userRankingError={errors.userRankingError}
                  rankingsCountError={errors.rankingsCountError}
                  isLoading={isLoading}
                  onRetry={refetch.refetchLeaderboard}
                />
                {/* Render FAB once at page level */}
                <FloatingActionButton {...fabProps} />
              </>
            );
          }

          // Fallback for unknown state
          return <CategoryNotFound />;
        }}
      </CategoryPageDataFetcher>
    </div>
  );
};

export default CategoryPage;

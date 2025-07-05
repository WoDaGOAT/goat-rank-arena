
import { useParams } from "react-router-dom";
import CategoryPageDataFetcher from "@/components/category/CategoryPageDataFetcher";
import CategoryPageContent from "@/components/category/CategoryPageContent";
import CategoryPageLoading from "@/components/category/CategoryPageLoading";
import CategoryPageErrorHandler from "@/components/category/CategoryPageErrorHandler";
import CategoryNetworkError from "@/components/category/CategoryNetworkError";
import CategoryNotFound from "@/components/category/CategoryNotFound";

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
    <div key={`category-${categoryId}`}>
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
              <div
                className="flex flex-col flex-grow min-h-screen"
                style={{ background: "linear-gradient(135deg, rgba(25, 7, 73, 0.6) 0%, rgba(7, 2, 21, 0.6) 100%)" }}
              >
                <div className="container mx-auto px-4 py-8 flex-grow">
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
                </div>
              </div>
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

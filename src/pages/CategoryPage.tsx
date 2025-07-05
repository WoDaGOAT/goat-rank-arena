
import { useParams } from "react-router-dom";
import CategoryPageDataFetcher from "@/components/category/CategoryPageDataFetcher";
import CategoryPageLoading from "@/components/category/CategoryPageLoading";
import CategoryPageErrorHandler from "@/components/category/CategoryPageErrorHandler";
import CategoryNetworkError from "@/components/category/CategoryNetworkError";
import CategoryNotFound from "@/components/category/CategoryNotFound";
import UnifiedLeaderboardLayout from "@/components/leaderboard/UnifiedLeaderboardLayout";
import { SocialActions } from "@/components/category/SocialActions";

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
              <>
                <UnifiedLeaderboardLayout
                  categoryId={categoryId}
                  categoryName={dbCategory.name}
                  categoryDescription={dbCategory.description}
                  athletes={leaderboardAthletes}
                  submittedRankingsCount={submittedRankingsCount}
                  socialActions={<SocialActions categoryId={categoryId} />}
                  compact={false}
                  showComments={true}
                  userRankingStatus={userRankingStatus}
                  userRankingId={userRanking?.id}
                />
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
          return <CategoryNotFound />;
        }}
      </CategoryPageDataFetcher>
    </div>
  );
};

export default CategoryPage;

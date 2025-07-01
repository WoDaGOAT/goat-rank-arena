
import { useParams } from "react-router-dom";
import CategoryPageDataFetcher from "@/components/category/CategoryPageDataFetcher";
import CategoryPageContent from "@/components/category/CategoryPageContent";
import CategoryPageLoading from "@/components/category/CategoryPageLoading";
import CategoryPageErrorHandler from "@/components/category/CategoryPageErrorHandler";
import FloatingActionButton from "@/components/category/FloatingActionButton";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  if (!categoryId) {
    return <CategoryPageErrorHandler error="Category ID not found" />;
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
        // Show loading state
        if (isLoading) {
          return <CategoryPageLoading />;
        }

        // Handle errors
        if (errors.categoryError || errors.leaderboardError) {
          return (
            <CategoryPageErrorHandler 
              error={errors.categoryError || errors.leaderboardError} 
              onRetry={refetch.refetchLeaderboard}
            />
          );
        }

        // Show content
        return (
          <>
            <CategoryPageContent
              category={dbCategory}
              submittedRankingsCount={submittedRankingsCount}
              leaderboardAthletes={leaderboardAthletes}
            />
            <FloatingActionButton
              userRankingStatus={userRankingStatus}
              userRankingId={userRanking?.id}
              categoryId={categoryId}
              isLoadingUserRanking={isLoading}
              isFetchingUserRanking={false}
            />
          </>
        );
      }}
    </CategoryPageDataFetcher>
  );
};

export default CategoryPage;

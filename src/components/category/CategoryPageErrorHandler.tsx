
import React from "react";
import CategoryNetworkError from "./CategoryNetworkError";
import CategoryNotFound from "./CategoryNotFound";

interface CategoryPageErrorHandlerProps {
  categoryError: any;
  leaderboardError: any;
  userRankingError: any;
  rankingsCountError: any;
  isLoading: boolean;
  onRetry: () => void;
}

const CategoryPageErrorHandler = ({
  categoryError,
  leaderboardError,
  userRankingError,
  rankingsCountError,
  isLoading,
  onRetry
}: CategoryPageErrorHandlerProps) => {
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
    return <CategoryNetworkError onRetry={onRetry} />;
  }

  // Handle other errors
  if ((categoryError || leaderboardError) && !isNetworkError) {
    console.error('Category page error:', { categoryError, leaderboardError });
    return <CategoryNotFound />;
  }

  return null;
};

export default CategoryPageErrorHandler;

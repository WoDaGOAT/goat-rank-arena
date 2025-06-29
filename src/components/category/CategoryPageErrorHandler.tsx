
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

// This component is now simplified and mainly used for legacy support
// The main error handling logic has been moved to CategoryPage.tsx
const CategoryPageErrorHandler = ({
  categoryError,
  leaderboardError,
  userRankingError,
  rankingsCountError,
  isLoading,
  onRetry
}: CategoryPageErrorHandlerProps) => {
  // This component is now primarily for logging - actual error handling is in CategoryPage
  if (leaderboardError || userRankingError || rankingsCountError) {
    console.log('⚠️ NON-CRITICAL ERRORS (logged by CategoryPageErrorHandler):', {
      leaderboardError: leaderboardError?.message,
      userRankingError: userRankingError?.message,
      rankingsCountError: rankingsCountError?.message
    });
  }

  // Always return null - error handling is now done in CategoryPage
  return null;
};

export default CategoryPageErrorHandler;

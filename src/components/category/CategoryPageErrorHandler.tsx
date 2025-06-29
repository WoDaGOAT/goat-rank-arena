
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
  // ENHANCED error detection for various network issues
  const hasNetworkError = (error: any) => {
    const errorMessage = error?.message || '';
    return errorMessage.includes('Failed to fetch') || 
           errorMessage.includes('NetworkError') || 
           errorMessage.includes('TypeError: Failed to fetch') ||
           errorMessage.includes('ERR_CONNECTION_CLOSED') ||
           errorMessage.includes('ERR_BLOCKED_BY_CLIENT') ||
           errorMessage.includes('ERR_NETWORK_CHANGED') ||
           errorMessage.includes('net::') ||
           error?.code === 'NETWORK_ERROR';
  };

  const isNetworkError = hasNetworkError(categoryError) || 
                        hasNetworkError(leaderboardError) || 
                        hasNetworkError(userRankingError) ||
                        hasNetworkError(rankingsCountError);

  // IMPROVED network error logging
  if (isNetworkError) {
    console.log('🌐 NETWORK ERROR DETECTED:', {
      categoryError: categoryError?.message,
      leaderboardError: leaderboardError?.message,
      userRankingError: userRankingError?.message,
      rankingsCountError: rankingsCountError?.message,
      isLoading
    });
  }

  // Handle network errors with retry functionality
  if (isNetworkError && !isLoading) {
    return <CategoryNetworkError onRetry={onRetry} />;
  }

  // Handle other errors more gracefully
  if ((categoryError || leaderboardError) && !isNetworkError) {
    console.error('🚨 Category page error (non-network):', { categoryError, leaderboardError });
    
    // Don't immediately show "not found" for temporary errors
    if (categoryError?.message?.includes('temporary') || leaderboardError?.message?.includes('temporary')) {
      return <CategoryNetworkError onRetry={onRetry} />;
    }
    
    return <CategoryNotFound />;
  }

  return null;
};

export default CategoryPageErrorHandler;

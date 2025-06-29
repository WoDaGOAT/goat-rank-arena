
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
  // Only show critical errors that actually prevent the page from functioning
  const isCriticalError = (error: any) => {
    if (!error) return false;
    
    const errorMessage = error?.message || '';
    
    // Only these are truly critical - category must exist for page to work
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

  // Network errors that are persistent and affect category loading
  const isPersistentNetworkError = (error: any) => {
    if (!error) return false;
    
    const errorMessage = error?.message || '';
    return (errorMessage.includes('Failed to fetch') || 
           errorMessage.includes('NetworkError') ||
           error?.code === 'NETWORK_ERROR') &&
           !errorMessage.includes('ad blocker') &&
           !errorMessage.includes('extension');
  };

  // ONLY show error for category-related critical failures
  if (categoryError && isCriticalError(categoryError) && !isLoading) {
    console.log('🚨 CRITICAL: Category error detected:', categoryError);
    return <CategoryNotFound />;
  }

  // ONLY show network error for category-related persistent network issues
  if (categoryError && isPersistentNetworkError(categoryError) && !isLoading) {
    console.log('🌐 PERSISTENT NETWORK ERROR:', categoryError);
    return <CategoryNetworkError onRetry={onRetry} />;
  }

  // Log other errors but don't block the UI - they're not critical
  if (leaderboardError || userRankingError || rankingsCountError) {
    console.log('⚠️ NON-CRITICAL ERRORS (not blocking UI):', {
      leaderboardError: leaderboardError?.message,
      userRankingError: userRankingError?.message,
      rankingsCountError: rankingsCountError?.message
    });
  }

  // Return null - no critical errors found, let main content render
  return null;
};

export default CategoryPageErrorHandler;

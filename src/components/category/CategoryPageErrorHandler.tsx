
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
  // CRITICAL ERROR detection - only errors that prevent the page from functioning
  const isCriticalError = (error: any) => {
    if (!error) return false;
    
    const errorMessage = error?.message || '';
    
    // These are CRITICAL errors that prevent the page from working
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

  // NETWORK ERROR detection - but only show if it's a persistent issue
  const isPersistentNetworkError = (error: any) => {
    if (!error) return false;
    
    const errorMessage = error?.message || '';
    return errorMessage.includes('Failed to fetch') || 
           errorMessage.includes('NetworkError') ||
           error?.code === 'NETWORK_ERROR';
  };

  // Check for critical errors first
  const hasCriticalCategoryError = isCriticalError(categoryError);
  const hasCriticalLeaderboardError = isCriticalError(leaderboardError);
  
  // Only show "not found" for actual category errors, not leaderboard issues
  if (hasCriticalCategoryError && !isLoading) {
    console.log('🚨 CRITICAL: Category error detected:', categoryError);
    return <CategoryNotFound />;
  }

  // Check for persistent network errors (only category-related)
  const hasPersistentNetworkError = isPersistentNetworkError(categoryError);
  
  if (hasPersistentNetworkError && !isLoading) {
    console.log('🌐 PERSISTENT NETWORK ERROR:', categoryError);
    return <CategoryNetworkError onRetry={onRetry} />;
  }

  // Log non-critical errors but don't block the UI
  if (leaderboardError || userRankingError || rankingsCountError) {
    console.log('⚠️ NON-CRITICAL ERRORS (not blocking UI):', {
      leaderboardError: leaderboardError?.message,
      userRankingError: userRankingError?.message,
      rankingsCountError: rankingsCountError?.message
    });
  }

  // Return null - let the main content render
  return null;
};

export default CategoryPageErrorHandler;

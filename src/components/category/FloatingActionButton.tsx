
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";

interface FloatingActionButtonProps {
  hasExistingRanking: boolean;
  userRankingId?: string;
  categoryId: string;
  isLoadingUserRanking: boolean;
}

const FloatingActionButton = ({ 
  hasExistingRanking, 
  userRankingId, 
  categoryId, 
  isLoadingUserRanking 
}: FloatingActionButtonProps) => {
  const navigate = useNavigate();
  
  console.log('🔍 FloatingActionButton - Props received:', {
    hasExistingRanking,
    userRankingId,
    categoryId,
    isLoadingUserRanking
  });

  const buttonText = hasExistingRanking ? "View My Ranking" : "Create Ranking";
  const buttonIcon = hasExistingRanking ? Eye : Plus;
  const buttonLink = hasExistingRanking ? `/ranking/${userRankingId}` : `/create-ranking/${categoryId}`;
  const buttonTitle = hasExistingRanking ? "View Your Ranking" : "Create Your Ranking";

  console.log('🔍 FloatingActionButton - Generated link:', buttonLink);
  console.log('🔍 FloatingActionButton - Current URL:', window.location.href);

  const handleClick = (e: React.MouseEvent) => {
    console.log('🔍 FloatingActionButton - Button clicked!');
    console.log('🔍 FloatingActionButton - Navigation details:', {
      hasExistingRanking,
      userRankingId,
      targetUrl: buttonLink,
      currentUrl: window.location.href
    });
    
    if (hasExistingRanking && userRankingId) {
      e.preventDefault();
      console.log('🔍 FloatingActionButton - Using programmatic navigation to ranking:', userRankingId);
      
      // Add error handling for navigation
      try {
        navigate(`/ranking/${userRankingId}`, { replace: true });
        console.log('🔍 FloatingActionButton - Navigation initiated successfully');
      } catch (error) {
        console.error('🔍 FloatingActionButton - Navigation failed:', error);
        // Fallback to window.location if navigate fails
        window.location.href = `/ranking/${userRankingId}`;
      }
    } else if (!hasExistingRanking) {
      e.preventDefault();
      console.log('🔍 FloatingActionButton - Navigating to create ranking for category:', categoryId);
      
      try {
        navigate(`/create-ranking/${categoryId}`);
        console.log('🔍 FloatingActionButton - Create ranking navigation initiated successfully');
      } catch (error) {
        console.error('🔍 FloatingActionButton - Create ranking navigation failed:', error);
        // Fallback to window.location if navigate fails
        window.location.href = `/create-ranking/${categoryId}`;
      }
    }
  };

  // Show loading state while checking for existing ranking
  if (isLoadingUserRanking) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50">
        <Button 
          variant="cta" 
          className="rounded-full shadow-2xl w-14 h-14 sm:w-16 sm:h-16 p-0 flex items-center justify-center md:w-auto md:px-6 md:py-3 md:h-12 opacity-50 cursor-not-allowed"
          disabled
        >
          <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50">
      <Button 
        variant="cta" 
        className="rounded-full shadow-2xl hover:scale-105 transition-transform w-14 h-14 sm:w-16 sm:h-16 p-0 flex items-center justify-center md:w-auto md:px-6 md:py-3 md:h-12"
        onClick={handleClick}
        title={buttonTitle}
      >
        {React.createElement(buttonIcon, { 
          className: "h-6 w-6 sm:h-7 sm:w-7 md:h-6 md:w-6 md:mr-2 shrink-0" 
        })}
        <span className="hidden md:inline font-semibold">{buttonText}</span>
      </Button>
    </div>
  );
};

export default FloatingActionButton;

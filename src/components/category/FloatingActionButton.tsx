
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
  
  console.log('🔍 FloatingActionButton - Props:', {
    hasExistingRanking,
    userRankingId,
    categoryId,
    isLoadingUserRanking,
    currentUrl: window.location.href
  });

  // Show loading state if still fetching data
  if (isLoadingUserRanking) {
    console.log('🔍 FloatingActionButton - Showing loading state');
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-[9999]">
        <Button 
          variant="cta" 
          className="rounded-full shadow-2xl w-14 h-14 sm:w-16 sm:h-16 p-0 flex items-center justify-center md:w-auto md:px-6 md:py-3 md:h-12 opacity-75"
          disabled
        >
          <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
        </Button>
      </div>
    );
  }

  // Defensive validation: only consider it valid if we have both hasExistingRanking AND a valid userRankingId
  const hasValidRanking = hasExistingRanking && userRankingId && userRankingId.trim() !== '';
  
  // If no valid ranking, always show "Create Ranking"
  const buttonText = hasValidRanking ? "View My Ranking" : "Create Ranking";
  const buttonIcon = hasValidRanking ? Eye : Plus;
  const buttonTitle = hasValidRanking ? "View Your Ranking" : "Create Your Ranking";

  console.log('🔍 FloatingActionButton - Button decision:', {
    hasExistingRanking,
    userRankingId,
    hasValidRanking,
    buttonText,
    buttonIcon: buttonIcon.name
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('🔍 FloatingActionButton - Button clicked:', {
      hasExistingRanking,
      hasValidRanking,
      userRankingId,
      categoryId,
    });
    
    if (hasValidRanking && userRankingId) {
      console.log('🔍 FloatingActionButton - Navigating to existing ranking:', userRankingId);
      navigate(`/ranking/${userRankingId}`, { replace: true });
    } else {
      console.log('🔍 FloatingActionButton - Navigating to create ranking for category:', categoryId);
      navigate(`/create-ranking/${categoryId}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-[9999]">
      <Button 
        variant="cta" 
        className="rounded-full shadow-2xl hover:scale-105 transition-transform w-14 h-14 sm:w-16 sm:h-16 p-0 flex items-center justify-center md:w-auto md:px-6 md:py-3 md:h-12 bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white hover:opacity-90 border-0 font-semibold"
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


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
  console.log('🔍 FloatingActionButton - Using categoryId for create ranking:', categoryId);

  const handleClick = (e: React.MouseEvent) => {
    console.log('🔍 FloatingActionButton - Button clicked!');
    console.log('🔍 FloatingActionButton - Navigating to:', buttonLink);
    console.log('🔍 FloatingActionButton - Current location:', window.location.href);
    
    if (hasExistingRanking && userRankingId) {
      e.preventDefault();
      console.log('🔍 FloatingActionButton - Using programmatic navigation to ranking:', userRankingId);
      navigate(`/ranking/${userRankingId}`, { replace: true });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50">
      <Button 
        asChild={!hasExistingRanking} 
        variant="cta" 
        className="rounded-full shadow-2xl hover:scale-105 transition-transform w-14 h-14 sm:w-16 sm:h-16 p-0 flex items-center justify-center md:w-auto md:px-6 md:py-3 md:h-12"
        disabled={isLoadingUserRanking}
        onClick={hasExistingRanking ? handleClick : undefined}
      >
        {hasExistingRanking ? (
          <>
            {React.createElement(buttonIcon, { 
              className: "h-6 w-6 sm:h-7 sm:w-7 md:h-6 md:w-6 md:mr-2 shrink-0" 
            })}
            <span className="hidden md:inline font-semibold">{buttonText}</span>
          </>
        ) : (
          <Link to={buttonLink} title={buttonTitle}>
            {React.createElement(buttonIcon, { 
              className: "h-6 w-6 sm:h-7 sm:w-7 md:h-6 md:w-6 md:mr-2 shrink-0" 
            })}
            <span className="hidden md:inline font-semibold">{buttonText}</span>
          </Link>
        )}
      </Button>
    </div>
  );
};

export default FloatingActionButton;

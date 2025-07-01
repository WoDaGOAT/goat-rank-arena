
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";

interface FloatingActionButtonProps {
  userRankingStatus: 'empty' | 'incomplete' | 'complete';
  userRankingId?: string;
  categoryId: string;
  isLoading: boolean;
}

const FloatingActionButton = ({ 
  userRankingStatus,
  userRankingId, 
  categoryId, 
  isLoading
}: FloatingActionButtonProps) => {
  const navigate = useNavigate();
  
  console.log('🔍 FloatingActionButton - Props:', {
    userRankingStatus,
    userRankingId,
    categoryId,
    isLoading
  });

  // Determine button content based on ranking status
  const getButtonContent = () => {
    if (userRankingStatus === 'complete' && userRankingId) {
      return {
        text: "View My Ranking",
        icon: Eye,
        action: () => navigate(`/ranking/${userRankingId}`, { replace: true }),
        title: "View Your Ranking"
      };
    }
    
    return {
      text: "Create Ranking",
      icon: Plus,
      action: () => navigate(`/create-ranking/${categoryId}`),
      title: userRankingStatus === 'incomplete' ? "Continue Your Ranking" : "Create Your Ranking"
    };
  };

  const buttonContent = getButtonContent();
  const ButtonIcon = buttonContent.icon;

  // Show button for empty, incomplete, or complete rankings
  const shouldShow = userRankingStatus === 'empty' || userRankingStatus === 'incomplete' || userRankingStatus === 'complete';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('🔍 FloatingActionButton - Button clicked:', {
      userRankingStatus,
      userRankingId,
      categoryId,
      action: buttonContent.text
    });
    
    buttonContent.action();
  };

  return (
    <div 
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-[9999] transition-opacity duration-300 ease-in-out"
      style={{
        opacity: shouldShow && !isLoading ? 1 : 0,
        visibility: shouldShow && !isLoading ? 'visible' : 'hidden',
        pointerEvents: shouldShow && !isLoading ? 'auto' : 'none'
      }}
    >
      <Button 
        variant="cta" 
        className="rounded-full shadow-2xl hover:scale-105 transition-transform w-14 h-14 sm:w-16 sm:h-16 p-0 flex items-center justify-center md:w-auto md:px-6 md:py-3 md:h-12 bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white hover:opacity-90 border-0 font-semibold"
        onClick={handleClick}
        title={buttonContent.title}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <>
            {React.createElement(ButtonIcon, { 
              className: "h-6 w-6 sm:h-7 sm:w-7 md:h-6 md:w-6 md:mr-2 shrink-0" 
            })}
            <span className="hidden md:inline font-semibold">{buttonContent.text}</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default FloatingActionButton;

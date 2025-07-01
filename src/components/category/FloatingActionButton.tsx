
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";

interface FloatingActionButtonProps {
  userRankingStatus: 'empty' | 'incomplete' | 'complete';
  userRankingId?: string;
  categoryId: string;
  isLoading: boolean;
}

// Runtime media query hook
const useIsLargeScreen = () => {
  const [isLarge, setIsLarge] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateMatch = () => setIsLarge(mediaQuery.matches);
    updateMatch();

    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, []);

  return isLarge;
};

const FloatingActionButton = ({
  userRankingStatus,
  userRankingId,
  categoryId,
  isLoading
}: FloatingActionButtonProps) => {
  const navigate = useNavigate();
  const isLargeScreen = useIsLargeScreen();

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
  const shouldShow = ['empty', 'incomplete', 'complete'].includes(userRankingStatus);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    buttonContent.action();
  };

  if (!shouldShow) return null;

  return isLargeScreen ? (
    <div
      className="fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out"
      style={{
        opacity: !isLoading ? 1 : 0,
        visibility: !isLoading ? "visible" : "hidden",
        pointerEvents: !isLoading ? "auto" : "none"
      }}
    >
      <Button
        variant="cta"
        className="rounded-full shadow-2xl hover:scale-105 transition-transform w-14 h-14 p-0 flex items-center justify-center bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white hover:opacity-90 border-0 font-semibold"
        onClick={handleClick}
        title={buttonContent.title}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <ButtonIcon className="h-6 w-6 shrink-0" />
        )}
      </Button>
    </div>
  ) : (
    <div
      className="fixed bottom-4 left-4 right-4 z-50 transition-all duration-300 ease-in-out"
      style={{
        opacity: !isLoading ? 1 : 0,
        visibility: !isLoading ? "visible" : "hidden",
        pointerEvents: !isLoading ? "auto" : "none"
      }}
    >
      <Button
        variant="cta"
        className="w-full rounded-lg shadow-lg bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white hover:opacity-90 border-0 font-semibold py-4"
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
        ) : (
          <ButtonIcon className="h-5 w-5 mr-2 shrink-0" />
        )}
        <span className="font-semibold">{buttonContent.text}</span>
      </Button>
    </div>
  );
};

export default FloatingActionButton;

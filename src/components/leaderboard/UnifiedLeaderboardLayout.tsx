
import React from "react";
import GlobalLeaderboard from "@/components/GlobalLeaderboard";
import CommentSection from "@/components/category/CommentSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Eye } from "lucide-react";
import { Athlete } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRankingForCategory } from "@/hooks/useUserRankingForCategory";

interface UnifiedLeaderboardLayoutProps {
  categoryId: string;
  categoryName: string;
  categoryDescription?: string | null;
  athletes: Athlete[];
  submittedRankingsCount: number;
  socialActions?: React.ReactNode;
  compact?: boolean;
  showComments?: boolean;
  userRankingStatus?: 'empty' | 'incomplete' | 'complete';
  userRankingId?: string;
}

const UnifiedLeaderboardLayout = ({
  categoryId,
  categoryName,
  categoryDescription,
  athletes,
  submittedRankingsCount,
  socialActions,
  compact = false,
  showComments = true,
  userRankingStatus: propUserRankingStatus,
  userRankingId: propUserRankingId
}: UnifiedLeaderboardLayoutProps) => {
  const { user } = useAuth();
  const { status: hookUserRankingStatus, ranking: hookUserRanking, isLoading: isLoadingUserRanking } = useUserRankingForCategory(categoryId);

  // Use props if provided, otherwise fall back to hook data
  const userRankingStatus = propUserRankingStatus || hookUserRankingStatus;
  const userRanking = propUserRankingId ? { id: propUserRankingId } : hookUserRanking;

  // Determine button content based on auth status and existing ranking
  const getButtonContent = () => {
    if (!user) {
      return {
        text: "Create Your Ranking",
        icon: Plus,
        href: `/create-ranking/${categoryId}`
      };
    }
    
    if (isLoadingUserRanking && !propUserRankingStatus) {
      return {
        text: "Loading...",
        icon: Plus,
        href: `/create-ranking/${categoryId}`
      };
    }
    
    if (userRankingStatus === 'complete' && userRanking?.id) {
      return {
        text: "View My Ranking",
        icon: Eye,
        href: `/ranking/${userRanking.id}`
      };
    }
    
    return {
      text: userRankingStatus === 'incomplete' ? "Continue Your Ranking" : "Create Your Ranking",
      icon: Plus,
      href: `/create-ranking/${categoryId}`
    };
  };

  const buttonContent = getButtonContent();
  const ButtonIcon = buttonContent.icon;

  return (
    <div
      className="flex flex-col flex-grow min-h-screen"
      style={{ background: "linear-gradient(135deg, rgba(25, 7, 73, 0.6) 0%, rgba(7, 2, 21, 0.6) 100%)" }}
    >
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="w-full space-y-6 sm:space-y-8">
          {/* Leaderboard */}
          <div className="relative">
            <GlobalLeaderboard
              athletes={athletes}
              categoryName={categoryName}
              customTitle={compact ? categoryName : categoryName}
              customSubtitle={categoryDescription || (compact ? "" : `Greatest ${categoryName.toLowerCase().replace('goat ', '')} of all time`)}
              submittedRankingsCount={submittedRankingsCount}
              compact={compact}
              categoryId={categoryId}
              socialActions={socialActions}
            />
          </div>
          
          {/* Responsive Fixed Button */}
          <div className="flex justify-center px-4 sm:px-0">
            <Button 
              asChild 
              variant="cta" 
              size="lg" 
              className="
                w-full sm:w-auto sm:mx-auto md:w-fit
                py-4 px-6 sm:py-3 sm:px-8 md:py-3 md:px-6
                text-base sm:text-lg
                rounded-full
                bg-gradient-to-r from-fuchsia-500 to-cyan-500 
                hover:opacity-90 
                transition-all duration-200 
                shadow-lg hover:shadow-xl
              "
              disabled={isLoadingUserRanking && !propUserRankingStatus}
            >
              <Link to={buttonContent.href}>
                <ButtonIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                <span className="font-semibold">{buttonContent.text}</span>
              </Link>
            </Button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-6 sm:mt-8">
              <CommentSection categoryId={categoryId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedLeaderboardLayout;

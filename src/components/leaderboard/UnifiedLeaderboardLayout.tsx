
import React from "react";
import GlobalLeaderboard from "@/components/GlobalLeaderboard";
import CommentSection from "@/components/category/CommentSection";
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
  return (
    <div
      className="flex flex-col flex-grow min-h-screen"
      style={{ background: "linear-gradient(135deg, rgba(25, 7, 73, 0.6) 0%, rgba(7, 2, 21, 0.6) 100%)" }}
    >
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="w-full space-y-6 sm:space-y-8">
          {/* Leaderboard */}
          <div className="relative max-w-4xl mx-auto">
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
          
          {/* Comments Section */}
          {showComments && (
            <CommentSection categoryId={categoryId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedLeaderboardLayout;

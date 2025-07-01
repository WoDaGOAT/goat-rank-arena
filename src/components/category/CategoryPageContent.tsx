
import React from "react";
import GlobalLeaderboard from "@/components/GlobalLeaderboard";
import CommentSection from "@/components/category/CommentSection";
import { SocialActions } from "@/components/category/SocialActions";
import { Athlete } from "@/types";

interface CategoryPageContentProps {
  categoryId: string;
  leaderboardAthletes: Athlete[];
  submittedRankingsCount: number;
  categoryName: string;
  categoryDescription?: string | null;
}

const CategoryPageContent = ({ 
  categoryId, 
  leaderboardAthletes, 
  submittedRankingsCount, 
  categoryName,
  categoryDescription
}: CategoryPageContentProps) => {
  const socialActions = (
    <SocialActions 
      categoryId={categoryId} 
    />
  );

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <GlobalLeaderboard 
            athletes={leaderboardAthletes} 
            categoryName={categoryName}
            customTitle={categoryName}
            customSubtitle={categoryDescription || `Greatest ${categoryName.toLowerCase().replace('goat ', '')} of all time`}
            submittedRankingsCount={submittedRankingsCount}
            socialActions={socialActions}
          />
        </div>
      </div>
      
      {/* Full-width Comment Section with bottom padding for FAB */}
      <div className="mt-6 sm:mt-8 pb-4 sm:pb-6">
        <CommentSection categoryId={categoryId} />
      </div>
    </>
  );
};

export default CategoryPageContent;


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
}

const CategoryPageContent = ({ 
  categoryId, 
  leaderboardAthletes, 
  submittedRankingsCount, 
  categoryName 
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
            customTitle="GOAT Goalkeeper"
            customSubtitle="Greatest goalkeeper of all time"
            submittedRankingsCount={submittedRankingsCount}
            socialActions={socialActions}
          />
        </div>
      </div>
      
      {/* Full-width Comment Section */}
      <div className="mt-6 sm:mt-8">
        <CommentSection categoryId={categoryId} />
      </div>
    </>
  );
};

export default CategoryPageContent;

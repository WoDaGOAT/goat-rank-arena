
import React from "react";
import UnifiedLeaderboardLayout from "@/components/leaderboard/UnifiedLeaderboardLayout";
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
  return (
    <div className="w-full">
      <UnifiedLeaderboardLayout
        categoryId={categoryId}
        categoryName={categoryName}
        categoryDescription={categoryDescription}
        athletes={leaderboardAthletes}
        submittedRankingsCount={submittedRankingsCount}
        socialActions={<SocialActions categoryId={categoryId} />}
        compact={false}
        showComments={true}
      />
    </div>
  );
};

export default CategoryPageContent;

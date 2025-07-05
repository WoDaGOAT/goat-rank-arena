
import UnifiedLeaderboardLayout from "@/components/leaderboard/UnifiedLeaderboardLayout";
import { SocialActions } from "@/components/category/SocialActions";
import { Category } from "@/types";

interface FeaturedLeaderboardProps {
  goatFootballer: Category | null;
}

const FeaturedLeaderboard = ({ goatFootballer }: FeaturedLeaderboardProps) => {
  if (!goatFootballer) {
    return (
      <div className="text-center text-muted-foreground">
        <p>GOAT Footballer category not found.</p>
      </div>
    );
  }

  return (
    <UnifiedLeaderboardLayout
      categoryId={goatFootballer.id}
      categoryName={goatFootballer.name}
      categoryDescription={goatFootballer.description}
      athletes={goatFootballer.leaderboard}
      submittedRankingsCount={goatFootballer.userRankingCount}
      socialActions={<SocialActions categoryId={goatFootballer.id} />}
      compact={false}
      showComments={true}
    />
  );
};

export default FeaturedLeaderboard;


import GlobalLeaderboard from "@/components/GlobalLeaderboard";
import { Category } from "@/types";

interface FeaturedLeaderboardProps {
  goatFootballer: Category | null;
}

const FeaturedLeaderboard = ({ goatFootballer }: FeaturedLeaderboardProps) => {
  return (
    <div className="w-full">
      {goatFootballer ? (
        <div className="relative">
          <GlobalLeaderboard
            athletes={goatFootballer.leaderboard}
            categoryName={goatFootballer.name}
            submittedRankingsCount={goatFootballer.userRankingCount}
            compact={false}
            categoryId={goatFootballer.id}
          />
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          <p>GOAT Footballer category not found.</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedLeaderboard;

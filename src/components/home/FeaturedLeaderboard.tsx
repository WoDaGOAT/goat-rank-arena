
import GlobalLeaderboard from "@/components/GlobalLeaderboard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Category } from "@/types";

interface FeaturedLeaderboardProps {
  goatFootballer: Category | null;
}

const CreateRankingButton = ({ categoryId }: { categoryId: string }) => (
  <Link to={`/category/${categoryId}/rank`}>
    <Button variant="cta" size="lg" className="w-full">
      <Plus className="w-5 h-5 mr-2" />
      Create Your GOAT Footballer Ranking
    </Button>
  </Link>
);

const FeaturedLeaderboard = ({ goatFootballer }: FeaturedLeaderboardProps) => {
  return (
    <div className="lg:col-span-2 space-y-6">
      {goatFootballer ? (
        <>
          <GlobalLeaderboard
            athletes={goatFootballer.leaderboard}
            categoryName={goatFootballer.name}
          />
          <CreateRankingButton categoryId={goatFootballer.id} />
        </>
      ) : (
        <div className="text-center text-muted-foreground">
          <p>GOAT Footballer category not found.</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedLeaderboard;

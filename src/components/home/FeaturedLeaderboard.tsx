
import GlobalLeaderboard from "@/components/GlobalLeaderboard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Category } from "@/types";

interface FeaturedLeaderboardProps {
  goatFootballer: Category | null;
}

const CreateRankingFAB = ({ categoryId }: { categoryId: string }) => (
  <Link to={`/category/${categoryId}/rank`}>
    <Button 
      variant="cta" 
      size="lg" 
      className="fixed bottom-6 right-6 z-50 rounded-full w-16 h-16 p-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
    >
      <Plus className="w-8 h-8" />
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
          <CreateRankingFAB categoryId={goatFootballer.id} />
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

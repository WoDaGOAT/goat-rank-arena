
import GlobalLeaderboard from "@/components/GlobalLeaderboard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Category } from "@/types";

interface FeaturedLeaderboardProps {
  goatFootballer: Category | null;
}

const CreateRankingButton = ({ categoryId }: { categoryId: string }) => (
  <Button 
    asChild 
    variant="cta" 
    className="fixed bottom-6 right-6 z-50 rounded-full shadow-2xl hover:scale-105 transition-transform w-14 h-14 sm:w-16 sm:h-16 p-0 flex items-center justify-center md:w-auto md:px-6 md:py-3 md:h-12"
  >
    <Link to={`/category/${categoryId}/rank`} title="Create Your Ranking">
      <Plus className="h-6 w-6 sm:h-7 sm:w-7 md:h-6 md:w-6 md:mr-2 shrink-0" />
      <span className="hidden md:inline font-semibold">Create Ranking</span>
    </Link>
  </Button>
);

const FeaturedLeaderboard = ({ goatFootballer }: FeaturedLeaderboardProps) => {
  return (
    <div className="lg:col-span-2 space-y-6">
      {goatFootballer ? (
        <div className="relative">
          <CreateRankingButton categoryId={goatFootballer.id} />
          <GlobalLeaderboard
            athletes={goatFootballer.leaderboard}
            categoryName={goatFootballer.name}
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


import GlobalLeaderboard from "@/components/GlobalLeaderboard";
import CommentSection from "@/components/category/CommentSection";
import { SocialActions } from "@/components/category/SocialActions";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Category } from "@/types";

interface FeaturedLeaderboardProps {
  goatFootballer: Category | null;
}

const FeaturedLeaderboard = ({ goatFootballer }: FeaturedLeaderboardProps) => {
  return (
    <div className="w-full space-y-6">
      {goatFootballer ? (
        <>
          <div className="relative">
            <GlobalLeaderboard
              athletes={goatFootballer.leaderboard}
              categoryName={goatFootballer.name}
              submittedRankingsCount={goatFootballer.userRankingCount}
              compact={false}
              categoryId={goatFootballer.id}
              socialActions={<SocialActions categoryId={goatFootballer.id} />}
            />
          </div>
          
          {/* View my ranking button - only for home page */}
          <div className="flex justify-center">
            <Button asChild variant="cta" size="lg" className="rounded-full">
              <Link to={`/create-ranking/${goatFootballer.id}`}>
                <Plus className="h-5 w-5 mr-2" />
                View my ranking
              </Link>
            </Button>
          </div>

          {/* Comment Section */}
          <CommentSection categoryId={goatFootballer.id} />
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

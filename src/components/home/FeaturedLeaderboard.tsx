
import GlobalLeaderboard from "@/components/GlobalLeaderboard";
import CommentSection from "@/components/category/CommentSection";
import { SocialActions } from "@/components/category/SocialActions";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Eye } from "lucide-react";
import { Category } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRankingForCategory } from "@/hooks/useUserRankingForCategory";

interface FeaturedLeaderboardProps {
  goatFootballer: Category | null;
}

const FeaturedLeaderboard = ({ goatFootballer }: FeaturedLeaderboardProps) => {
  const { user } = useAuth();
  const { data: userRanking, isLoading: isLoadingUserRanking } = useUserRankingForCategory(goatFootballer?.id);

  // Determine button text and icon based on auth status and existing ranking
  const getButtonContent = () => {
    if (!user) {
      return {
        text: "Create Your Ranking",
        icon: Plus
      };
    }
    
    if (isLoadingUserRanking) {
      return {
        text: "Loading...",
        icon: Plus
      };
    }
    
    if (userRanking) {
      return {
        text: "View My Ranking",
        icon: Eye
      };
    }
    
    return {
      text: "Create Your Ranking",
      icon: Plus
    };
  };

  const buttonContent = getButtonContent();
  const ButtonIcon = buttonContent.icon;

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
          
          {/* Dynamic button based on auth status and existing ranking */}
          <div className="flex justify-center">
            <Button 
              asChild 
              variant="cta" 
              size="lg" 
              className="rounded-full"
              disabled={isLoadingUserRanking}
            >
              <Link to={`/create-ranking/${goatFootballer.id}`}>
                <ButtonIcon className="h-5 w-5 mr-2" />
                {buttonContent.text}
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

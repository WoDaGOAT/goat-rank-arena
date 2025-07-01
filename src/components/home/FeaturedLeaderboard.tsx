
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
  const { status: userRankingStatus, ranking: userRanking, isLoading: isLoadingUserRanking } = useUserRankingForCategory(goatFootballer?.id);

  console.log('🔍 FeaturedLeaderboard - User ranking state:', {
    userRankingStatus,
    userRanking,
    isLoadingUserRanking,
    categoryId: goatFootballer?.id
  });

  // Determine button content based on auth status and existing ranking
  const getButtonContent = () => {
    if (!user) {
      return {
        text: "Create Your Ranking",
        icon: Plus,
        href: `/create-ranking/${goatFootballer?.id}`
      };
    }
    
    if (isLoadingUserRanking) {
      return {
        text: "Loading...",
        icon: Plus,
        href: `/create-ranking/${goatFootballer?.id}`
      };
    }
    
    if (userRankingStatus === 'complete' && userRanking?.id) {
      console.log('🔍 FeaturedLeaderboard - Complete ranking found, showing View button');
      return {
        text: "View My Ranking",
        icon: Eye,
        href: `/ranking/${userRanking.id}`
      };
    }
    
    console.log('🔍 FeaturedLeaderboard - No complete ranking, showing Create button for status:', userRankingStatus);
    return {
      text: userRankingStatus === 'incomplete' ? "Continue Your Ranking" : "Create Your Ranking",
      icon: Plus,
      href: `/create-ranking/${goatFootballer?.id}`
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
              <Link to={buttonContent.href}>
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

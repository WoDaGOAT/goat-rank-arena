
import GlobalLeaderboard from "@/components/GlobalLeaderboard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Category } from "@/types";
import { useState, useEffect, useRef } from "react";

interface FeaturedLeaderboardProps {
  goatFootballer: Category | null;
}

const CreateRankingButton = ({ categoryId, isSticky }: { categoryId: string; isSticky: boolean }) => (
  <Button 
    asChild 
    variant="cta" 
    className={`
      z-50 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 
      w-14 h-14 sm:w-16 sm:h-16 p-0 flex items-center justify-center 
      md:w-auto md:px-6 md:py-3 md:h-12
      ${isSticky 
        ? 'absolute left-4 -bottom-20' 
        : 'fixed bottom-6 left-6'
      }
    `}
  >
    <Link to={`/category/${categoryId}/rank`} title="Create Your Ranking">
      <Plus className="h-6 w-6 sm:h-7 sm:w-7 md:h-6 md:w-6 md:mr-2 shrink-0" />
      <span className="hidden md:inline font-semibold">Create Ranking</span>
    </Link>
  </Button>
);

const FeaturedLeaderboard = ({ goatFootballer }: FeaturedLeaderboardProps) => {
  const [isSticky, setIsSticky] = useState(false);
  const leaderboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!leaderboardRef.current) return;

      const leaderboardRect = leaderboardRef.current.getBoundingClientRect();
      const leaderboardBottom = leaderboardRect.bottom;
      
      // If we've scrolled past the leaderboard, make button sticky
      setIsSticky(leaderboardBottom < window.innerHeight);
    };

    // Throttle scroll events for better performance
    let timeoutId: NodeJS.Timeout;
    const throttledHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 16); // ~60fps
    };

    window.addEventListener('scroll', throttledHandleScroll);
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="lg:col-span-2 space-y-6">
      {goatFootballer ? (
        <div className="relative" ref={leaderboardRef}>
          <GlobalLeaderboard
            athletes={goatFootballer.leaderboard}
            categoryName={goatFootballer.name}
            submittedRankingsCount={goatFootballer.userRankingCount}
          />
          <CreateRankingButton categoryId={goatFootballer.id} isSticky={isSticky} />
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

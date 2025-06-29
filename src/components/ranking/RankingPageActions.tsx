
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Share } from "lucide-react";

interface RankingPageActionsProps {
  onShareClick: () => void;
}

const RankingPageActions = ({ onShareClick }: RankingPageActionsProps) => {
  return (
    <div className="mb-6 flex justify-start items-center gap-2 sm:gap-4">
      <Button asChild variant="outline" className="border-white/10 bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white text-sm sm:text-base">
        <Link to={`/feed`}>
          <ChevronLeft className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Back to Feed</span>
        </Link>
      </Button>
      
      <Button 
        onClick={onShareClick}
        variant="outline" 
        className="border-blue-500/20 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200 text-sm sm:text-base px-2 sm:px-4"
        size="sm"
      >
        <Share className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Share Ranking</span>
        <span className="sm:hidden">Share</span>
      </Button>
    </div>
  );
};

export default RankingPageActions;

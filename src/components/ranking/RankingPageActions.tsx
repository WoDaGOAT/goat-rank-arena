
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Share } from "lucide-react";

interface RankingPageActionsProps {
  onShareClick: () => void;
}

const RankingPageActions = ({ onShareClick }: RankingPageActionsProps) => {
  return (
    <div className="mb-6 flex justify-start items-center gap-4">
      <Button asChild variant="outline" className="border-white/10 bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white">
        <Link to={`/feed`}>
          <ChevronLeft /> Back to Feed
        </Link>
      </Button>
      
      <Button 
        onClick={onShareClick}
        variant="outline" 
        className="border-blue-500/20 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200"
      >
        <Share className="mr-2 h-4 w-4" />
        Share Ranking
      </Button>
    </div>
  );
};

export default RankingPageActions;


import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Share } from "lucide-react";

interface RankingPageActionsProps {
  onShareClick: () => void;
}

const RankingPageActions = ({ onShareClick }: RankingPageActionsProps) => {
  return (
    <div className="mb-4 min-[425px]:mb-6 flex justify-start items-center gap-1 min-[375px]:gap-2 min-[425px]:gap-4">
      <Button 
        asChild 
        variant="outline" 
        className="border-white/10 bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white text-xs min-[375px]:text-sm min-[425px]:text-base px-2 py-1 min-[375px]:px-3 min-[375px]:py-2 min-[425px]:px-4 h-7 min-[375px]:h-8 min-[375px]:h-9 min-[425px]:h-10"
      >
        <Link to={`/feed`}>
          <ChevronLeft className="h-3 w-3 min-[375px]:h-4 min-[375px]:w-4 min-[375px]:mr-1 min-[425px]:mr-2" />
          <span className="hidden min-[375px]:inline text-xs min-[375px]:text-sm min-[425px]:text-base">Back</span>
          <span className="hidden min-[425px]:inline"> to Feed</span>
        </Link>
      </Button>
      
      {/* Share button for screens 425px and above */}
      <div 
        onClick={onShareClick}
        className="hidden min-[425px]:flex items-center justify-center gap-2 cursor-pointer border border-blue-500/20 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200 text-xs min-[425px]:text-base px-2 py-1 min-[425px]:px-4 min-[425px]:py-2 h-7 min-[425px]:h-10 rounded-md transition-colors"
      >
        <Share className="h-3 w-3 min-[425px]:h-4 min-[425px]:w-4" />
        <span className="text-xs min-[425px]:text-base">Share Ranking</span>
      </div>

      {/* Share icon only for screens below 425px */}
      <div 
        onClick={onShareClick}
        className="block min-[425px]:hidden cursor-pointer p-1.5 min-[375px]:p-2 text-blue-300 hover:text-blue-200 transition-colors rounded-md hover:bg-blue-500/10"
      >
        <Share className="h-3 w-3 min-[375px]:h-4 min-[375px]:w-4" />
      </div>
    </div>
  );
};

export default RankingPageActions;


import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Share } from "lucide-react";

interface RankingPageActionsProps {
  onShareClick: () => void;
}

const RankingPageActions = ({ onShareClick }: RankingPageActionsProps) => {
  return (
    <div className="mb-6 flex justify-start items-center gap-1 xs:gap-2 sm:gap-4">
      <Button 
        asChild 
        variant="outline" 
        className="border-white/10 bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white text-xs xs:text-sm sm:text-base px-2 xs:px-3 sm:px-4 py-1 xs:py-2 h-8 xs:h-9 sm:h-10"
      >
        <Link to={`/feed`}>
          <ChevronLeft className="h-3 w-3 xs:h-4 xs:w-4 xs:mr-1 sm:mr-2" />
          <span className="hidden xs:inline text-xs xs:text-sm sm:text-base">Back</span>
          <span className="hidden sm:inline"> to Feed</span>
        </Link>
      </Button>
      
      {/* Share button for screens 576px and above */}
      <Button 
        onClick={onShareClick}
        variant="outline" 
        className="hidden sm:flex border-blue-500/20 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200 text-xs xs:text-sm sm:text-base px-2 xs:px-3 sm:px-4 py-1 xs:py-2 h-8 xs:h-9 sm:h-10"
      >
        <Share className="h-3 w-3 xs:h-4 xs:w-4 xs:mr-1 sm:mr-2" />
        <span className="text-xs xs:text-sm sm:text-base">Share</span>
        <span className="hidden sm:inline"> Ranking</span>
      </Button>

      {/* Share icon only for screens below 576px (including 425px) */}
      <div 
        onClick={onShareClick}
        className="sm:hidden cursor-pointer p-2 text-blue-300 hover:text-blue-200 transition-colors rounded-md hover:bg-blue-500/10"
      >
        <Share className="h-4 w-4" />
      </div>
    </div>
  );
};

export default RankingPageActions;

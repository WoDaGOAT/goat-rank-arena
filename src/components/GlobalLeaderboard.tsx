
import { Athlete } from "@/types";
import LeaderboardRow from "./LeaderboardRow";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, ExternalLink, Plus } from "lucide-react";
import { sanitize } from "@/lib/sanitize";
import { ShareDialog } from "./category/ShareDialog";
import { useState } from "react";
import { Link } from "react-router-dom";

interface GlobalLeaderboardProps {
  athletes: Athlete[];
  categoryName: string;
  submittedRankingsCount?: number;
  socialActions?: React.ReactNode;
  compact?: boolean;
  categoryId?: string;
  customTitle?: string;
  customSubtitle?: string;
}

const GlobalLeaderboard = ({ 
  athletes, 
  categoryName, 
  submittedRankingsCount = 0, 
  socialActions,
  compact = false,
  categoryId,
  customTitle,
  customSubtitle
}: GlobalLeaderboardProps) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const currentUrl = window.location.href;
  const shareText = `Check out the ${sanitize(categoryName)} leaderboard on WoDaGOAT!`;

  // Show fewer athletes in compact mode
  const displayAthletes = compact ? athletes.slice(0, 5) : athletes.slice(0, 10);
  
  // Check if we have insufficient data for a meaningful leaderboard
  const hasInsufficientData = submittedRankingsCount < 3;

  // Use custom title and subtitle if provided, otherwise fallback to categoryName
  const displayTitle = customTitle || sanitize(categoryName);
  const displaySubtitle = customSubtitle || "";

  console.log('GlobalLeaderboard - Debug info:', {
    hasInsufficientData,
    submittedRankingsCount,
    athletesLength: athletes.length,
    categoryName,
    categoryId
  });

  return (
    <Card className="shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20 w-full">
      <CardHeader className={`border-b border-white/30 bg-white/5 relative overflow-hidden ${compact ? 'p-3 sm:p-4' : 'p-3 sm:p-4 md:p-6'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5"></div>
        <div className="relative">
          {/* Centered title and count */}
          <div className="text-center">
            <h1 className={`font-bold text-white mb-1 ${compact ? 'text-lg sm:text-xl' : 'text-lg sm:text-xl md:text-2xl'}`}>
              {displayTitle}
            </h1>
            {displaySubtitle && (
              <h2 className={`font-medium text-gray-300 mb-2 ${compact ? 'text-sm' : 'text-sm sm:text-base'}`}>
                {displaySubtitle}
              </h2>
            )}
            <p className="text-xs sm:text-sm text-gray-300 font-medium">
              ✅ {submittedRankingsCount.toLocaleString()} Submitted Rankings
            </p>
          </div>
          
          {/* Absolutely positioned buttons on the right */}
          <div className="absolute right-0 top-0 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShareDialog(true)}
              className="border-white/20 bg-white/10 text-white hover:bg-white/20 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
            >
              <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Share
            </Button>
            {compact && categoryId && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
              >
                <Link to={`/category/${categoryId}`}>
                  <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  View Full
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {hasInsufficientData ? (
          // Enhanced insufficient data message with better visibility
          <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 text-center min-h-[300px] bg-white/5">
            <div className="w-full max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                <Plus className="h-10 w-10 text-white/80" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                Not Enough Rankings Yet
              </h3>
              <p className="text-sm sm:text-base text-gray-300 mb-6 leading-relaxed">
                We need at least 3 rankings to show a meaningful leaderboard. Be one of the first to rank the greatest {sanitize(categoryName.toLowerCase().replace('goat ', ''))}!
              </p>
              <div className="text-xs text-gray-400 mb-6">
                Current rankings: {submittedRankingsCount} / 3 needed
              </div>
              {categoryId && (
                <Button asChild variant="default" size="lg" className="bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-full px-8 py-3 font-semibold">
                  <Link to={`/create-ranking/${categoryId}`}>
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your Ranking
                  </Link>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Header row - hidden on mobile */}
            <div className={`hidden md:grid md:grid-cols-[50px_72px_1fr_110px_90px] gap-4 items-center px-4 bg-white/5 border-b border-white/20 text-xs font-bold text-gray-300 uppercase tracking-wide ${compact ? 'py-2' : 'py-3'}`}>
              <div className="text-center">#</div>
              <div></div>
              <div>Player</div>
              <div className="text-center">Trend</div>
              <div className="text-center">Score</div>
            </div>
            
            <div className="divide-y divide-white/20">
              {displayAthletes.map((athlete, index) => (
                <LeaderboardRow 
                  key={athlete.id} 
                  athlete={athlete} 
                  position={index + 1}
                  compact={compact}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Social Actions at the bottom */}
        {socialActions && !hasInsufficientData && (
          <div className={`border-t border-white/20 bg-white/5 ${compact ? 'p-3' : 'p-3 sm:p-4'}`}>
            {socialActions}
          </div>
        )}
      </CardContent>

      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        url={currentUrl}
        text={shareText}
      />
    </Card>
  );
};

export default GlobalLeaderboard;


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
  
  // IMPROVED LOGIC: Always show the leaderboard card, but with different content
  const hasValidAthletes = athletes && Array.isArray(athletes) && athletes.length > 0;
  const shouldShowInsufficientMessage = submittedRankingsCount < 3;

  // Use custom title and subtitle if provided, otherwise fallback to categoryName
  const displayTitle = customTitle || sanitize(categoryName);
  const displaySubtitle = customSubtitle || "";

  console.log('🔧 GlobalLeaderboard - Render decision:', {
    shouldShowInsufficientMessage,
    submittedRankingsCount,
    athletesLength: athletes?.length || 0,
    hasValidAthletes,
    categoryName,
    categoryId,
    displayAthletes: displayAthletes?.length || 0
  });

  return (
    <Card className="shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20 w-full">
      <CardHeader className={`border-b border-white/30 bg-white/5 relative overflow-hidden ${compact ? 'p-2 min-[375px]:p-3 min-[425px]:p-4' : 'p-2 min-[375px]:p-3 min-[425px]:p-4 md:p-6'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5"></div>
        <div className="relative">
          {/* Mobile-first responsive layout */}
          <div className="flex flex-col gap-2 min-[425px]:gap-3">
            {/* Title section - always full width on mobile */}
            <div className="text-center">
              <h1 className={`font-bold text-white mb-1 ${compact ? 'text-base min-[375px]:text-lg min-[425px]:text-xl' : 'text-base min-[375px]:text-lg min-[425px]:text-xl md:text-2xl'}`}>
                {displayTitle}
              </h1>
              {displaySubtitle && (
                <h2 className={`font-medium text-gray-300 mb-2 ${compact ? 'text-xs min-[375px]:text-sm' : 'text-xs min-[375px]:text-sm min-[425px]:text-base'}`}>
                  {displaySubtitle}
                </h2>
              )}
              <p className="text-xs min-[425px]:text-sm text-gray-300 font-medium">
                ✅ {submittedRankingsCount.toLocaleString()} Submitted Rankings
              </p>
            </div>
            
            {/* Buttons section - centered on mobile, flex-wrap for safety */}
            <div className="flex flex-wrap items-center justify-center gap-1 min-[375px]:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShareDialog(true)}
                className="border-white/20 bg-white/10 text-white hover:bg-white/20 text-xs min-[425px]:text-sm px-2 py-1 min-[375px]:px-3 min-[375px]:py-1.5 min-[425px]:px-4 min-[425px]:py-2"
              >
                <Share2 className="h-3 w-3 min-[425px]:h-4 min-[425px]:w-4 mr-1 min-[425px]:mr-2" />
                Share
              </Button>
              {compact && categoryId && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20 text-xs min-[425px]:text-sm px-2 py-1 min-[375px]:px-3 min-[375px]:py-1.5 min-[425px]:px-4 min-[425px]:py-2"
                >
                  <Link to={`/category/${categoryId}`}>
                    <ExternalLink className="h-3 w-3 min-[425px]:h-4 min-[425px]:w-4 mr-1 min-[425px]:mr-2" />
                    <span className="hidden min-[375px]:inline">View </span>Full
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {shouldShowInsufficientMessage ? (
          // Show "Not Enough Rankings Yet" message
          <div className="flex flex-col items-center justify-center py-8 min-[425px]:py-12 px-3 min-[375px]:px-4 min-[425px]:px-6 text-center min-h-[250px] min-[425px]:min-h-[300px] bg-gradient-to-b from-white/5 to-white/10">
            <div className="w-full max-w-md mx-auto">
              <div className="w-16 h-16 min-[425px]:w-20 min-[425px]:h-20 mx-auto mb-4 min-[425px]:mb-6 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-2 border-white/20 flex items-center justify-center shadow-lg">
                <Plus className="h-8 w-8 min-[425px]:h-10 min-[425px]:w-10 text-white" />
              </div>
              <h3 className="text-lg min-[375px]:text-xl min-[425px]:text-2xl font-bold text-white mb-3 min-[425px]:mb-4 drop-shadow-sm">
                Not Enough Rankings Yet
              </h3>
              <p className="text-sm min-[425px]:text-base text-gray-200 mb-4 min-[425px]:mb-6 leading-relaxed drop-shadow-sm">
                We need at least 3 rankings to show a meaningful leaderboard. Be one of the first to rank the greatest {sanitize(categoryName.toLowerCase().replace('goat ', ''))}!
              </p>
              <div className="text-xs text-gray-300 mb-4 min-[425px]:mb-6 bg-white/10 rounded-full px-3 py-2 min-[425px]:px-4 inline-block">
                Current rankings: <span className="font-bold">{submittedRankingsCount}</span> / <span className="font-bold">3</span> needed
              </div>
              {categoryId && (
                <Button asChild variant="default" size="lg" className="bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-full px-6 py-2 min-[425px]:px-8 min-[425px]:py-3 font-semibold shadow-lg hover:shadow-xl transition-all text-sm min-[425px]:text-base">
                  <Link to={`/create-ranking/${categoryId}`}>
                    <Plus className="h-4 w-4 min-[425px]:h-5 min-[425px]:w-5 mr-2" />
                    Create Your Ranking
                  </Link>
                </Button>
              )}
            </div>
          </div>
        ) : hasValidAthletes ? (
          // Show the leaderboard
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
        ) : (
          // Fallback for when we have 3+ rankings but no athlete data (data loading issue)
          <div className="flex flex-col items-center justify-center py-8 min-[425px]:py-12 px-3 min-[375px]:px-4 min-[425px]:px-6 text-center min-h-[200px]">
            <div className="text-white">
              <h3 className="text-base min-[425px]:text-lg font-bold mb-2">Leaderboard Loading</h3>
              <p className="text-gray-300 text-sm">
                Rankings are being processed...
              </p>
            </div>
          </div>
        )}
        
        {/* Social Actions at the bottom */}
        {socialActions && !shouldShowInsufficientMessage && (
          <div className={`border-t border-white/20 bg-white/5 ${compact ? 'p-2 min-[375px]:p-3' : 'p-2 min-[375px]:p-3 min-[425px]:p-4'}`}>
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

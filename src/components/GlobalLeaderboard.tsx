
import { Athlete } from "@/types";
import LeaderboardRow from "./LeaderboardRow";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, ExternalLink } from "lucide-react";
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
}

const GlobalLeaderboard = ({ 
  athletes, 
  categoryName, 
  submittedRankingsCount = 0, 
  socialActions,
  compact = false,
  categoryId
}: GlobalLeaderboardProps) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const currentUrl = window.location.href;
  const shareText = `Check out the ${sanitize(categoryName)} leaderboard on WoDaGOAT!`;

  // Show fewer athletes in compact mode
  const displayAthletes = compact ? athletes.slice(0, 5) : athletes.slice(0, 10);

  return (
    <Card className="shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20 w-full">
      <CardHeader className={`border-b border-white/30 bg-white/5 relative overflow-hidden ${compact ? 'p-3 sm:p-4' : 'p-3 sm:p-4 md:p-6'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5"></div>
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-left">
            <h1 className={`font-bold text-white mb-1 ${compact ? 'text-lg sm:text-xl' : 'text-lg sm:text-xl md:text-2xl'}`}>
              {sanitize(categoryName)}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 font-medium">
              ✅ {submittedRankingsCount.toLocaleString()} Submitted Rankings
            </p>
          </div>
          <div className="flex justify-center sm:justify-end gap-2">
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
        {/* Header row - hidden on mobile */}
        <div className={`hidden md:grid md:grid-cols-[50px_72px_1fr_110px_90px] gap-4 items-center px-4 bg-white/5 border-b border-white/20 text-xs font-bold text-gray-300 uppercase tracking-wide ${compact ? 'py-2' : 'py-3'}`}>
          <div className="text-center">#</div>
          <div></div>
          <div>Player</div>
          <div className="text-center">Trend</div>
          <div className="text-center">Score</div>
        </div>
        
        {/* Leaderboard rows */}
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
        
        {/* Social Actions at the bottom */}
        {socialActions && (
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

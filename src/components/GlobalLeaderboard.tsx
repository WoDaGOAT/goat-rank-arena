
import { Athlete } from "@/types";
import LeaderboardRow from "./LeaderboardRow";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { sanitize } from "@/lib/sanitize";
import { ShareDialog } from "./category/ShareDialog";
import { useState } from "react";

interface GlobalLeaderboardProps {
  athletes: Athlete[];
  categoryName: string;
  socialActions?: React.ReactNode;
}

const GlobalLeaderboard = ({ athletes, categoryName, socialActions }: GlobalLeaderboardProps) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const currentUrl = window.location.href;
  const shareText = `Check out the ${sanitize(categoryName)} leaderboard on WoDaGOAT!`;

  return (
    <Card className="shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20 w-full">
      <CardHeader className="border-b border-white/30 bg-white/5 relative overflow-hidden p-3 sm:p-4 md:p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5"></div>
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1 hidden sm:block"></div>
          <div className="text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">
              {sanitize(categoryName)}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 font-medium">
              🎮 Live Rankings • Top 10 Champions
            </p>
          </div>
          <div className="flex-1 flex justify-center sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShareDialog(true)}
              className="border-white/20 bg-white/10 text-white hover:bg-white/20 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
            >
              <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Header row - hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-[50px_60px_1fr_110px_90px] gap-4 items-center px-4 py-3 bg-white/5 border-b border-white/20 text-xs font-bold text-gray-300 uppercase tracking-wide">
          <div className="text-center">#</div>
          <div></div>
          <div>Player</div>
          <div className="text-center">Trend</div>
          <div className="text-center">Score</div>
        </div>
        
        {/* Leaderboard rows */}
        <div className="divide-y divide-white/20">
          {athletes.slice(0, 10).map((athlete, index) => (
            <LeaderboardRow 
              key={athlete.id} 
              athlete={athlete} 
              position={index + 1}
            />
          ))}
        </div>
        
        {/* Social Actions at the bottom */}
        {socialActions && (
          <div className="p-3 sm:p-4 border-t border-white/20 bg-white/5">
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

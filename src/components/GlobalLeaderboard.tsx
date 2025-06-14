
import { Athlete } from "@/types";
import LeaderboardRow from "./LeaderboardRow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Crown, Medal } from "lucide-react";

interface GlobalLeaderboardProps {
  athletes: Athlete[];
  categoryName: string;
}

const GlobalLeaderboard = ({ athletes, categoryName }: GlobalLeaderboardProps) => {
  return (
    <Card className="w-full shadow-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2 border-primary/20">
      <CardHeader className="border-b border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
        <div className="relative flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Crown className="w-8 h-8 text-yellow-500" />
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-primary mb-1">
              {categoryName}
            </CardTitle>
            <p className="text-sm text-muted-foreground font-medium">
              🎮 Live Rankings • Top 10 Champions
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Header row */}
        <div className="grid grid-cols-[50px_60px_1fr_60px_80px] gap-3 items-center px-4 py-3 bg-muted/30 border-b border-border/50 text-xs font-bold text-muted-foreground uppercase tracking-wide">
          <div className="text-center">#</div>
          <div></div>
          <div>Player</div>
          <div className="text-center">Trend</div>
          <div className="text-right">Score</div>
        </div>
        
        {/* Leaderboard rows */}
        <div className="divide-y divide-border/30">
          {athletes.slice(0, 10).map((athlete, index) => (
            <LeaderboardRow 
              key={athlete.id} 
              athlete={athlete} 
              position={index + 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobalLeaderboard;

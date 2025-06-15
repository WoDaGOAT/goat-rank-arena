
import { Athlete } from "@/types";
import LeaderboardRow from "./LeaderboardRow";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trophy, Crown } from "lucide-react";

interface GlobalLeaderboardProps {
  athletes: Athlete[];
  categoryName: string;
}

const GlobalLeaderboard = ({ athletes, categoryName }: GlobalLeaderboardProps) => {
  return (
    <Card className="shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20">
      <CardHeader className="border-b border-white/30 bg-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5"></div>
        <div className="relative flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Crown className="w-8 h-8 text-yellow-400" />
            <Trophy className="w-6 h-6 text-blue-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {categoryName}
            </h2>
            <p className="text-sm text-gray-300 font-medium">
              🎮 Live Rankings • Top 10 Champions
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Header row */}
        <div className="grid grid-cols-[50px_60px_1fr_110px_90px] gap-4 items-center px-4 py-3 bg-white/5 border-b border-white/20 text-xs font-bold text-gray-300 uppercase tracking-wide">
          <div className="text-center">#</div>
          <div></div>
          <div>Player</div>
          <div className="flex justify-center">Trend</div>
          <div className="flex justify-center">Score</div>
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
      </CardContent>
    </Card>
  );
};

export default GlobalLeaderboard;


import { UserStats } from "@/types/badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Flame, TrendingUp } from "lucide-react";

interface UserStatsCardProps {
  stats: UserStats;
}

const UserStatsCard = ({ stats }: UserStatsCardProps) => {
  const getAccuracyLevel = (accuracy: number) => {
    if (accuracy >= 90) return { name: "GOAT", color: "bg-yellow-500", icon: "🐐" };
    if (accuracy >= 75) return { name: "Legend", color: "bg-purple-500", icon: "🔱" };
    if (accuracy >= 60) return { name: "Expert", color: "bg-blue-500", icon: "🎓" };
    if (accuracy >= 45) return { name: "Foot Lover", color: "bg-green-500", icon: "⚽" };
    return { name: "Newcomer", color: "bg-gray-500", icon: "👋" };
  };

  const level = getAccuracyLevel(stats.accuracy_percentage);

  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-blue-500/30 text-white shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-3 text-white">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Your Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-blue-300 text-base">Current Level:</span>
          <Badge className={`${level.color} text-white px-4 py-2 text-base font-semibold`}>
            {level.icon} {level.name}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-6 w-6 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.accuracy_percentage.toFixed(1)}%
            </div>
            <div className="text-blue-300 text-sm">Accuracy</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Flame className="h-6 w-6 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.current_streak}
            </div>
            <div className="text-blue-300 text-sm">Day Streak</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.perfect_scores}
            </div>
            <div className="text-blue-300 text-sm">Perfect Scores</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="h-6 w-6 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.total_quizzes}
            </div>
            <div className="text-blue-300 text-sm">Quizzes Taken</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStatsCard;

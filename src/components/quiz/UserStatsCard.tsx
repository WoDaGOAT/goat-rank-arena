
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
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Your Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Current Level:</span>
          <Badge className={`${level.color} text-white`}>
            {level.icon} {level.name}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            <div>
              <p className="font-semibold">{stats.accuracy_percentage.toFixed(1)}%</p>
              <p className="text-gray-600">Accuracy</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <div>
              <p className="font-semibold">{stats.current_streak}</p>
              <p className="text-gray-600">Day Streak</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <div>
              <p className="font-semibold">{stats.perfect_scores}</p>
              <p className="text-gray-600">Perfect Scores</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-purple-500" />
            <div>
              <p className="font-semibold">{stats.total_quizzes}</p>
              <p className="text-gray-600">Quizzes Taken</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStatsCard;

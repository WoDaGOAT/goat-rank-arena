import { UserStats } from "@/types/badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Flame, TrendingUp, Award, BookOpen, Shield, Heart, Sparkles } from "lucide-react";
import { useUserBadges } from "@/hooks/useUserBadges";

interface UserStatsCardProps {
  stats: UserStats;
}

const UserStatsCard = ({ stats }: UserStatsCardProps) => {
  const { userBadges } = useUserBadges();

  const getBadgeLevel = () => {
    // Priority order for badges (highest to lowest)
    const badgePriority = [
      { id: 'goat', name: "GOAT", color: "bg-yellow-500", icon: TrendingUp },
      { id: 'legend', name: "Legend", color: "bg-purple-500", icon: Shield },
      { id: 'expert', name: "Expert", color: "bg-blue-500", icon: BookOpen },
      { id: 'triple_perfect', name: "Hat Trick", color: "bg-orange-500", icon: Award },
      { id: 'perfect_score', name: "Perfect Score", color: "bg-green-500", icon: Trophy },
      { id: 'streak_10', name: "10-Day Streak", color: "bg-red-500", icon: Flame },
      { id: 'foot_lover', name: "Foot Lover", color: "bg-green-500", icon: Heart },
      { id: 'streak_3', name: "3-Day Streak", color: "bg-orange-400", icon: Flame },
      { id: 'first_quiz', name: "First Quiz", color: "bg-blue-400", icon: Sparkles },
      { id: 'newcomer', name: "Newcomer", color: "bg-gray-500", icon: Sparkles }
    ];

    // Find the highest priority badge the user has earned
    for (const badgeLevel of badgePriority) {
      const hasBadge = userBadges.some(userBadge => userBadge.badge_id === badgeLevel.id);
      if (hasBadge) {
        return badgeLevel;
      }
    }

    // Fallback to accuracy-based level if no badges found
    const accuracy = stats.accuracy_percentage;
    if (accuracy >= 90) return { name: "GOAT", color: "bg-yellow-500", icon: TrendingUp };
    if (accuracy >= 75) return { name: "Legend", color: "bg-purple-500", icon: Shield };
    if (accuracy >= 60) return { name: "Expert", color: "bg-blue-500", icon: BookOpen };
    if (accuracy >= 45) return { name: "Foot Lover", color: "bg-green-500", icon: Heart };
    return { name: "Newcomer", color: "bg-gray-500", icon: Sparkles };
  };

  const level = getBadgeLevel();
  const LevelIcon = level.icon;

  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-blue-500/30 text-white shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-3 text-white">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Your Daily Quiz Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-blue-300 text-base">Current Level:</span>
          <Badge className={`${level.color} text-white px-4 py-2 text-base font-semibold flex items-center gap-2`}>
            <LevelIcon className="h-4 w-4" />
            {level.name}
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
              <Award className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.perfect_scores}
            </div>
            <div className="text-blue-300 text-sm">Perfect 5/5</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.total_quizzes}
            </div>
            <div className="text-blue-300 text-sm">Daily Quizzes</div>
          </div>
        </div>

        {/* New 5-question format stats */}
        <div className="border-t border-gray-600 pt-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-white mb-2">
              {stats.total_correct} / {stats.total_questions} Questions Correct
            </div>
            <div className="text-sm text-gray-400">
              Each daily quiz has exactly 5 questions worth 1 point each
            </div>
          </div>
        </div>

        {/* Show earned badges count */}
        {userBadges.length > 0 && (
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-sm text-gray-400">Badges Earned</div>
            <div className="text-lg font-bold text-blue-400">
              {userBadges.length} badge{userBadges.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}

        {stats.longest_streak > stats.current_streak && (
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-sm text-gray-400">Best Streak</div>
            <div className="text-lg font-bold text-orange-400 flex items-center justify-center gap-2">
              <Flame className="h-4 w-4" />
              {stats.longest_streak} days
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserStatsCard;

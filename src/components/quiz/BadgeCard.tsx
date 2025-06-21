
import { Badge, UserBadge } from "@/types/badges";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Lightbulb, 
  Flame, 
  Target, 
  Stars, 
  BarChart, 
  Medal, 
  Crown, 
  Sparkles, 
  Heart, 
  BookOpen, 
  Shield, 
  TrendingUp,
  LucideIcon
} from "lucide-react";

interface BadgeCardProps {
  badge: Badge;
  userBadge?: UserBadge;
  isEarned: boolean;
  className?: string;
}

const rarityColors = {
  common: "border-gray-400 bg-gray-50",
  rare: "border-blue-400 bg-blue-50",
  epic: "border-purple-400 bg-purple-50",
  legendary: "border-yellow-400 bg-yellow-50"
};

const rarityIconColors = {
  common: "text-gray-600",
  rare: "text-blue-600", 
  epic: "text-purple-600",
  legendary: "text-yellow-600"
};

const iconMap: Record<string, LucideIcon> = {
  lightbulb: Lightbulb,
  flame: Flame,
  target: Target,
  stars: Stars,
  'bar-chart': BarChart,
  medal: Medal,
  crown: Crown,
  sparkles: Sparkles,
  heart: Heart,
  'book-open': BookOpen,
  'shield-star': Shield,
  'trending-up': TrendingUp,
};

// Detailed requirements for each badge
const badgeRequirements: Record<string, string> = {
  'first_quiz': 'Complete your first daily quiz to earn this badge',
  'streak_3': 'Complete daily quizzes for 3 consecutive days without missing a day',
  'streak_10': 'Complete daily quizzes for 10 consecutive days without missing a day',
  'perfect_score': 'Answer all 5 questions correctly in a single daily quiz (5/5 points)',
  'triple_perfect': 'Achieve 3 perfect scores across different daily quizzes',
  'top_10_percent': 'Finish in the top 10% of all users on any daily quiz leaderboard',
  'top_3': 'Finish in the top 3 positions on any daily quiz leaderboard',
  'daily_champion': 'Achieve the highest score of all users on a daily quiz',
  'newcomer': 'Automatically earned when you join WoDaGOAT - welcome!',
  'foot_lover': 'Achieve an overall accuracy of 45-59.9% across all your quiz attempts',
  'expert': 'Achieve an overall accuracy of 60-74.9% across all your quiz attempts',
  'legend': 'Achieve an overall accuracy of 75-89.9% across all your quiz attempts',
  'goat': 'Achieve an overall accuracy of 90% or higher across all your quiz attempts'
};

const BadgeCard = ({ badge, userBadge, isEarned, className }: BadgeCardProps) => {
  const IconComponent = iconMap[badge.icon] || Sparkles;
  const requirement = badgeRequirements[badge.id] || badge.description;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "relative p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 cursor-pointer",
            isEarned ? rarityColors[badge.rarity] : "border-gray-300 bg-gray-100 opacity-50",
            className
          )}>
            <div className="text-center">
              <div className={cn(
                "mb-2 flex justify-center",
                !isEarned && "grayscale opacity-50"
              )}>
                <IconComponent 
                  className={cn(
                    "h-8 w-8",
                    isEarned ? rarityIconColors[badge.rarity] : "text-gray-500"
                  )}
                />
              </div>
              <h4 className={cn(
                "font-semibold text-sm",
                isEarned ? "text-gray-800" : "text-gray-500"
              )}>
                {badge.name}
              </h4>
              {userBadge && (
                <p className="text-xs text-gray-600 mt-1">
                  {new Date(userBadge.earned_at).toLocaleDateString()}
                </p>
              )}
            </div>
            {!isEarned && (
              <div className="absolute inset-0 bg-gray-400/20 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 font-bold text-xs">🔒</span>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="text-center">
            <p className="font-semibold">{badge.name}</p>
            <p className="text-sm text-gray-600 mt-1">{requirement}</p>
            <p className="text-xs text-gray-500 mt-2 capitalize">
              {badge.rarity} Badge
            </p>
            {userBadge && (
              <p className="text-xs text-green-600 mt-1 font-medium">
                ✓ Earned on {new Date(userBadge.earned_at).toLocaleDateString()}
              </p>
            )}
            {!isEarned && (
              <p className="text-xs text-orange-600 mt-1 font-medium">
                🔒 Complete the requirement above to unlock
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BadgeCard;

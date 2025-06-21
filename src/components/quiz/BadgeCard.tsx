
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
  ShieldStar, 
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
  'shield-star': ShieldStar,
  'trending-up': TrendingUp,
};

const BadgeCard = ({ badge, userBadge, isEarned, className }: BadgeCardProps) => {
  const IconComponent = iconMap[badge.icon] || Sparkles;
  
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
            <p className="text-sm text-gray-600">{badge.description}</p>
            <p className="text-xs text-gray-500 mt-1 capitalize">
              {badge.rarity} Badge
            </p>
            {!isEarned && (
              <p className="text-xs text-gray-500 mt-1">
                Complete the requirement to unlock this badge
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BadgeCard;

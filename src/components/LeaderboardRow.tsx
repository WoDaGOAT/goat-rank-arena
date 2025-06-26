
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Athlete } from "@/types";
import { sanitize } from "@/lib/sanitize";

interface LeaderboardRowProps {
  athlete: Athlete;
  position: number;
  compact?: boolean;
}

const LeaderboardRow = ({ athlete, position, compact = false }: LeaderboardRowProps) => {
  const getTrendIcon = () => {
    switch (athlete.movement) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRankStyle = () => {
    if (position === 1) return "text-yellow-400 font-bold text-xl";
    if (position === 2) return "text-gray-300 font-bold text-lg";
    if (position === 3) return "text-orange-400 font-bold text-lg";
    return "text-gray-400 font-semibold";
  };

  const getRankBadge = () => {
    if (position === 1) return "🥇";
    if (position === 2) return "🥈";
    if (position === 3) return "🥉";
    return null;
  };

  const paddingClass = compact ? "px-3 py-2 sm:px-4 sm:py-3" : "px-4 py-3 sm:px-6 sm:py-4";

  return (
    <div className={`${paddingClass} hover:bg-white/5 transition-colors duration-200`}>
      {/* Mobile layout */}
      <div className="md:hidden flex items-center gap-3">
        <div className={`w-8 text-center ${getRankStyle()}`}>
          {getRankBadge() || position}
        </div>
        <Avatar className={`border-2 border-white/20 ${compact ? 'h-10 w-10' : 'h-12 w-12'}`}>
          <AvatarImage src={athlete.imageUrl} alt={sanitize(athlete.name)} />
          <AvatarFallback>{sanitize(athlete.name).charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-white truncate ${compact ? 'text-sm' : 'text-base'}`}>
            {sanitize(athlete.name)}
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={`${compact ? 'text-xs px-2 py-0.5' : 'text-sm'}`}>
              {athlete.points.toLocaleString()}
            </Badge>
            {getTrendIcon()}
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:grid md:grid-cols-[50px_72px_1fr_110px_90px] gap-4 items-center">
        <div className={`text-center ${getRankStyle()}`}>
          {getRankBadge() || position}
        </div>
        <Avatar className={`border-2 border-white/20 ${compact ? 'h-10 w-10' : 'h-12 w-12'}`}>
          <AvatarImage src={athlete.imageUrl} alt={sanitize(athlete.name)} />
          <AvatarFallback>{sanitize(athlete.name).charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className={`font-semibold text-white truncate ${compact ? 'text-sm' : 'text-base'}`}>
            {sanitize(athlete.name)}
          </h3>
        </div>
        <div className="flex justify-center">
          {getTrendIcon()}
        </div>
        <div className="text-center">
          <Badge variant="secondary" className={compact ? 'text-xs px-2 py-0.5' : 'text-sm'}>
            {athlete.points.toLocaleString()}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardRow;

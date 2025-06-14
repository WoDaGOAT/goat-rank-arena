
import { Athlete, getPlaceholderImageUrl } from "@/types";
import { ArrowUp, ArrowDown, Minus, Crown, Medal, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LeaderboardRowProps {
  athlete: Athlete;
  position: number;
}

const LeaderboardRow = ({ athlete, position }: LeaderboardRowProps) => {
  const MovementIcon = () => {
    if (athlete.movement === "up") {
      return <ArrowUp className="w-4 h-4 text-green-500" />;
    }
    if (athlete.movement === "down") {
      return <ArrowDown className="w-4 h-4 text-red-500" />;
    }
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getRankIcon = () => {
    if (position === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (position === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (position === 3) return <Trophy className="w-5 h-5 text-amber-600" />;
    return null;
  };

  const getRankStyle = () => {
    if (position === 1) return "bg-gradient-to-r from-yellow-500/10 to-yellow-400/5 border-l-4 border-l-yellow-400";
    if (position === 2) return "bg-gradient-to-r from-gray-500/10 to-gray-400/5 border-l-4 border-l-gray-400";
    if (position === 3) return "bg-gradient-to-r from-amber-500/10 to-amber-400/5 border-l-4 border-l-amber-600";
    return "hover:bg-white/5";
  };

  const getMovementBadge = () => {
    if (athlete.movement === "up") {
      return (
        <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 text-xs px-2 py-0.5">
          <ArrowUp className="w-3 h-3 mr-1" />
          Rising
        </Badge>
      );
    }
    if (athlete.movement === "down") {
      return (
        <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30 text-xs px-2 py-0.5">
          <ArrowDown className="w-3 h-3 mr-1" />
          Falling
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-xs px-2 py-0.5 bg-white/10 text-gray-300 border-white/30">
        <Minus className="w-3 h-3 mr-1" />
        Stable
      </Badge>
    );
  };

  return (
    <div className={`grid grid-cols-[50px_60px_1fr_60px_80px] gap-3 items-center px-4 py-3 transition-all duration-200 ${getRankStyle()}`}>
      {/* Rank */}
      <div className="flex items-center justify-center">
        {getRankIcon() || (
          <span className="text-lg font-bold text-white">{position}</span>
        )}
      </div>
      
      {/* Avatar */}
      <div className="relative">
        <img
          src={getPlaceholderImageUrl(athlete.imageUrl)}
          alt={athlete.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-white/30 shadow-md"
        />
        {position <= 3 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">{position}</span>
          </div>
        )}
      </div>
      
      {/* Name */}
      <div>
        <div className="font-semibold text-white text-sm leading-tight">
          {athlete.name}
        </div>
        {position <= 3 && (
          <div className="text-xs text-gray-300 mt-0.5">
            {position === 1 ? "Champion" : position === 2 ? "Runner-up" : "3rd Place"}
          </div>
        )}
      </div>
      
      {/* Movement Badge */}
      <div className="flex justify-center">
        {getMovementBadge()}
      </div>
      
      {/* Points */}
      <div className="text-right">
        <div className="text-lg font-bold text-blue-300">
          {athlete.points.toLocaleString()}
        </div>
        <div className="text-xs text-gray-300">pts</div>
      </div>
    </div>
  );
};

export default LeaderboardRow;

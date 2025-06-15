
import { Athlete, getPlaceholderImageUrl } from "@/types";
import { ArrowUp, ArrowDown, Minus, Crown, Medal, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LeaderboardRowProps {
  athlete: Athlete;
  position: number;
}

// More vibrant backgrounds and badge colors for the top 10 positions
const rankBgColors = [
  "bg-gradient-to-r from-yellow-500/20 to-yellow-400/5 border-l-4 border-yellow-400",
  "bg-gradient-to-r from-gray-500/20 to-gray-400/5 border-l-4 border-gray-400",
  "bg-gradient-to-r from-amber-500/20 to-amber-400/5 border-l-4 border-amber-600",
  "bg-gradient-to-r from-blue-500/10 to-blue-500/0 border-l-4 border-blue-400",
  "bg-gradient-to-r from-pink-400/10 to-pink-300/5 border-l-4 border-pink-300",
  "bg-gradient-to-r from-green-400/10 to-green-300/5 border-l-4 border-green-300",
  "bg-gradient-to-r from-purple-400/10 to-purple-300/5 border-l-4 border-purple-300",
  "bg-gradient-to-r from-orange-400/10 to-orange-300/5 border-l-4 border-orange-300",
  "bg-gradient-to-r from-teal-400/10 to-teal-300/5 border-l-4 border-teal-300",
  "bg-gradient-to-r from-red-400/10 to-red-300/5 border-l-4 border-red-300",
];

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
    // Top 10 distinct, rest normal
    if (position <= 10) return rankBgColors[position - 1];
    return "hover:bg-white/5";
  };

  const getPlacementLabel = () => {
    if (position === 1) return "Champion";
    if (position === 2) return "2nd Place";
    if (position === 3) return "3rd Place";
    return `${position}th Place`;
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

  // For 1–3 use icon, otherwise show number badge (1–10)
  const renderRankBadge = () => {
    if (position <= 3) return getRankIcon();
    if (position <= 10)
      return (
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-white text-base border-2 ${
            [
              "border-blue-400",
              "border-pink-400",
              "border-green-400",
              "border-purple-400",
              "border-orange-400",
              "border-teal-400",
              "border-red-400",
            ][(position - 4) % 7]
          }`}
          style={{ background: "rgba(255,255,255,0.10)" }}
        >
          {position}
        </span>
      );
    return <span className="text-lg font-bold text-white">{position}</span>;
  };

  return (
    <div
      className={`grid grid-cols-[50px_60px_1fr_60px_80px] gap-3 items-center px-4 py-3 transition-all duration-200 ${getRankStyle()}`}
    >
      {/* Rank */}
      <div className="flex items-center justify-center">
        {renderRankBadge()}
      </div>

      {/* Avatar */}
      <div className="relative">
        <img
          src={getPlaceholderImageUrl(athlete.imageUrl)}
          alt={athlete.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-white/30 shadow-md"
        />
        {position <= 10 && (
          <div
            className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500/80 rounded-full flex items-center justify-center border-2 border-white"
            style={{ minWidth: 20, minHeight: 20 }}
          >
            <span className="text-white text-xs font-bold">{position}</span>
          </div>
        )}
      </div>

      {/* Name */}
      <div>
        <div className="font-semibold text-white text-sm leading-tight">
          {athlete.name}
        </div>
        {position <= 10 && (
          <div className="text-xs text-gray-300 mt-0.5">
            {getPlacementLabel()}
          </div>
        )}
      </div>

      {/* Movement Badge */}
      <div className="flex justify-center">{getMovementBadge()}</div>

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


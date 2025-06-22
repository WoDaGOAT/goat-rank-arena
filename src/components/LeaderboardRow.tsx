
import { Athlete, getPlaceholderImageUrl } from "@/types";
import { ArrowUp, ArrowDown, Minus, Crown, Medal, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { sanitize } from "@/lib/sanitize";

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
      return <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />;
    }
    if (athlete.movement === "down") {
      return <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />;
    }
    return <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />;
  };

  const getRankIcon = () => {
    if (position === 1) return <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
    if (position === 2) return <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />;
    if (position === 3) return <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />;
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
        <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 text-xs px-1.5 py-0.5 sm:px-2">
          <ArrowUp className="w-2 h-2 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
          <span className="hidden sm:inline">Rising</span>
          <span className="sm:hidden">↑</span>
        </Badge>
      );
    }
    if (athlete.movement === "down") {
      return (
        <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30 text-xs px-1.5 py-0.5 sm:px-2">
          <ArrowDown className="w-2 h-2 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
          <span className="hidden sm:inline">Falling</span>
          <span className="sm:hidden">↓</span>
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-xs px-1.5 py-0.5 sm:px-2 bg-white/10 text-gray-300 border-white/30">
        <Minus className="w-2 h-2 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
        <span className="hidden sm:inline">Stable</span>
        <span className="sm:hidden">—</span>
      </Badge>
    );
  };

  // For 1–3 use icon, otherwise show number badge (1–10)
  const renderRankBadge = () => {
    if (position <= 3) return getRankIcon();
    if (position <= 10)
      return (
        <span
          className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full font-bold text-white text-sm sm:text-base border-2 ${
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
    return <span className="text-sm sm:text-lg font-bold text-white">{position}</span>;
  };

  const sanitizedName = sanitize(athlete.name);

  return (
    <>
      {/* Mobile layout */}
      <div className={`flex md:hidden items-center gap-3 px-3 py-4 transition-all duration-200 ${getRankStyle()}`}>
        {/* Rank and Avatar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8">
            {renderRankBadge()}
          </div>
          <Avatar className="w-14 h-14 border-2 border-white/30 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <AvatarImage src={getPlaceholderImageUrl(athlete.imageUrl)} alt={sanitizedName} />
            <AvatarFallback className="bg-white/20 text-white text-lg font-semibold">
              {sanitizedName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Name and placement */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white text-sm leading-tight truncate">
            {sanitizedName}
          </div>
          {position <= 10 && (
            <div className="text-xs text-gray-300 mt-0.5">
              {getPlacementLabel()}
            </div>
          )}
        </div>

        {/* Movement and Points */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-blue-300">
              {athlete.points.toLocaleString()}
            </span>
            <span className="text-xs text-gray-300">pts</span>
          </div>
          {getMovementBadge()}
        </div>
      </div>

      {/* Desktop layout */}
      <div
        className={`hidden md:grid md:grid-cols-[50px_72px_1fr_110px_90px] gap-4 items-center px-4 py-4 transition-all duration-200 ${getRankStyle()}`}
      >
        {/* Rank */}
        <div className="flex items-center justify-center">
          {renderRankBadge()}
        </div>

        {/* Avatar */}
        <div className="relative flex justify-center">
          <Avatar className="w-14 h-14 border-2 border-white/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
            <AvatarImage src={getPlaceholderImageUrl(athlete.imageUrl)} alt={sanitizedName} />
            <AvatarFallback className="bg-white/20 text-white text-lg font-semibold">
              {sanitizedName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Name */}
        <div>
          <div className="font-semibold text-white text-base leading-tight">
            {sanitizedName}
          </div>
          {position <= 10 && (
            <div className="text-sm text-gray-300 mt-0.5">
              {getPlacementLabel()}
            </div>
          )}
        </div>

        {/* Movement Badge */}
        <div className="flex justify-center">{getMovementBadge()}</div>

        {/* Points */}
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-lg font-bold text-blue-300">
            {athlete.points.toLocaleString()}
          </span>
          <span className="text-xs text-gray-300">pts</span>
        </div>
      </div>
    </>
  );
};

export default LeaderboardRow;

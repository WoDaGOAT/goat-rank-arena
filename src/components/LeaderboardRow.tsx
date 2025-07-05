
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Athlete } from "@/types";
import { sanitize } from "@/lib/sanitize";
import { useState } from "react";

interface LeaderboardRowProps {
  athlete: Athlete;
  position: number;
  compact?: boolean;
}

const LeaderboardRow = ({ athlete, position, compact = false }: LeaderboardRowProps) => {
  const [imageError, setImageError] = useState(false);

  const getTrendIcon = () => {
    switch (athlete.movement) {
      case "up":
        return <TrendingUp className="h-3 w-3 min-[425px]:h-4 min-[425px]:w-4 text-green-400" />;
      case "down":
        return <TrendingDown className="h-3 w-3 min-[425px]:h-4 min-[425px]:w-4 text-red-400" />;
      default:
        return <Minus className="h-3 w-3 min-[425px]:h-4 min-[425px]:w-4 text-gray-400" />;
    }
  };

  const getRankStyle = () => {
    if (position === 1) return "text-yellow-400 font-bold text-lg min-[425px]:text-xl";
    if (position === 2) return "text-gray-300 font-bold text-base min-[425px]:text-lg";
    if (position === 3) return "text-orange-400 font-bold text-base min-[425px]:text-lg";
    return "text-gray-400 font-semibold text-sm min-[425px]:text-base";
  };

  const getRankBadge = () => {
    if (position === 1) return "🥇";
    if (position === 2) return "🥈";
    if (position === 3) return "🥉";
    return null;
  };

  const paddingClass = compact 
    ? "px-2 py-2 min-[375px]:px-3 min-[425px]:px-4 min-[425px]:py-3" 
    : "px-2 py-2 min-[375px]:px-3 min-[375px]:py-3 min-[425px]:px-4 min-[425px]:py-4 sm:px-6";

  // Check if image URL is valid and not a broken base64 data URL
  const isValidImageUrl = (url: string | undefined | null) => {
    if (!url) return false;
    if (url.startsWith('data:image') && url.length < 100) return false; // Likely broken base64
    if (url.includes('data:image/jpeg;base64,/9j/') && url.length < 500) return false; // Common broken pattern
    return true;
  };

  const getImageSrc = () => {
    if (imageError || !isValidImageUrl(athlete.imageUrl)) {
      return "/placeholder.svg";
    }
    return athlete.imageUrl;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`${paddingClass} hover:bg-white/5 transition-colors duration-200`}>
      {/* Mobile layout */}
      <div className="md:hidden flex items-center gap-2 min-[375px]:gap-3">
        <div className={`w-6 min-[375px]:w-8 text-center ${getRankStyle()}`}>
          {getRankBadge() || position}
        </div>
        <Avatar className={`border-2 border-white/20 ${compact ? 'h-8 w-8 min-[375px]:h-10 min-[375px]:w-10' : 'h-10 w-10 min-[375px]:h-12 min-[375px]:w-12'}`}>
          <AvatarImage 
            src={getImageSrc()} 
            alt={sanitize(athlete.name)}
            onError={handleImageError}
          />
          <AvatarFallback className="text-xs min-[375px]:text-sm">{sanitize(athlete.name).charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-white truncate ${compact ? 'text-xs min-[375px]:text-sm' : 'text-sm min-[375px]:text-base'}`}>
            {sanitize(athlete.name)}
          </h3>
          <div className="flex items-center gap-1 min-[375px]:gap-2 flex-wrap">
            <Badge variant="secondary" className={`${compact ? 'text-xs px-1.5 py-0.5 min-[375px]:px-2' : 'text-xs min-[375px]:text-sm px-1.5 py-0.5 min-[375px]:px-2'}`}>
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
          <AvatarImage 
            src={getImageSrc()} 
            alt={sanitize(athlete.name)}
            onError={handleImageError}
          />
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

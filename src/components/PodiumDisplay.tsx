
import { Athlete } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Crown } from "lucide-react";
import { sanitize } from "@/lib/sanitize";

interface PodiumDisplayProps {
  athletes: Athlete[];
}

const PodiumDisplay = ({
  athletes
}: PodiumDisplayProps) => {
  if (!athletes || athletes.length === 0) {
    return <div className="flex items-center justify-center h-60 text-center">
        <div className="text-gray-400">
          <div className="text-xl font-medium mb-2">🏆</div>
          <p className="text-sm">Be the first to rank in this category!</p>
        </div>
      </div>;
  }

  const topThree = athletes.slice(0, 3);
  const [first, second, third] = topThree;

  const renderAthlete = (athlete: Athlete, position: number, podiumHeight: string) => {
    const isFirst = position === 1;
    const avatarSize = isFirst ? "w-16 h-16" : "w-14 h-14";
    const nameSize = isFirst ? "text-sm" : "text-xs";
    const badgeColor = position === 1 ? 'bg-yellow-500' : position === 2 ? 'bg-gray-400' : 'bg-amber-600';

    return <div className="flex flex-col items-center">
        {/* Avatar and crown section */}
        <div className="relative mb-3">
          <Avatar className={`${avatarSize} border-2 border-white/30 shadow-lg transition-transform hover:scale-110`}>
            <AvatarImage src={athlete.imageUrl || "/placeholder.svg"} alt={sanitize(athlete.name)} />
            <AvatarFallback className="bg-white/20 text-white text-sm font-semibold">
              {sanitize(athlete.name).charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          {/* Crown for first place */}
          {isFirst && <Crown className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 text-yellow-400 drop-shadow-lg" />}
          
          {/* Position badge */}
          
        </div>
        
        {/* Name with tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className={`${nameSize} font-semibold text-white text-center leading-tight w-16 truncate cursor-help mb-2`}>
                {sanitize(athlete.name)}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">{sanitize(athlete.name)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Points */}
        <div className="text-xs text-white/70 font-medium mb-1">
          {Math.round(athlete.points)} pts
        </div>
        
        {/* Podium base */}
        <div className={`${podiumHeight} w-16 ${badgeColor} rounded-t-lg flex items-end justify-center pb-2 shadow-lg`}>
          <span className="text-white font-bold text-lg">{position}</span>
        </div>
      </div>;
  };

  return <div className="flex items-end justify-center gap-2 h-60 px-4">
      {/* Second place (left) - medium height */}
      {second && renderAthlete(second, 2, "h-16")}
      
      {/* First place (center) - tallest */}
      {first && <div className="flex flex-col items-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-yellow-400/10 rounded-lg blur-sm transform scale-110"></div>
          <div className="relative z-10">
            {renderAthlete(first, 1, "h-24")}
          </div>
        </div>}
      
      {/* Third place (right) - shortest */}
      {third && renderAthlete(third, 3, "h-12")}
    </div>;
};

export default PodiumDisplay;


import { Athlete, getPlaceholderImageUrl } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Crown } from "lucide-react";
import { sanitize } from "@/lib/sanitize";

interface PodiumDisplayProps {
  athletes: Athlete[];
}

const PodiumDisplay = ({ athletes }: PodiumDisplayProps) => {
  if (!athletes || athletes.length === 0) {
    return (
      <div className="flex items-center justify-center h-60 text-center">
        <div className="text-gray-400">
          <div className="text-xl font-medium mb-2">🏆</div>
          <p className="text-sm">Be the first to rank in this category!</p>
        </div>
      </div>
    );
  }

  const topThree = athletes.slice(0, 3);
  const [first, second, third] = topThree;

  const renderAthlete = (athlete: Athlete, position: number, isCenter = false) => {
    const sizeClass = isCenter ? "w-20 h-20" : "w-16 h-16";
    const nameSize = isCenter ? "text-base" : "text-sm";
    const containerHeight = isCenter ? "h-24" : "h-20";
    const nameWidth = isCenter ? "max-w-20" : "max-w-16";
    
    return (
      <div className={`flex flex-col items-center ${containerHeight} justify-end`}>
        <div className="relative mb-3">
          <Avatar className={`${sizeClass} border-2 border-white/30 shadow-lg transition-transform hover:scale-110`}>
            <AvatarImage 
              src={getPlaceholderImageUrl(athlete.imageUrl)} 
              alt={sanitize(athlete.name)} 
            />
            <AvatarFallback className="bg-white/20 text-white text-sm font-semibold">
              {sanitize(athlete.name).charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          {/* Position badge */}
          <div className={`absolute -top-2 -right-2 ${
            position === 1 ? 'bg-yellow-500' : position === 2 ? 'bg-gray-400' : 'bg-amber-600'
          } text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-md`}>
            #{position}
          </div>
          
          {/* Crown for first place */}
          {position === 1 && (
            <Crown className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-5 h-5 text-yellow-400 drop-shadow-lg" />
          )}
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className={`${nameSize} font-medium text-white text-center leading-tight ${nameWidth} truncate cursor-help`}>
                {sanitize(athlete.name)}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">{sanitize(athlete.name)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  };

  return (
    <div className="flex items-end justify-center gap-3 sm:gap-4 md:gap-6 h-60 px-2 sm:px-4">
      {/* Second place (left) */}
      {second && (
        <div className="flex flex-col items-center">
          {renderAthlete(second, 2)}
        </div>
      )}
      
      {/* First place (center) */}
      {first && (
        <div className="flex flex-col items-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-yellow-400/10 rounded-lg blur-sm transform scale-110"></div>
          <div className="relative z-10">
            {renderAthlete(first, 1, true)}
          </div>
        </div>
      )}
      
      {/* Third place (right) */}
      {third && (
        <div className="flex flex-col items-center">
          {renderAthlete(third, 3)}
        </div>
      )}
    </div>
  );
};

export default PodiumDisplay;

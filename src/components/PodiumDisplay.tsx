
import { Athlete, getPlaceholderImageUrl } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Crown } from "lucide-react";
import { sanitize } from "@/lib/sanitize";

interface PodiumDisplayProps {
  athletes: Athlete[];
}

const PodiumDisplay = ({ athletes }: PodiumDisplayProps) => {
  if (!athletes || athletes.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-center">
        <div className="text-gray-400">
          <div className="text-lg font-medium mb-2">🏆</div>
          <p className="text-sm">Be the first to rank in this category!</p>
        </div>
      </div>
    );
  }

  const topThree = athletes.slice(0, 3);
  const [first, second, third] = topThree;

  const renderAthlete = (athlete: Athlete, position: number, isCenter = false) => {
    const sizeClass = isCenter ? "w-16 h-16" : "w-12 h-12";
    const nameSize = isCenter ? "text-sm" : "text-xs";
    const containerHeight = isCenter ? "h-20" : "h-16";
    
    return (
      <div className={`flex flex-col items-center ${containerHeight} justify-end`}>
        <div className="relative mb-2">
          <Avatar className={`${sizeClass} border-2 border-white/30 shadow-lg transition-transform hover:scale-110`}>
            <AvatarImage 
              src={getPlaceholderImageUrl(athlete.imageUrl)} 
              alt={sanitize(athlete.name)} 
            />
            <AvatarFallback className="bg-white/20 text-white text-xs font-semibold">
              {sanitize(athlete.name).charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          {/* Position badge */}
          <div className={`absolute -top-1 -right-1 ${
            position === 1 ? 'bg-yellow-500' : position === 2 ? 'bg-gray-400' : 'bg-amber-600'
          } text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white`}>
            #{position}
          </div>
          
          {/* Crown for first place */}
          {position === 1 && (
            <Crown className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 text-yellow-400" />
          )}
        </div>
        
        <p className={`${nameSize} font-medium text-white text-center leading-tight max-w-16 truncate`}>
          {sanitize(athlete.name)}
        </p>
      </div>
    );
  };

  return (
    <div className="flex items-end justify-center gap-4 h-48 px-4">
      {/* Second place (left) */}
      {second && (
        <div className="flex flex-col items-center">
          {renderAthlete(second, 2)}
        </div>
      )}
      
      {/* First place (center) */}
      {first && (
        <div className="flex flex-col items-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-yellow-400/5 rounded-lg blur-sm"></div>
          {renderAthlete(first, 1, true)}
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

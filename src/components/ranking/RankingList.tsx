
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";
import React from "react";
import { Athlete, getPlaceholderImageUrl } from "@/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface SelectedAthlete extends Athlete {
  userPoints: number;
  error?: string | null;
}

interface RankingListProps {
  selectedAthletes: SelectedAthlete[];
  handleDragStart: (index: number) => void;
  handleDragOver: (e: React.DragEvent, index: number) => void;
  handleDragEnd: () => void;
  updateAthletePoints: (athleteId: string, points: number) => void;
  removeAthlete: (athleteId: string) => void;
}

const RankingList: React.FC<RankingListProps> = ({
  selectedAthletes,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  updateAthletePoints,
  removeAthlete,
}) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-3 sm:p-4 md:p-6">
    <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
      Your Ranking ({selectedAthletes.length}/10 athletes)
    </h2>
    {selectedAthletes.length === 0 ? (
      <div className="text-center py-8 sm:py-12 text-gray-400">
        <Search className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-50" />
        <p className="text-sm sm:text-lg">
          Start by searching and adding athletes to your ranking
        </p>
      </div>
    ) : (
      <div className="space-y-2 sm:space-y-3 max-h-[calc(10*64px)] sm:max-h-[calc(10*76px)] overflow-y-auto pr-1 sm:pr-2">
        {selectedAthletes.map((athlete, index) => (
          <div
            key={athlete.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 bg-white/5 rounded-lg border border-white/20 cursor-move hover:bg-white/10 transition-colors group"
          >
            <div className="text-sm font-bold text-white w-6 text-center">
              {index + 1}
            </div>
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-white/30">
              <AvatarImage src={getPlaceholderImageUrl(athlete.imageUrl)} alt={athlete.name} />
              <AvatarFallback className="bg-white/20 text-white text-xs sm:text-sm">
                {athlete.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-sm sm:text-base truncate">{athlete.name}</div>
              {athlete.error && (
                <p className="text-xs text-red-400 mt-1">{athlete.error}</p>
              )}
            </div>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <Input
                type="number"
                value={athlete.userPoints}
                onChange={(e) =>
                  updateAthletePoints(
                    athlete.id,
                    parseInt(e.target.value) || 0
                  )
                }
                className={cn(
                  "w-14 sm:w-20 h-8 sm:h-9 text-center bg-white/10 border-white/30 text-white text-xs sm:text-sm",
                  athlete.error && "border-red-500 focus-visible:ring-red-500"
                )}
                min="0"
                max="100"
              />
              <span className="text-xs text-gray-300 hidden sm:inline">pts</span>
            </div>
            <Button
              onClick={() => removeAthlete(athlete.id)}
              size="sm"
              variant="outline"
              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white h-8 w-8 p-0 shrink-0"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default RankingList;

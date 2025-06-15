
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";
import React from "react";
import { Athlete } from "@/types";
import { cn } from "@/lib/utils";

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
  <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6">
    <h2 className="text-xl font-semibold text-white mb-4">
      Your Ranking ({selectedAthletes.length}/10 athletes)
    </h2>
    {selectedAthletes.length === 0 ? (
      <div className="text-center py-12 text-gray-400">
        <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg">
          Start by searching and adding athletes to your ranking
        </p>
      </div>
    ) : (
      <div className="space-y-3 max-h-[calc(10*76px)] overflow-y-auto pr-2">
        {selectedAthletes.map((athlete, index) => (
          <div
            key={athlete.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/20 cursor-move hover:bg-white/10 transition-colors group"
          >
            <img
              src={athlete.imageUrl ? `https://images.unsplash.com/${athlete.imageUrl}?w=400&h=225&fit=crop&q=80` : '/placeholder.svg'}
              alt={athlete.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
            />
            <div className="flex-1">
              <div className="font-semibold text-white">{athlete.name}</div>
              {athlete.error && (
                <p className="text-xs text-red-400 mt-1">{athlete.error}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
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
                  "w-20 h-9 text-center bg-white/10 border-white/30 text-white text-sm",
                  athlete.error && "border-red-500 focus-visible:ring-red-500"
                )}
                min="0"
                max="100"
              />
              <span className="text-xs text-gray-300">pts</span>
            </div>
            <Button
              onClick={() => removeAthlete(athlete.id)}
              size="sm"
              variant="outline"
              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default RankingList;

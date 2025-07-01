
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { FOOTBALL_POSITIONS } from "@/constants/positions";

interface PositionsManagerProps {
  positions: string[];
  onPositionsChange: (positions: string[]) => void;
}

export const PositionsManager = ({ positions, onPositionsChange }: PositionsManagerProps) => {
  const [selectedPosition, setSelectedPosition] = useState("");

  const addPosition = () => {
    if (selectedPosition && !positions.includes(selectedPosition)) {
      onPositionsChange([...positions, selectedPosition]);
      setSelectedPosition("");
    }
  };

  const removePosition = (position: string) => {
    onPositionsChange(positions.filter(p => p !== position));
  };

  return (
    <div className="space-y-3">
      <FormLabel>Positions</FormLabel>
      <div className="flex gap-2">
        <Select value={selectedPosition} onValueChange={setSelectedPosition}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select a position" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
            {FOOTBALL_POSITIONS.map((position) => (
              <SelectItem key={position} value={position} className="hover:bg-gray-100">
                {position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          type="button" 
          onClick={addPosition} 
          size="sm"
          disabled={!selectedPosition || positions.includes(selectedPosition)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {positions.map((position) => (
          <Badge key={position} variant="secondary" className="flex items-center gap-1">
            {position}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => removePosition(position)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};

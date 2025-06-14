
import { Athlete, getPlaceholderImageUrl } from "@/types";
import { ArrowUp, ArrowDown } from "lucide-react"; // Using specific icons as per instruction
import { Minus } from "lucide-react"; // For neutral

interface LeaderboardRowProps {
  athlete: Athlete;
}

const LeaderboardRow = ({ athlete }: LeaderboardRowProps) => {
  const MovementIcon = () => {
    if (athlete.movement === "up") {
      return <ArrowUp className="w-5 h-5 text-arrow-up" />;
    }
    if (athlete.movement === "down") {
      return <ArrowDown className="w-5 h-5 text-arrow-down" />;
    }
    return <Minus className="w-5 h-5 text-arrow-neutral" />; // Using Minus for neutral
  };

  return (
    <div className="grid grid-cols-[auto_60px_1fr_auto_auto] gap-4 items-center p-3 border-b border-border last:border-b-0 hover:bg-secondary/50 transition-colors">
      <div className="text-lg font-semibold text-center w-8">{athlete.rank}</div>
      <img
        src={getPlaceholderImageUrl(athlete.imageUrl)}
        alt={athlete.name}
        className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
      />
      <div className="font-medium text-foreground">{athlete.name}</div>
      <div className="flex justify-center">
        <MovementIcon />
      </div>
      <div className="text-lg font-semibold text-primary text-right min-w-[80px]">
        {athlete.points.toLocaleString()}
      </div>
    </div>
  );
};

export default LeaderboardRow;

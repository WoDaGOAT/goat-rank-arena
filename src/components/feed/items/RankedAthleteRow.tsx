
import { getPlaceholderImageUrl } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RankedAthlete } from "./NewRankingFeedItem";

interface RankedAthleteRowProps {
  athlete: RankedAthlete;
}

const RankedAthleteRow = ({ athlete }: RankedAthleteRowProps) => {
    return (
        <div className="flex items-center gap-4 py-2 px-4 hover:bg-white/10 transition-colors rounded-md">
            <div className="w-6 text-center text-lg font-bold text-gray-400">{athlete.position}</div>
            <Avatar className="h-10 w-10 border-2 border-white/20">
                <AvatarImage src={getPlaceholderImageUrl(athlete.imageUrl)} />
                <AvatarFallback>{athlete.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow font-semibold text-white">{athlete.name}</div>
            <div className="text-lg font-bold text-blue-300">{athlete.points}<span className="text-xs text-gray-400 ml-1">pts</span></div>
        </div>
    );
};

export default RankedAthleteRow;


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RankedAthlete } from "@/types/userRanking";
import { useState } from "react";

interface RankedAthleteRowProps {
  athlete: RankedAthlete;
}

const RankedAthleteRow = ({ athlete }: RankedAthleteRowProps) => {
  const [imageError, setImageError] = useState(false);

  // Improved image URL validation - consistent with LeaderboardRow
  const isValidImageUrl = (url: string | undefined | null) => {
    if (!url) return false;
    // Allow HTTPS URLs
    if (url.startsWith('https://')) return true;
    // Allow base64 data URLs (be less restrictive than before)
    if (url.startsWith('data:image/')) return true;
    return false;
  };

  const getImageSrc = () => {
    if (imageError || !isValidImageUrl(athlete.imageUrl)) {
      return "/placeholder.svg";
    }
    return athlete.imageUrl;
  };

  const handleImageError = () => {
    console.log(`🖼️ Image failed to load for ranked athlete: ${athlete.name}, URL: ${athlete.imageUrl}`);
    setImageError(true);
  };

  return (
    <div className="flex items-center gap-4 py-2 px-4 hover:bg-white/10 transition-colors rounded-md">
      <div className="w-6 text-center text-lg font-bold text-gray-400">{athlete.position}</div>
      <Avatar className="h-10 w-10 border-2 border-white/20">
        <AvatarImage 
          src={getImageSrc()} 
          onError={handleImageError}
        />
        <AvatarFallback>{athlete.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-grow font-semibold text-white">{athlete.name}</div>
    </div>
  );
};

export default RankedAthleteRow;

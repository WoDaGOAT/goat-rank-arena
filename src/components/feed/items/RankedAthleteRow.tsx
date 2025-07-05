
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RankedAthlete } from "@/types/userRanking";
import { useState } from "react";

interface RankedAthleteRowProps {
  athlete: RankedAthlete;
}

const RankedAthleteRow = ({ athlete }: RankedAthleteRowProps) => {
  const [imageError, setImageError] = useState(false);

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

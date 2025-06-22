
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart } from "lucide-react";
import FriendButton from "./FriendButton";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  country: string | null;
  favorite_sports: string[] | null;
}

interface EnhancedProfileHeaderProps {
  profile: Profile;
  isOwnProfile: boolean;
}

const EnhancedProfileHeader = ({ profile, isOwnProfile }: EnhancedProfileHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || ''} />
        <AvatarFallback className="text-2xl">{profile.full_name?.charAt(0) || 'U'}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <h2 className="text-2xl font-bold">{profile.full_name || 'Anonymous User'}</h2>
        
        {profile.country && (
          <div className="flex items-center gap-1 text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{profile.country}</span>
          </div>
        )}
        
        {profile.favorite_sports && profile.favorite_sports.length > 0 && (
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-400" />
            <div className="flex flex-wrap gap-1">
              {profile.favorite_sports.map((sport: string) => (
                <Badge key={sport} variant="secondary" className="text-xs">
                  {sport}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {!isOwnProfile && (
        <div className="w-full sm:w-auto">
          <FriendButton userId={profile.id} />
        </div>
      )}
    </div>
  );
};

export default EnhancedProfileHeader;

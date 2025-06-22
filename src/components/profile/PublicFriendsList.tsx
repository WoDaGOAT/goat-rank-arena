
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { usePublicFriends } from "@/hooks/usePublicFriends";
import { Users } from "lucide-react";

interface PublicFriendsListProps {
  userId: string;
  isOwnProfile: boolean;
}

const PublicFriendsList = ({ userId, isOwnProfile }: PublicFriendsListProps) => {
  const { data: friends, isLoading } = usePublicFriends(userId);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <Users className="w-5 h-5" />
        Friends {friends && friends.length > 0 && `(${friends.length})`}
      </h3>
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
              <Skeleton className="h-4 w-16 bg-white/10" />
            </div>
          ))}
        </div>
      ) : friends && friends.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {friends.map(friend => (
            <Link 
              key={friend.id} 
              to={`/users/${friend.id}`}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-white/10 transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={friend.avatar_url || undefined} alt={friend.full_name || 'User'} />
                <AvatarFallback className="text-xs">
                  {friend.full_name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium truncate">{friend.full_name || 'Anonymous'}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm">
          {isOwnProfile ? "You haven't added any friends yet." : "This user hasn't added any friends yet."}
        </p>
      )}
    </div>
  );
};

export default PublicFriendsList;

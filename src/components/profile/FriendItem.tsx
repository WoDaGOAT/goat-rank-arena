
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Friend {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface FriendItemProps {
  friend: Friend;
  onRemove: (friendshipId: string) => void;
  isRemoving: boolean;
  friendshipId: string;
}

const FriendItem = ({ friend, onRemove, isRemoving, friendshipId }: FriendItemProps) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-white/10">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={friend.avatar_url || undefined} alt={friend.full_name || 'User'} />
          <AvatarFallback>{friend.full_name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{friend.full_name || 'Anonymous User'}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(friendshipId)}
        disabled={isRemoving}
        className="text-gray-400 hover:text-red-500 hover:bg-red-500/10"
        aria-label="Remove friend"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default FriendItem;

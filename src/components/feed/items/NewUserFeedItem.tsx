
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { sanitize } from "@/lib/sanitize";
import { UserPlus } from "lucide-react";
import { useFriendshipStatus } from "@/hooks/useFriendshipStatus";
import { useAuthState } from "@/hooks/useAuthState";
import { useFriendActions } from "@/hooks/useFriendActions";

export interface NewUserFeedData {
  user_id: string;
  user_name: string;
  avatar_url: string | null;
}

interface NewUserFeedItemProps {
  data: NewUserFeedData;
  createdAt: string;
}

const NewUserFeedItem = ({ data, createdAt }: NewUserFeedItemProps) => {
  const { user } = useAuthState();
  const { data: friendshipStatus } = useFriendshipStatus(user?.id, data.user_id);
  const { sendFriendRequest, cancelFriendRequest } = useFriendActions();
  
  // Don't render if we don't have a valid user name
  if (!data.user_name || data.user_name.trim() === '') {
    return null;
  }
  
  const sanitizedUserName = sanitize(data.user_name);

  const handleSendFriendRequest = () => {
    sendFriendRequest.mutate(data.user_id);
  };

  const handleCancelFriendRequest = () => {
    cancelFriendRequest.mutate(data.user_id);
  };

  const getFriendshipButtonText = () => {
    if (!friendshipStatus) return "Add Friend";
    
    switch (friendshipStatus.status) {
      case 'pending':
        return friendshipStatus.requester_id === user?.id ? "Cancel Request" : "Accept Request";
      case 'accepted':
        return "Friends";
      case 'declined':
      case 'blocked':
        return "Unavailable";
      default:
        return "Add Friend";
    }
  };

  const getButtonAction = () => {
    if (!friendshipStatus) return handleSendFriendRequest;
    
    if (friendshipStatus.status === 'pending' && friendshipStatus.requester_id === user?.id) {
      return handleCancelFriendRequest;
    }
    
    return handleSendFriendRequest;
  };

  const canPerformAction = () => {
    if (!user || user.id === data.user_id) return false;
    if (!friendshipStatus) return true;
    
    // Can cancel if user sent a pending request
    if (friendshipStatus.status === 'pending' && friendshipStatus.requester_id === user.id) {
      return true;
    }
    
    // Can accept if user received a pending request
    if (friendshipStatus.status === 'pending' && friendshipStatus.requester_id !== user.id) {
      return true;
    }
    
    return false;
  };

  return (
    <Card className="bg-white/5 text-white border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-start gap-4 mb-3">
          <Link to={`/users/${data.user_id}`}>
            <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage src={data.avatar_url || undefined} alt={sanitizedUserName} />
              <AvatarFallback>{sanitizedUserName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <p className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-green-400" />
              <Link to={`/users/${data.user_id}`} className="font-bold hover:underline hover:text-blue-300 transition-colors">
                {sanitizedUserName}
              </Link>
              {' '} joined WoDaGOAT
            </p>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>
          {user && user.id !== data.user_id && (
            <Button
              onClick={getButtonAction()}
              disabled={!canPerformAction() || sendFriendRequest.isPending || cancelFriendRequest.isPending}
              variant={friendshipStatus?.status === 'accepted' ? "secondary" : "default"}
              size="sm"
              className="text-xs"
            >
              {sendFriendRequest.isPending || cancelFriendRequest.isPending ? "Loading..." : getFriendshipButtonText()}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewUserFeedItem;


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { sanitize } from "@/lib/sanitize";
import { UserPlus } from "lucide-react";
import { useFriendshipStatus } from "@/hooks/useFriendshipStatus";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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
  
  const sanitizedUserName = sanitize(data.user_name);

  const handleSendFriendRequest = async () => {
    if (!user) {
      toast.error("Please log in to send friend requests");
      return;
    }

    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          requester_id: user.id,
          receiver_id: data.user_id,
          status: 'pending'
        });

      if (error) throw error;
      
      toast.success("Friend request sent!");
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error("Failed to send friend request");
    }
  };

  const getFriendshipButtonText = () => {
    if (!friendshipStatus) return "Add Friend";
    
    switch (friendshipStatus.status) {
      case 'pending':
        return friendshipStatus.requester_id === user?.id ? "Request Sent" : "Accept Request";
      case 'accepted':
        return "Friends";
      case 'declined':
      case 'blocked':
        return "Unavailable";
      default:
        return "Add Friend";
    }
  };

  const canSendFriendRequest = () => {
    return !friendshipStatus && user?.id !== data.user_id;
  };

  return (
    <Card className="bg-white/5 text-white border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-start gap-4 mb-3">
          <Link to={`/users/${data.user_id}`}>
            <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage src={data.avatar_url || undefined} alt={sanitizedUserName || 'User'} />
              <AvatarFallback>{sanitizedUserName?.charAt(0) || 'U'}</AvatarFallback>
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
              onClick={handleSendFriendRequest}
              disabled={!canSendFriendRequest()}
              variant={friendshipStatus?.status === 'accepted' ? "secondary" : "default"}
              size="sm"
              className="text-xs"
            >
              {getFriendshipButtonText()}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewUserFeedItem;

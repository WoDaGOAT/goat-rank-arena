
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, UserX, Clock } from "lucide-react";
import { useFriendshipStatus } from "@/hooks/useFriendshipStatus";
import { useFriendActions } from "@/hooks/useFriendActions";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface FriendButtonProps {
  userId: string;
}

const FriendButton = ({ userId }: FriendButtonProps) => {
  const { user: currentUser, openLoginDialog } = useAuth();
  const { data: friendship, isLoading } = useFriendshipStatus(currentUser?.id, userId);
  const { sendFriendRequest, acceptFriendRequest, removeFriend } = useFriendActions();

  if (!currentUser) {
    return (
      <Button onClick={openLoginDialog} className="flex items-center gap-2">
        <UserPlus className="w-4 h-4" />
        Add Friend
      </Button>
    );
  }

  if (currentUser.id === userId) {
    return null;
  }

  if (isLoading) {
    return <Skeleton className="h-10 w-32 bg-white/10" />;
  }

  const handleSendRequest = () => {
    sendFriendRequest.mutate(userId);
  };

  const handleAcceptRequest = () => {
    if (friendship?.id) {
      acceptFriendRequest.mutate(friendship.id);
    }
  };

  const handleRemoveFriend = () => {
    if (friendship?.id) {
      removeFriend.mutate(friendship.id);
    }
  };

  const status = friendship?.status;
  const isRequestReceived = status === 'pending' && friendship?.requester_id === userId;
  const isRequestSent = status === 'pending' && friendship?.requester_id === currentUser.id;

  if (status === 'accepted') {
    return (
      <Button variant="outline" onClick={handleRemoveFriend} className="flex items-center gap-2">
        <UserCheck className="w-4 h-4" />
        Friends
      </Button>
    );
  }

  if (isRequestReceived) {
    return (
      <Button onClick={handleAcceptRequest} className="flex items-center gap-2">
        <UserCheck className="w-4 h-4" />
        Accept Request
      </Button>
    );
  }

  if (isRequestSent) {
    return (
      <Button variant="outline" disabled className="flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Request Sent
      </Button>
    );
  }

  if (status === 'blocked') {
    return (
      <Button variant="destructive" disabled className="flex items-center gap-2">
        <UserX className="w-4 h-4" />
        Blocked
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleSendRequest} 
      disabled={sendFriendRequest.isPending}
      className="flex items-center gap-2"
    >
      <UserPlus className="w-4 h-4" />
      {sendFriendRequest.isPending ? "Sending..." : "Add Friend"}
    </Button>
  );
};

export default FriendButton;

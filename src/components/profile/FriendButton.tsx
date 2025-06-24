
import { Button } from "@/components/ui/button";
import { useFriendshipStatus } from "@/hooks/useFriendshipStatus";
import { useFriendActions } from "@/hooks/useFriendActions";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus, Clock, Check, UserMinus, X } from "lucide-react";

interface FriendButtonProps {
  userId: string;
}

const FriendButton = ({ userId }: FriendButtonProps) => {
  const { user } = useAuth();
  const { data: friendshipStatus } = useFriendshipStatus(user?.id, userId);
  const { sendFriendRequest, cancelFriendRequest, acceptFriendRequest, removeFriend } = useFriendActions();

  if (!user || user.id === userId) {
    return null;
  }

  const getButtonContent = () => {
    if (sendFriendRequest.isPending || cancelFriendRequest.isPending) {
      return {
        text: "Loading...",
        icon: Clock,
        variant: "secondary" as const,
        disabled: true
      };
    }

    if (!friendshipStatus) {
      return {
        text: "Add Friend",
        icon: UserPlus,
        variant: "default" as const,
        disabled: false,
        onClick: () => sendFriendRequest.mutate(userId)
      };
    }

    switch (friendshipStatus.status) {
      case 'pending':
        if (friendshipStatus.requester_id === user.id) {
          return {
            text: "Cancel Request",
            icon: X,
            variant: "secondary" as const,
            disabled: false,
            onClick: () => cancelFriendRequest.mutate(userId)
          };
        } else {
          return {
            text: "Accept Request",
            icon: Check,
            variant: "default" as const,
            disabled: false,
            onClick: () => acceptFriendRequest.mutate(friendshipStatus.id)
          };
        }
      case 'accepted':
        return {
          text: "Friends",
          icon: Check,
          variant: "outline" as const,
          disabled: false,
          onClick: () => removeFriend.mutate(friendshipStatus.id)
        };
      case 'blocked':
        return {
          text: "Blocked",
          icon: UserMinus,
          variant: "destructive" as const,
          disabled: true
        };
      default:
        return {
          text: "Add Friend",
          icon: UserPlus,
          variant: "default" as const,
          disabled: false,
          onClick: () => sendFriendRequest.mutate(userId)
        };
    }
  };

  const buttonConfig = getButtonContent();
  const IconComponent = buttonConfig.icon;

  return (
    <Button
      variant={buttonConfig.variant}
      disabled={buttonConfig.disabled}
      onClick={buttonConfig.onClick}
      className="w-full sm:w-auto bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 font-medium"
    >
      <IconComponent className="w-4 h-4 mr-2" />
      {buttonConfig.text}
    </Button>
  );
};

export default FriendButton;

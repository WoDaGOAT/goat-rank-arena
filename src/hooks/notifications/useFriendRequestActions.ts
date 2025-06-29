
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { friendRequestService } from "./friendRequestService";

export const useFriendRequestActions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const acceptFriendRequest = useMutation({
    mutationFn: friendRequestService.acceptFriendRequest,
    onSuccess: (friendshipId) => {
      toast({
        title: "Friend request accepted!",
        description: "You are now friends and can see each other's activity.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications-count', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['friendship-status'] });
      queryClient.invalidateQueries({ queryKey: ['publicFriends'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to accept friend request",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const declineFriendRequest = useMutation({
    mutationFn: friendRequestService.declineFriendRequest,
    onSuccess: (friendshipId) => {
      toast({
        title: "Friend request declined",
        description: "The friend request has been declined.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications-count', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['friendship-status'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to decline friend request",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  return {
    acceptFriendRequest: acceptFriendRequest.mutate,
    isAccepting: acceptFriendRequest.isPending,
    declineFriendRequest: declineFriendRequest.mutate,
    isDeclining: declineFriendRequest.isPending,
  };
};


import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useFriendActions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const sendFriendRequest = useMutation({
    mutationFn: async (receiverId: string) => {
      if (!user) throw new Error('You must be logged in to send friend requests.');
      
      const { error } = await supabase.from('friendships').insert({
        requester_id: user.id,
        receiver_id: receiverId,
      });

      if (error) {
        if (error.code === '23505') {
          throw new Error('Friend request already sent or you are already friends.');
        }
        throw new Error('Failed to send friend request.');
      }
    },
    onSuccess: (_, receiverId) => {
      toast({
        title: "Friend request sent!",
        description: "Your friend request has been sent successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['friendship-status', user?.id, receiverId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send friend request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const cancelFriendRequest = useMutation({
    mutationFn: async (receiverId: string) => {
      if (!user) throw new Error('You must be logged in to cancel friend requests.');
      
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('requester_id', user.id)
        .eq('receiver_id', receiverId)
        .eq('status', 'pending');

      if (error) throw new Error('Failed to cancel friend request.');
    },
    onSuccess: (_, receiverId) => {
      toast({
        title: "Friend request cancelled",
        description: "Your friend request has been cancelled.",
      });
      queryClient.invalidateQueries({ queryKey: ['friendship-status', user?.id, receiverId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to cancel friend request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const acceptFriendRequest = useMutation({
    mutationFn: async (friendshipId: string) => {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', friendshipId);

      if (error) throw new Error('Failed to accept friend request.');
    },
    onSuccess: () => {
      toast({
        title: "Friend request accepted!",
        description: "You are now friends and can see each other's activity.",
      });
      queryClient.invalidateQueries({ queryKey: ['friendship-status'] });
      queryClient.invalidateQueries({ queryKey: ['publicFriends'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to accept friend request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeFriend = useMutation({
    mutationFn: async (friendshipId: string) => {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);

      if (error) throw new Error('Failed to remove friend.');
    },
    onSuccess: () => {
      toast({
        title: "Friend removed",
        description: "You are no longer friends with this user.",
      });
      queryClient.invalidateQueries({ queryKey: ['friendship-status'] });
      queryClient.invalidateQueries({ queryKey: ['publicFriends'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove friend",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    removeFriend,
  };
};

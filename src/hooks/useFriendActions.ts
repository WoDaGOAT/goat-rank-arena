
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
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
      toast.success('Friend request sent!');
      queryClient.invalidateQueries({ queryKey: ['friendshipStatus', user?.id, receiverId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
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
      toast.success('Friend request accepted!');
      queryClient.invalidateQueries({ queryKey: ['friendshipStatus'] });
      queryClient.invalidateQueries({ queryKey: ['publicFriends'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
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
      toast.success('Friend removed.');
      queryClient.invalidateQueries({ queryKey: ['friendshipStatus'] });
      queryClient.invalidateQueries({ queryKey: ['publicFriends'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
  };
};

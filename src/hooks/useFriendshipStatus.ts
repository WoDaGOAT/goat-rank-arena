
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface FriendshipStatus {
  id: string;
  status: string;
  requester_id: string;
}

export const useFriendshipStatus = (currentUserId: string | undefined, otherUserId: string | undefined) => {
  return useQuery<FriendshipStatus | null>({
    queryKey: ['friendship-status', currentUserId, otherUserId],
    queryFn: async () => {
      if (!currentUserId || !otherUserId || currentUserId === otherUserId) {
        return null;
      }

      const { data, error } = await supabase
        .from('friendships')
        .select('id, status, requester_id')
        .or(`and(requester_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`)
        .maybeSingle();

      if (error) {
        console.error('Error fetching friendship status:', error);
        return null;
      }

      return data;
    },
    enabled: !!currentUserId && !!otherUserId && currentUserId !== otherUserId,
  });
};

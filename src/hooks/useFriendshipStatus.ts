
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useFriendshipStatus = (currentUserId: string | undefined, otherUserId: string | undefined) => {
  return useQuery({
    queryKey: ['friendship-status', currentUserId, otherUserId],
    queryFn: async () => {
      if (!currentUserId || !otherUserId || currentUserId === otherUserId) {
        return null;
      }

      const { data, error } = await supabase
        .from('friendships')
        .select('status, requester_id')
        .or(`and(requester_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`)
        .maybeSingle(); // Use maybeSingle instead of single to handle no results

      if (error) {
        console.error('Error fetching friendship status:', error);
        return null;
      }

      return data;
    },
    enabled: !!currentUserId && !!otherUserId && currentUserId !== otherUserId,
  });
};

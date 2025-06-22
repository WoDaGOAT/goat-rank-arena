
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface PublicFriend {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

export const usePublicFriends = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['publicFriends', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          requester:requester_id(id, full_name, avatar_url),
          receiver:receiver_id(id, full_name, avatar_url)
        `)
        .eq('status', 'accepted')
        .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`);

      if (error) {
        console.error('Error fetching public friends:', error);
        return [];
      }
      
      if (!data) return [];
      
      const friends: PublicFriend[] = data
        .map(f => {
          const requester = Array.isArray(f.requester) ? f.requester[0] : f.requester;
          const receiver = Array.isArray(f.receiver) ? f.receiver[0] : f.receiver;
          
          if (!requester || !receiver) return null;

          // Return the friend (not the user themselves)
          const friend = requester.id === userId ? receiver : requester;
          return friend;
        })
        .filter((f): f is PublicFriend => f !== null);

      return friends;
    },
    enabled: !!userId,
  });
};

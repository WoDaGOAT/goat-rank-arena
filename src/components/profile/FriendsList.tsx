import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import FriendItem from './FriendItem';
import { Users } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface Friendship {
  id: string;
  requester: Profile;
  receiver: Profile;
}

const FriendsList = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: friendships, isLoading } = useQuery<Friendship[]>({
    queryKey: ['friends', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Add `!` to get single objects instead of arrays for related tables.
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          requester:requester_id(id, full_name, avatar_url)!,
          receiver:receiver_id(id, full_name, avatar_url)!
        `)
        .eq('status', 'accepted')
        .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (error) {
        toast.error('Failed to fetch friends.');
        console.error('Error fetching friends:', error);
        return [];
      }
      if (!data) return [];
      
      // With the `!` hint, Supabase returns objects. We filter out any nulls.
      const validFriendships = data.filter(
        (f): f is Friendship => f.requester !== null && f.receiver !== null
      );

      return validFriendships;
    },
    enabled: !!user,
  });

  const { mutate: removeFriend, isPending: isRemoving } = useMutation({
    mutationFn: async (friendshipId: string) => {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);

      if (error) {
        throw new Error('Could not remove friend.');
      }
    },
    onSuccess: () => {
      toast.success('Friend removed.');
      queryClient.invalidateQueries({ queryKey: ['friends', user?.id] });
    },
    onError: (e: Error) => {
      toast.error(e.message);
    }
  });

  const friends = friendships?.map(f => {
    const friendProfile = f.requester.id === user?.id ? f.receiver : f.requester;
    return {
      friendshipId: f.id,
      ...friendProfile,
    };
  }) || [];

  return (
    <div className="pt-4">
      <h3 className="text-xl font-semibold pb-4 flex items-center gap-2">
        <Users className="w-5 h-5" />
        Friends
      </h3>
      <div>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full bg-gray-700/50 rounded-md" />
            <Skeleton className="h-12 w-full bg-gray-700/50 rounded-md" />
          </div>
        ) : friends.length > 0 ? (
          <div className="space-y-1">
            {friends.map(friend => (
              <FriendItem
                key={friend.id}
                friend={friend}
                onRemove={removeFriend}
                isRemoving={isRemoving}
                friendshipId={friend.friendshipId}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">You haven't added any friends yet.</p>
        )}
      </div>
    </div>
  );
};

export default FriendsList;

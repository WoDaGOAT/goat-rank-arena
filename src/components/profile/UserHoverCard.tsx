
import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface UserHoverCardProps {
  user: User;
  children: React.ReactNode;
}

const UserHoverCard = ({ user, children }: UserHoverCardProps) => {
  const { user: currentUser, openLoginDialog } = useAuth();
  const queryClient = useQueryClient();

  const { data: friendship, isLoading: isLoadingStatus } = useQuery<{ status: string; requester_id: string } | null>({
    queryKey: ['friendshipStatus', currentUser?.id, user.id],
    queryFn: async () => {
      if (!currentUser || currentUser.id === user.id) return null;

      const { data, error } = await supabase
        .from('friendships')
        .select('status, requester_id')
        .or(`and(requester_id.eq.${currentUser.id},receiver_id.eq.${user.id}),and(requester_id.eq.${user.id},receiver_id.eq.${currentUser.id})`)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
          console.error('Error fetching friendship status:', error);
          toast.error("Could not check friendship status.");
          return null;
      }
      return data;
    },
    enabled: !!currentUser,
  });

  const { mutate: addFriend, isPending } = useMutation({
    mutationFn: async (friendId: string) => {
      if (!currentUser) throw new Error("You must be logged in to add friends.");
      if (currentUser.id === friendId) throw new Error("You cannot add yourself as a friend.");

      const { error } = await supabase.from("friendships").insert({
        requester_id: currentUser.id,
        receiver_id: friendId,
      });

      if (error) {
        if (error.code === '23505') {
             throw new Error("Friend request already sent or you are already friends.");
        }
        console.error('Error sending friend request:', error);
        throw new Error("Failed to send friend request.");
      }
    },
    onSuccess: () => {
      toast.success("Friend request sent!");
      queryClient.invalidateQueries({ queryKey: ['friendshipStatus', currentUser?.id, user.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleAddFriend = () => {
    if (!currentUser) {
      openLoginDialog();
      return;
    }
    addFriend(user.id);
  };

  const friendshipStatus = friendship?.status;
  const isRequestReceived = friendshipStatus === 'pending' && friendship?.requester_id === user.id;

  // We don't want to show the card for the current user
  if (currentUser?.id === user.id) {
    return <>{children}</>;
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80 bg-background border-border">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src={user.avatar_url || undefined} />
            <AvatarFallback>{user.full_name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <Link to={`/users/${user.id}`} className="hover:underline">
              <h4 className="text-sm font-semibold">{user.full_name || 'Anonymous User'}</h4>
            </Link>
            <p className="text-sm text-muted-foreground">
                View profile for more details.
            </p>
          </div>
          <div className="flex items-center">
            {isLoadingStatus ? <Skeleton className="h-9 w-28 bg-white/10" /> : (
              <>
                {currentUser && (
                  <>
                    {friendshipStatus === 'accepted' && <Badge variant="secondary">Friends</Badge>}
                    {isRequestReceived && <Badge variant="default">Accept request</Badge>}
                    {friendshipStatus === 'pending' && !isRequestReceived && <Badge variant="secondary">Request Sent</Badge>}
                    {friendshipStatus === 'blocked' && <Badge variant="destructive">Blocked</Badge>}
                    {!friendshipStatus && (
                        <Button size="sm" onClick={handleAddFriend} disabled={isPending}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            {isPending ? "Sending..." : "Add Friend"}
                        </Button>
                    )}
                  </>
                )}
                {!currentUser && (
                   <Button size="sm" onClick={handleAddFriend}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Friend
                    </Button>
                )}
              </>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserHoverCard;

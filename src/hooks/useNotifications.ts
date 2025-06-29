import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Notification } from "@/types/index";
import { toast } from "@/hooks/use-toast";

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async (): Promise<Notification[]> => {
      if (!user?.id) {
        console.log('No user ID, returning empty notifications');
        return [];
      }

      console.log('Fetching notifications for user:', user.id);
      
      // Get all notifications first
      const { data: allNotifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notifications:', error);
        throw error;
      }

      console.log('Raw notifications fetched:', allNotifications?.length || 0);

      if (!allNotifications || allNotifications.length === 0) {
        console.log('No notifications found');
        return [];
      }

      // Filter out friend request notifications that are no longer pending
      const validNotifications = [];
      
      for (const notification of allNotifications) {
        if (notification.type === 'new_friend_request') {
          // Type cast the data to access friendship_id
          const notificationData = notification.data as any;
          if (notificationData?.friendship_id) {
            console.log('Checking friendship status for notification:', notification.id, 'friendship:', notificationData.friendship_id);
            
            const { data: friendship, error: friendshipError } = await supabase
              .from('friendships')
              .select('status')
              .eq('id', notificationData.friendship_id)
              .maybeSingle();
            
            if (friendshipError) {
              console.error('Error checking friendship status:', friendshipError);
              // If there's an error, keep the notification to be safe
              validNotifications.push(notification);
              continue;
            }
            
            console.log('Friendship status:', friendship?.status);
            
            // Only keep the notification if the friendship is still pending
            if (friendship?.status === 'pending') {
              console.log('Keeping pending friend request notification');
              validNotifications.push(notification);
            } else {
              console.log('Filtering out non-pending friend request notification');
            }
          } else {
            // If no friendship_id, keep the notification
            validNotifications.push(notification);
          }
        } else {
          // Keep all non-friend-request notifications
          validNotifications.push(notification);
        }
      }

      console.log(`Final notifications after filtering: ${validNotifications.length}`);
      
      return validNotifications as Notification[];
    },
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const unreadCountQuery = useQuery({
    queryKey: ['unread-notifications-count', user?.id],
    queryFn: async (): Promise<number> => {
      if (!user?.id) {
        return 0;
      }

      console.log('Calculating unread count for user:', user.id);

      // Use the same filtering logic as the main notifications query
      // Get all unread notifications first
      const { data: allNotifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) {
        console.error('Error fetching unread notification count:', error);
        throw error;
      }

      if (!allNotifications || allNotifications.length === 0) {
        console.log('No unread notifications found');
        return 0;
      }

      console.log('Raw unread notifications:', allNotifications.length);

      // Apply the same filtering logic as the main query
      let unreadCount = 0;
      
      for (const notification of allNotifications) {
        if (notification.type === 'new_friend_request') {
          // Type cast the data to access friendship_id
          const notificationData = notification.data as any;
          if (notificationData?.friendship_id) {
            const { data: friendship } = await supabase
              .from('friendships')
              .select('status')
              .eq('id', notificationData.friendship_id)
              .maybeSingle();
            
            // Only count if the friendship is still pending
            if (friendship?.status === 'pending') {
              unreadCount++;
            }
          } else {
            // If no friendship_id, count the notification
            unreadCount++;
          }
        } else {
          // Count all other notification types
          unreadCount++;
        }
      }

      console.log('Final unread count:', unreadCount);
      return unreadCount;
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user?.id)
        .eq('is_read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications-count', user?.id] });
    },
  });

  const acceptFriendRequestMutation = useMutation({
    mutationFn: async (friendshipId: string) => {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', friendshipId);

      if (error) throw error;
      return friendshipId;
    },
    onSuccess: (friendshipId) => {
      toast({
        title: "Friend request accepted!",
        description: "You are now friends and can see each other's activity.",
      });
      
      // Invalidate all friendship-related queries
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

  const declineFriendRequestMutation = useMutation({
    mutationFn: async (friendshipId: string) => {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'declined' })
        .eq('id', friendshipId);

      if (error) throw error;
      return friendshipId;
    },
    onSuccess: (friendshipId) => {
      toast({
        title: "Friend request declined",
        description: "The friend request has been declined.",
      });
      
      // Invalidate all friendship-related queries
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
    notifications: notificationsQuery.data || [],
    isLoading: notificationsQuery.isLoading,
    unreadCount: unreadCountQuery.data || 0,
    markAllAsRead: markAllAsReadMutation.mutate,
    acceptFriendRequest: acceptFriendRequestMutation.mutate,
    isAccepting: acceptFriendRequestMutation.isPending,
    declineFriendRequest: declineFriendRequestMutation.mutate,
    isDeclining: declineFriendRequestMutation.isPending,
    error: notificationsQuery.error,
    ...notificationsQuery
  };
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications-count', user?.id] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user?.id)
        .eq('is_read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications-count', user?.id] });
    },
  });
};

export const useUnreadNotificationCount = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['unread-notifications-count', user?.id],
    queryFn: async (): Promise<number> => {
      if (!user?.id) {
        return 0;
      }

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) {
        console.error('Error fetching unread notification count:', error);
        throw error;
      }

      return count || 0;
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

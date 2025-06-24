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
        return [];
      }

      console.log('Fetching notifications for user:', user.id);
      
      // Query notifications with a filter for friend requests
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          friendships:data->friendship_id (
            status
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notifications:', error);
        throw error;
      }

      // Filter out friend request notifications where the friendship is no longer pending
      const filteredNotifications = (data || []).filter((notification: any) => {
        // If it's a friend request notification, check if the friendship is still pending
        if (notification.type === 'new_friend_request' && notification.data?.friendship_id) {
          // Query the friendship status directly
          return true; // We'll filter this in a second query
        }
        return true;
      });

      // For friend request notifications, we need to check the actual friendship status
      const notificationsWithStatus = await Promise.all(
        filteredNotifications.map(async (notification: any) => {
          if (notification.type === 'new_friend_request' && notification.data?.friendship_id) {
            const { data: friendship } = await supabase
              .from('friendships')
              .select('status')
              .eq('id', notification.data.friendship_id)
              .maybeSingle();
            
            // Only keep the notification if the friendship is still pending
            if (friendship?.status !== 'pending') {
              return null;
            }
          }
          return notification;
        })
      );

      // Filter out null values (declined/accepted friend requests)
      const finalNotifications = notificationsWithStatus.filter(Boolean);

      console.log(`Notifications fetched and filtered: ${finalNotifications?.length || 0}`);
      
      return finalNotifications as Notification[];
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

      // Get all notifications first
      const { data: allNotifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) {
        console.error('Error fetching unread notification count:', error);
        throw error;
      }

      // Filter out friend request notifications that are no longer pending
      let unreadCount = 0;
      
      for (const notification of allNotifications || []) {
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
          }
        } else {
          // Count all other notification types
          unreadCount++;
        }
      }

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

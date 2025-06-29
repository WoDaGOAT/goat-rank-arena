
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Notification } from "@/types/index";
import { notificationService } from "./notificationService";
import { useFriendRequestActions } from "./useFriendRequestActions";

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const friendRequestActions = useFriendRequestActions();

  const notificationsQuery = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async (): Promise<Notification[]> => {
      if (!user?.id) {
        console.log('No user ID, returning empty notifications');
        return [];
      }
      return await notificationService.fetchNotifications(user.id);
    },
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const unreadCountQuery = useQuery({
    queryKey: ['unread-notifications-count', user?.id],
    queryFn: async (): Promise<number> => {
      if (!user?.id) return 0;
      return await notificationService.fetchUnreadCount(user.id);
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      await notificationService.markAllAsRead(user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications-count', user?.id] });
    },
  });

  return {
    notifications: notificationsQuery.data || [],
    isLoading: notificationsQuery.isLoading,
    unreadCount: unreadCountQuery.data || 0,
    markAllAsRead: markAllAsReadMutation.mutate,
    acceptFriendRequest: friendRequestActions.acceptFriendRequest,
    isAccepting: friendRequestActions.isAccepting,
    declineFriendRequest: friendRequestActions.declineFriendRequest,
    isDeclining: friendRequestActions.isDeclining,
    error: notificationsQuery.error,
    ...notificationsQuery
  };
};

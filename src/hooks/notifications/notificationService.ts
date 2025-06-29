
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/index";
import { NotificationQueryData, FriendshipStatusData } from "./types";

export const notificationService = {
  async fetchNotifications(userId: string): Promise<Notification[]> {
    console.log('Fetching notifications for user:', userId);
    
    const { data: allNotifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
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

    // Filter notifications using the same logic for both count and list
    const validNotifications = await this.filterValidNotifications(allNotifications);
    console.log(`Final notifications after filtering: ${validNotifications.length}`);
    
    return validNotifications as Notification[];
  },

  async fetchUnreadCount(userId: string): Promise<number> {
    console.log('Calculating unread count for user:', userId);

    const { data: allNotifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
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

    // Use the same filtering logic
    const validNotifications = await this.filterValidNotifications(allNotifications);
    const unreadCount = validNotifications.length;

    console.log('Final unread count:', unreadCount);
    return unreadCount;
  },

  async filterValidNotifications(notifications: NotificationQueryData[]): Promise<NotificationQueryData[]> {
    const validNotifications: NotificationQueryData[] = [];
    
    for (const notification of notifications) {
      if (notification.type === 'new_friend_request') {
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
            validNotifications.push(notification);
            continue;
          }
          
          console.log('Friendship status:', friendship?.status);
          
          if (friendship?.status === 'pending') {
            console.log('Keeping pending friend request notification');
            validNotifications.push(notification);
          } else {
            console.log('Filtering out non-pending friend request notification');
          }
        } else {
          validNotifications.push(notification);
        }
      } else {
        validNotifications.push(notification);
      }
    }

    return validNotifications;
  },

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  },

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) throw error;
  }
};

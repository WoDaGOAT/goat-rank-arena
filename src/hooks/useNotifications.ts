import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Notification } from '@/types';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const useNotifications = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: notifications, isLoading } = useQuery<Notification[]>({
        queryKey: ['notifications', user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) {
                console.error("Error fetching notifications", error);
                return [];
            }
            return data as Notification[];
        },
        enabled: !!user,
    });

    const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

    const { mutate: markAllAsRead } = useMutation({
        mutationFn: async () => {
            if (!user) return;
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', user.id)
                .eq('is_read', false);
            
            if (error) {
                console.error("Error marking notifications as read", error);
                throw new Error("Could not update notifications");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
        }
    });

    const { mutate: acceptFriendRequest, isPending: isAccepting } = useMutation({
        mutationFn: async (friendshipId: string) => {
            if (!user) throw new Error("User not authenticated");
            const { error } = await supabase
                .from('friendships')
                .update({ status: 'accepted', updated_at: new Date().toISOString() })
                .eq('id', friendshipId)
                .eq('receiver_id', user.id);
            
            if (error) {
                console.error("Error accepting friend request", error);
                throw new Error("Could not accept friend request");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
            toast.success("Friend request accepted!");
        },
        onError: (e: Error) => {
            toast.error(e.message);
        }
    });

    const { mutate: declineFriendRequest, isPending: isDeclining } = useMutation({
        mutationFn: async (friendshipId: string) => {
            if (!user) throw new Error("User not authenticated");
            const { error } = await supabase
                .from('friendships')
                .delete()
                .eq('id', friendshipId)
                .eq('receiver_id', user.id);
            
            if (error) {
                console.error("Error declining friend request", error);
                throw new Error("Could not decline friend request");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
            toast.info("Friend request declined.");
        },
        onError: (e: Error) => {
            toast.error(e.message);
        }
    });

    // Realtime listener for new notifications
    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel(`notifications:${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
                    const newNotification = payload.new as Notification;
                    if (newNotification.type === 'new_comment_reply') {
                        toast.info(`${newNotification.data.replying_user_name} replied to your comment.`);
                    } else if (newNotification.type === 'new_category') {
                        toast.info(`A new category has been added: ${newNotification.data.category_name}`);
                    } else if (newNotification.type === 'new_friend_request') {
                        toast.info(`${newNotification.data.requester_name} sent you a friend request.`);
                    } else if (newNotification.type === 'friend_request_accepted') {
                        toast.info(`You are now friends with ${newNotification.data.receiver_name}.`);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, queryClient]);

    return { notifications, isLoading, unreadCount, markAllAsRead, acceptFriendRequest, isAccepting, declineFriendRequest, isDeclining };
};

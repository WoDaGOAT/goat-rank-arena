
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { notificationService } from "./notificationService";

export const useUnreadNotificationCount = () => {
  const { user } = useAuth();

  return useQuery({
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
};

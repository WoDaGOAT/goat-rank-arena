
import { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationItem from './NotificationItem';
import { Skeleton } from '../ui/skeleton';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { CheckCheck, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface NotificationsListProps {
  variant?: 'dropdown' | 'page';
  maxHeight?: string;
}

const NotificationsList = ({ variant = 'page', maxHeight = '400px' }: NotificationsListProps) => {
  const { notifications, isLoading, markAllAsRead, acceptFriendRequest, declineFriendRequest, isAccepting, isDeclining } = useNotifications();
  const [filter, setFilter] = useState<string>('all');

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.is_read;
    if (filter === 'friend_requests') return notification.type === 'new_friend_request';
    if (filter === 'comments') return notification.type === 'new_comment_reply';
    if (filter === 'badges') return notification.type === 'badge_earned';
    if (filter === 'quizzes') return notification.type === 'quiz_completed';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (isLoading) {
    return (
      <div className="space-y-2 p-2">
        {Array.from({ length: variant === 'dropdown' ? 3 : 8 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full bg-gray-700" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {variant === 'page' && (
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="friend_requests">Friend Requests</SelectItem>
                <SelectItem value="comments">Comments</SelectItem>
                <SelectItem value="badges">Badges</SelectItem>
                <SelectItem value="quizzes">Quizzes</SelectItem>
              </SelectContent>
            </Select>
            {unreadCount > 0 && (
              <Button 
                onClick={() => markAllAsRead()} 
                variant="outline" 
                size="sm"
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark all read
              </Button>
            )}
          </div>
        </div>
      )}

      <ScrollArea 
        className="flex-1" 
        style={{ 
          maxHeight: variant === 'dropdown' ? maxHeight : 'calc(100vh - 200px)',
          minHeight: variant === 'dropdown' ? '200px' : '400px'
        }}
      >
        <div className="p-1">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <NotificationItem 
                key={notification.id} 
                notification={notification}
                acceptFriendRequest={acceptFriendRequest}
                declineFriendRequest={declineFriendRequest}
                isAccepting={isAccepting}
                isDeclining={isDeclining}
              />
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              {filter === 'all' ? 'You have no notifications.' : `No ${filter.replace('_', ' ')} notifications.`}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotificationsList;


import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Check, X, MessageSquare, Trophy, Clock, Heart, Folder } from 'lucide-react';
import { Notification } from '@/types/index';
import { Link } from 'react-router-dom';
import { useMarkNotificationAsRead } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  acceptFriendRequest: (friendshipId: string) => void;
  declineFriendRequest: (friendshipId: string) => void;
  isAccepting: boolean;
  isDeclining: boolean;
}

const NotificationItem = ({
  notification,
  acceptFriendRequest,
  declineFriendRequest,
  isAccepting,
  isDeclining
}: NotificationItemProps) => {
  const markAsRead = useMarkNotificationAsRead();

  const handleNotificationClick = () => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'new_friend_request':
        return <Check className="h-4 w-4 text-green-400" />;
      case 'friend_request_accepted':
        return <Check className="h-4 w-4 text-green-400" />;
      case 'new_comment_reply':
        return <MessageSquare className="h-4 w-4 text-blue-400" />;
      case 'badge_earned':
        return <Trophy className="h-4 w-4 text-yellow-400" />;
      case 'ranking_reaction':
        return <Heart className="h-4 w-4 text-red-400" />;
      case 'new_category':
        return <Folder className="h-4 w-4 text-purple-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getNotificationContent = () => {
    const data = notification.data as any;
    
    switch (notification.type) {
      case 'new_friend_request':
        return {
          title: 'New Friend Request',
          message: `${data?.requester_name || 'Someone'} sent you a friend request`,
          actions: (
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  acceptFriendRequest(data?.friendship_id);
                  handleNotificationClick();
                }}
                disabled={isAccepting}
                className="bg-green-600 hover:bg-green-700 h-7 px-3 text-xs"
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  declineFriendRequest(data?.friendship_id);
                  handleNotificationClick();
                }}
                disabled={isDeclining}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 h-7 px-3 text-xs"
              >
                Decline
              </Button>
            </div>
          )
        };
        
      case 'friend_request_accepted':
        return {
          title: 'Friend Request Accepted',
          message: `${data?.receiver_name || 'Someone'} accepted your friend request`,
          link: data?.receiver_id ? `/profile/${data.receiver_id}` : undefined
        };
        
      case 'new_comment_reply':
        return {
          title: 'New Comment Reply',
          message: `${data?.commenter_name || 'Someone'} replied to your comment`,
          link: data?.ranking_id ? `/ranking/${data.ranking_id}` : undefined
        };
        
      case 'badge_earned':
        return {
          title: 'Badge Earned!',
          message: `You earned the "${data?.badge_name || 'Achievement'}" badge`,
          link: '/profile'
        };

      case 'ranking_reaction':
        return {
          title: 'Ranking Reaction',
          message: `${data?.user_name || 'Someone'} ${data?.reaction_type || 'reacted to'} your ranking "${data?.ranking_title || 'your ranking'}"`,
          link: data?.ranking_id ? `/ranking/${data.ranking_id}` : undefined
        };

      case 'new_category':
        return {
          title: 'New Category Available',
          message: `New category "${data?.category_name || 'category'}" is now available for ranking`,
          link: data?.category_id ? `/category/${data.category_id}` : undefined
        };
        
      default:
        return {
          title: 'Notification',
          message: data?.message || 'You have a new notification'
        };
    }
  };

  const content = getNotificationContent();
  const baseClassName = cn(
    "block p-3 border-b border-gray-700/50 hover:bg-gray-800/50 transition-colors cursor-pointer",
    !notification.is_read && "bg-blue-900/20 border-l-4 border-l-blue-500"
  );

  const notificationContent = (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-1">
        {getNotificationIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-white truncate">
            {content.title}
          </h4>
          {!notification.is_read && (
            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2" />
          )}
        </div>
        
        <p className="text-sm text-gray-400 mt-1 break-words">
          {content.message}
        </p>
        
        <p className="text-xs text-gray-500 mt-1">
          {formatDistanceToNow(new Date(notification.created_at))} ago
        </p>
        
        {content.actions && content.actions}
      </div>
    </div>
  );
  
  if (content.link) {
    return (
      <Link
        to={content.link}
        onClick={handleNotificationClick}
        className={baseClassName}
      >
        {notificationContent}
      </Link>
    );
  }

  return (
    <div
      onClick={handleNotificationClick}
      className={baseClassName}
    >
      {notificationContent}
    </div>
  );
};

export default NotificationItem;


import { Link } from 'react-router-dom';
import { Notification } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Layers, UserPlus, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface NotificationItemProps {
    notification: Notification;
    acceptFriendRequest: (friendshipId: string) => void;
    declineFriendRequest: (friendshipId: string) => void;
    isAccepting: boolean;
    isDeclining: boolean;
}

const NotificationItem = ({ notification, acceptFriendRequest, declineFriendRequest, isAccepting, isDeclining }: NotificationItemProps) => {
    const renderContent = () => {
        switch (notification.type) {
            case 'new_comment_reply':
                return (
                    <p>
                        <span className="font-semibold">{notification.data.replying_user_name || 'Someone'}</span> replied to your comment on{' '}
                        <span className="font-semibold">{notification.data.category_name}</span>.
                    </p>
                );
            case 'new_category':
                return (
                    <p>
                        A new leaderboard has been added:{' '}
                        <span className="font-semibold">{notification.data.category_name}</span>.
                    </p>
                );
            case 'new_friend_request':
                return (
                    <p>
                        <span className="font-semibold">{notification.data.requester_name || 'Someone'}</span> sent you a friend request.
                    </p>
                );
            case 'friend_request_accepted':
                 return (
                    <p>
                        You and <span className="font-semibold">{notification.data.receiver_name || 'Someone'}</span> are now friends.
                    </p>
                );
            default:
                return <p>You have a new notification.</p>;
        }
    };
    
    const icon = notification.type === 'new_comment_reply' 
        ? <MessageSquare className="w-5 h-5 text-blue-400" />
        : notification.type === 'new_category'
        ? <Layers className="w-5 h-5 text-green-400" />
        : notification.type === 'new_friend_request'
        ? <UserPlus className="w-5 h-5 text-purple-400" />
        : notification.type === 'friend_request_accepted'
        ? <Users className="w-5 h-5 text-teal-400" />
        : <MessageSquare className="w-5 h-5 text-gray-400" />;

    const handleAccept = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        acceptFriendRequest(notification.data.friendship_id);
    };

    const handleDecline = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        declineFriendRequest(notification.data.friendship_id);
    };

    const isClickable = ['new_comment_reply', 'new_category'].includes(notification.type);
    const linkTarget = isClickable ? `/category/${notification.data.category_id}` : '#';

    const content = (
        <div className="flex items-start gap-3 relative">
            {!notification.is_read && (
                <div className="w-2 h-2 rounded-full bg-blue-500 absolute top-2 left-[-4px]"></div>
            )}
            <div className="flex-shrink-0 pt-1">
                {icon}
            </div>
            <div className="flex-1">
                <div className={cn("text-sm", notification.is_read ? "text-gray-400" : "text-white")}>
                    {renderContent()}
                </div>
                 {notification.type === 'new_friend_request' && (
                    <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" onClick={handleAccept} disabled={isAccepting || isDeclining}>
                            {isAccepting ? "Accepting..." : "Accept"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDecline} disabled={isAccepting || isDeclining}>
                            {isDeclining ? "Declining..." : "Decline"}
                        </Button>
                    </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </p>
            </div>
        </div>
    );

    if (isClickable) {
        return (
            <Link 
                to={linkTarget} 
                className="block p-3 hover:bg-white/10 rounded-md transition-colors"
            >
                {content}
            </Link>
        );
    }

    return (
        <div className="block p-3 hover:bg-white/10 rounded-md transition-colors cursor-default">
            {content}
        </div>
    );
};

export default NotificationItem;


import { Link } from 'react-router-dom';
import { Notification } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
    notification: Notification;
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
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
            default:
                return <p>You have a new notification.</p>;
        }
    };
    
    const icon = notification.type === 'new_comment_reply' 
        ? <MessageSquare className="w-5 h-5 text-blue-400" />
        : <Layers className="w-5 h-5 text-green-400" />;

    return (
        <Link 
            to={`/category/${notification.data.category_id}`} 
            className="block p-3 hover:bg-white/10 rounded-md transition-colors"
        >
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
                    <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default NotificationItem;

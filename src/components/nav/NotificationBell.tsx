
import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationItem from '../notifications/NotificationItem';
import { Skeleton } from '../ui/skeleton';
import { ScrollArea } from '../ui/scroll-area';

const NotificationBell = () => {
    const { notifications, isLoading, unreadCount, markAllAsRead, acceptFriendRequest, isAccepting, declineFriendRequest, isDeclining } = useNotifications();
    
    const handleOpenChange = (open: boolean) => {
        if (open && unreadCount > 0) {
            markAllAsRead();
        }
    };

    return (
        <Popover onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-white hover:text-white hover:bg-white/10">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-gray-900 border-gray-700 text-white p-0" align="end">
                <div className="p-3 font-semibold border-b border-gray-700">Notifications</div>
                <ScrollArea className="max-h-96">
                    <div className='p-1'>
                        {isLoading ? (
                            <div className="space-y-2 p-2">
                               <Skeleton className="h-16 w-full bg-gray-700" />
                               <Skeleton className="h-16 w-full bg-gray-700" />
                            </div>
                        ) : notifications && notifications.length > 0 ? (
                            notifications.map(n => <NotificationItem 
                                key={n.id} 
                                notification={n}
                                acceptFriendRequest={acceptFriendRequest}
                                declineFriendRequest={declineFriendRequest}
                                isAccepting={isAccepting}
                                isDeclining={isDeclining}
                            />)
                        ) : (
                            <p className="text-center text-gray-400 py-8">You have no notifications.</p>
                        )}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationBell;

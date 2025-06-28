
import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationsList from '../notifications/NotificationsList';
import { Link, useLocation } from 'react-router-dom';

const NotificationBell = () => {
    const { unreadCount, markAllAsRead } = useNotifications();
    const location = useLocation();
    
    // Hide the notification bell when on the notifications page
    if (location.pathname === '/notifications') {
        return null;
    }
    
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
            <PopoverContent className="w-96 bg-gray-900 border-gray-700 text-white p-0 z-50" align="end">
                <div className="flex items-center justify-between p-3 font-semibold border-b border-gray-700">
                    <span>Notifications</span>
                    <Link 
                        to="/notifications" 
                        className="text-blue-400 hover:text-blue-300 text-sm font-normal"
                    >
                        View All
                    </Link>
                </div>
                <div className="h-96 overflow-hidden">
                    <NotificationsList variant="dropdown" maxHeight="384px" />
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationBell;

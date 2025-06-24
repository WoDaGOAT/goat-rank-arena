
import { Helmet } from 'react-helmet-async';
import NotificationsList from '@/components/notifications/NotificationsList';

const NotificationsPage = () => {
  return (
    <>
      <Helmet>
        <title>Notifications - WoDaGOAT</title>
        <meta name="description" content="View all your WoDaGOAT notifications, friend requests, comments, and achievements." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900/95 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-2xl overflow-hidden">
              <NotificationsList variant="page" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationsPage;

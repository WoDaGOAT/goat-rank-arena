
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import AuthButtons from "./nav/AuthButtons";
import UserMenu from "./nav/UserMenu";
import Logo from "./nav/Logo";
import NavMenu from "./nav/NavMenu";
import NotificationBell from "./nav/NotificationBell";
import MobileNav from "./nav/MobileNav";
import { Link } from "react-router-dom";
import { Rss, FileQuestion, Wrench, Users, MessageSquareWarning, Lightbulb, Trophy, Award, Bell } from "lucide-react";
import { useUserBadges } from "@/hooks/useUserBadges";
import { useUserStats } from "@/hooks/useUserStats";
import { useUnreadNotificationCount } from "@/hooks/useNotifications";

const Navbar = () => {
  const { user, loading, isAdmin, isModeratorOrAdmin } = useAuth();
  const { userBadges, loading: badgesLoading } = useUserBadges();
  const { stats, loading: statsLoading } = useUserStats();
  const { data: unreadNotificationsCount = 0 } = useUnreadNotificationCount();

  // Enhanced badge notification logic
  const getBadgeNotification = () => {
    if (!user || badgesLoading || statsLoading) return null;

    console.log('Badge notification check:', {
      userBadges: userBadges.map(b => b.badge_id),
      stats,
      totalBadges: userBadges.length
    });

    // Check for first quiz notification (for new users)
    const hasFirstQuizBadge = userBadges.some(badge => badge.badge_id === 'first_quiz');
    if (!hasFirstQuizBadge) {
      return {
        icon: Lightbulb,
        color: "text-yellow-900",
        bgColor: "bg-yellow-500",
        message: "Take your first quiz!"
      };
    }

    // Check for perfect score achievement
    const hasPerfectScoreBadge = userBadges.some(badge => badge.badge_id === 'perfect_score');
    if (stats && stats.total_quizzes >= 1 && !hasPerfectScoreBadge && stats.accuracy_percentage < 100) {
      return {
        icon: Trophy,
        color: "text-blue-900",
        bgColor: "bg-blue-500",
        message: "Try for a perfect score!"
      };
    }

    // Check for streak opportunities
    const hasStreakBadge = userBadges.some(badge => badge.badge_id === 'streak_3' || badge.badge_id === 'streak_10');
    if (stats && stats.current_streak === 0 && stats.total_quizzes >= 1 && !hasStreakBadge) {
      return {
        icon: Award,
        color: "text-purple-900",
        bgColor: "bg-purple-500",
        message: "Start a quiz streak!"
      };
    }

    return null;
  };

  const badgeNotification = getBadgeNotification();

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm text-gray-200 border-b border-gray-700/50 shadow-lg">
      <div className="relative container mx-auto px-2 sm:px-4">
        {/* Single responsive row */}
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Center: Spacer for desktop (empty div to maintain layout) */}
          <div className="hidden lg:flex flex-1"></div>

          {/* Right: Desktop Navigation + Auth/User Menu + Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Navigation (hidden on mobile) */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-4 text-base font-medium mr-4">
              <Link
                to="/feed"
                className="bg-transparent hover:bg-white/10 focus:bg-white/10 px-3 xl:px-4 py-2 rounded-md transition-colors focus:outline-none flex items-center gap-2"
              >
                <Rss className="h-4 w-4 xl:h-5 xl:w-5 text-white" />
                <span className="text-white">Feed</span>
              </Link>
              <Link
                to="/quiz"
                className="bg-transparent hover:bg-white/10 focus:bg-white/10 px-3 xl:px-4 py-2 rounded-md transition-colors focus:outline-none flex items-center gap-2 group relative"
              >
                <FileQuestion className="h-5 w-5 text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors drop-shadow-sm" />
                <span className="font-bold text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text group-hover:from-fuchsia-300 group-hover:to-cyan-300 drop-shadow-sm">
                  Quiz
                </span>
                {badgeNotification && (
                  <div 
                    className={`absolute -top-1 -right-1 ${badgeNotification.bgColor} rounded-full p-1 animate-pulse`}
                    title={badgeNotification.message}
                  >
                    <badgeNotification.icon className={`h-3 w-3 ${badgeNotification.color}`} />
                  </div>
                )}
              </Link>

              {user && (
                <Link
                  to="/notifications"
                  className="bg-transparent hover:bg-white/10 focus:bg-white/10 px-3 xl:px-4 py-2 rounded-md transition-colors focus:outline-none flex items-center gap-2 relative"
                >
                  <Bell className="h-4 w-4 xl:h-5 xl:w-5 text-white" />
                  <span className="text-white">Notifications</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </span>
                  )}
                </Link>
              )}
              
              {isModeratorOrAdmin && (
                <Link
                  to="/admin/comments"
                  className="bg-transparent hover:bg-white/10 focus:bg-white/10 px-3 xl:px-4 py-2 rounded-md transition-colors focus:outline-none flex items-center gap-2"
                >
                  <MessageSquareWarning className="h-4 w-4 xl:h-5 xl:w-5 text-white" />
                  <span className="text-white">Comments</span>
                </Link>
              )}
              
              {isAdmin && (
                <>
                  <Link
                    to="/admin/quizzes/new"
                    className="bg-transparent hover:bg-white/10 focus:bg-white/10 px-3 xl:px-4 py-2 rounded-md transition-colors focus:outline-none flex items-center gap-2"
                  >
                    <Wrench className="h-4 w-4 xl:h-5 xl:w-5 text-white" />
                    <span className="text-white">Create Quiz</span>
                  </Link>
                  <Link
                    to="/admin/users"
                    className="bg-transparent hover:bg-white/10 focus:bg-white/10 px-3 xl:px-4 py-2 rounded-md transition-colors focus:outline-none flex items-center gap-2"
                  >
                    <Users className="h-4 w-4 xl:h-5 xl:w-5 text-white" />
                    <span className="text-white">Manage Users</span>
                  </Link>
                </>
              )}
            </div>

            {/* Auth buttons or user menu - always visible */}
            {loading ? (
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-700" />
                <Skeleton className="h-8 w-16 sm:h-10 sm:w-20 bg-gray-700" />
              </div>
            ) : user ? (
              <div className="flex items-center gap-2">
                <NotificationBell />
                <UserMenu />
              </div>
            ) : (
              <AuthButtons />
            )}

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <MobileNav />
            </div>
          </div>
        </div>

        {/* Desktop Categories Row (hidden on mobile) */}
        <div className="hidden lg:flex items-center justify-center h-12 border-t border-gray-700/50">
          <NavMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;


import React from "react";
import { Link } from "react-router-dom";
import { Rss, FileQuestion, Trophy, Lightbulb, Award, Bell } from "lucide-react";
import { useUserBadges } from "@/hooks/useUserBadges";
import { useUserStats } from "@/hooks/useUserStats";
import { useAuth } from "@/contexts/AuthContext";
import { useUnreadNotificationCount } from "@/hooks/useNotifications";

interface MobileMenuNavigationProps {
  onLinkClick: () => void;
}

const MobileMenuNavigation = ({ onLinkClick }: MobileMenuNavigationProps) => {
  const { user } = useAuth();
  const { userBadges, loading: badgesLoading } = useUserBadges();
  const { stats, loading: statsLoading } = useUserStats();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  // Enhanced badge notification logic (same as navbar)
  const getBadgeNotification = () => {
    if (!user || badgesLoading || statsLoading) return null;

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
    <div className="space-y-6 mb-8">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Navigate</h3>
      
      <div className="space-y-3">
        <Link
          to="/feed"
          onClick={onLinkClick}
          className="flex items-center gap-4 p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-600"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600">
            <Rss className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-semibold text-white block">Feed</span>
            <span className="text-sm text-slate-300">Latest rankings & discussions</span>
          </div>
        </Link>

        <Link
          to="/quiz"
          onClick={onLinkClick}
          className="flex items-center gap-4 p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-600 relative"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-fuchsia-600 to-cyan-600">
            <FileQuestion className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-fuchsia-300 to-cyan-300 bg-clip-text text-transparent block">Quiz</span>
            <span className="text-sm text-slate-300">Test your sports knowledge</span>
          </div>
          {badgeNotification && (
            <div 
              className={`absolute top-2 right-2 ${badgeNotification.bgColor} rounded-full p-2 animate-pulse`}
              title={badgeNotification.message}
            >
              <badgeNotification.icon className={`h-4 w-4 ${badgeNotification.color}`} />
            </div>
          )}
        </Link>

        {user && (
          <Link
            to="/notifications"
            onClick={onLinkClick}
            className="flex items-center gap-4 p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-600 relative"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-600">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-semibold text-white block">Notifications</span>
              <span className="text-sm text-slate-300">Stay updated with activities</span>
            </div>
            {unreadCount > 0 && (
              <div className="absolute top-2 right-2 bg-red-500 rounded-full p-2 animate-pulse">
                <span className="text-xs text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
              </div>
            )}
          </Link>
        )}

        <Link
          to="/"
          onClick={onLinkClick}
          className="flex items-center gap-4 p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-600"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-600">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-semibold text-white block">Daily Ranking</span>
            <span className="text-sm text-slate-300">Today's featured GOAT debate</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default MobileMenuNavigation;

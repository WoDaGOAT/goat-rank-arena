
import React from "react";
import { Link } from "react-router-dom";
import { Rss, FileQuestion, Trophy, Lightbulb } from "lucide-react";
import { useUserBadges } from "@/hooks/useUserBadges";
import { useAuth } from "@/contexts/AuthContext";

interface MobileMenuNavigationProps {
  onLinkClick: () => void;
}

const MobileMenuNavigation = ({ onLinkClick }: MobileMenuNavigationProps) => {
  const { user } = useAuth();
  const { userBadges, loading: badgesLoading } = useUserBadges();

  // Check if user has completed their first quiz
  const hasFirstQuizBadge = userBadges.some(badge => badge.badge_id === 'first_quiz');
  const shouldShowQuizBadge = user && !badgesLoading && !hasFirstQuizBadge;

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
          {shouldShowQuizBadge && (
            <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-2 animate-pulse">
              <Lightbulb className="h-4 w-4 text-yellow-900" />
            </div>
          )}
        </Link>

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

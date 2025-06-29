
import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { sanitize } from "@/lib/sanitize";
import { ThumbsUp, Trophy, Flame, Frown } from "lucide-react";

export interface RankingReactionFeedData {
  reacting_user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  ranking: {
    id: string;
    title: string;
    category_id: string;
    category_name: string;
    author: {
      id: string;
      full_name: string;
      avatar_url: string | null;
    };
  };
  reaction_type: string;
  reacted_at: string;
}

interface RankingReactionFeedItemProps {
  data: RankingReactionFeedData;
  createdAt: string;
}

const OptimizedRankingReactionFeedItem = memo(({ data, createdAt }: RankingReactionFeedItemProps) => {
  console.log('RankingReactionFeedItem received data:', data);
  
  // Don't render if we don't have valid data
  if (!data.reacting_user?.full_name || !data.ranking?.title) {
    console.log('RankingReactionFeedItem: Missing required data', data);
    return null;
  }
  
  const reactingUserName = sanitize(data.reacting_user.full_name);
  const rankingTitle = sanitize(data.ranking.title);
  const authorName = sanitize(data.ranking.author.full_name);
  const categoryName = sanitize(data.ranking.category_name);

  // Map reaction types to icons and labels
  const getReactionInfo = (reactionType: string) => {
    switch (reactionType) {
      case 'thumbs-up':
        return { icon: ThumbsUp, label: 'liked', emoji: '👍', color: 'text-blue-300' };
      case 'trophy':
        return { icon: Trophy, label: 'thinks is champion', emoji: '🏆', color: 'text-yellow-300' };
      case 'flame':
        return { icon: Flame, label: 'thinks is fire', emoji: '🔥', color: 'text-orange-300' };
      case 'frown':
        return { icon: Frown, label: 'disagrees with', emoji: '😔', color: 'text-red-300' };
      default:
        return { icon: ThumbsUp, label: 'reacted to', emoji: '👍', color: 'text-gray-300' };
    }
  };

  const reactionInfo = getReactionInfo(data.reaction_type);
  const ReactionIcon = reactionInfo.icon;

  return (
    <Card className="bg-white/5 text-white border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-start gap-4 mb-3">
          <Link to={`/users/${data.reacting_user.id}`}>
            <Avatar className="cursor-pointer hover:opacity-80 transition-opacity w-10 h-10">
              <AvatarImage 
                src={data.reacting_user.avatar_url || undefined} 
                alt={reactingUserName}
              />
              <AvatarFallback className="text-sm">{reactingUserName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="flex items-center gap-2 flex-wrap text-sm">
              <ReactionIcon className={`w-4 h-4 ${reactionInfo.color} flex-shrink-0`} />
              <Link 
                to={`/users/${data.reacting_user.id}`} 
                className="font-bold hover:underline hover:text-blue-300 transition-colors truncate"
              >
                {reactingUserName}
              </Link>
              <span className="flex-shrink-0">{reactionInfo.label}</span>
              <Link 
                to={`/users/${data.ranking.author.id}`}
                className="font-medium hover:underline hover:text-blue-300 transition-colors truncate"
              >
                {authorName}'s
              </Link>
              <Link 
                to={`/category/${data.ranking.category_id}`} 
                className="text-blue-300 hover:underline truncate"
              >
                {categoryName}
              </Link>
              <span className="flex-shrink-0">ranking</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-lg">{reactionInfo.emoji}</span>
          </div>
        </div>

        {/* Optimized ranking preview */}
        <div className="bg-white/10 rounded-lg p-3 ml-14">
          <div className="flex justify-between items-start">
            {data.ranking.title && data.ranking.title.trim() && data.ranking.title !== "My Ranking" && (
              <h4 className="font-semibold text-blue-300 text-sm truncate flex-1 mr-2">{rankingTitle}</h4>
            )}
            <Link 
              to={`/ranking/${data.ranking.id}`}
              className="text-xs text-blue-300 hover:text-blue-200 hover:underline flex-shrink-0"
            >
              View
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

OptimizedRankingReactionFeedItem.displayName = 'OptimizedRankingReactionFeedItem';

export default OptimizedRankingReactionFeedItem;

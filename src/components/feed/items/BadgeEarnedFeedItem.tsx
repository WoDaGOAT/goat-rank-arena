
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { sanitize } from "@/lib/sanitize";
import { Award, Sparkles, Shield, Trophy, Flame } from "lucide-react";

export interface ProfileInfo {
  id?: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface BadgeInfo {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface BadgeEarnedFeedData {
  user: ProfileInfo | null;
  badge: BadgeInfo | null;
  earned_at: string;
}

interface BadgeEarnedFeedItemProps {
  data: BadgeEarnedFeedData;
  createdAt: string;
}

const BadgeEarnedFeedItem = ({ data, createdAt }: BadgeEarnedFeedItemProps) => {
  const { user, badge } = data;
  
  const userName = user?.full_name || 'Anonymous';
  const userAvatar = user?.avatar_url;
  const sanitizedUserName = sanitize(userName);
  const badgeName = badge?.name || 'Unknown Badge';
  const badgeDescription = badge?.description || 'Badge earned';
  const badgeRarity = badge?.rarity || 'common';
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return "text-yellow-400 border-yellow-400/50 bg-yellow-500/20";
      case 'epic': return "text-purple-400 border-purple-400/50 bg-purple-500/20";
      case 'rare': return "text-blue-400 border-blue-400/50 bg-blue-500/20";
      default: return "text-green-400 border-green-400/50 bg-green-500/20";
    }
  };

  const getBadgeIcon = (badgeId: string) => {
    switch (badgeId) {
      case 'goat': return Trophy;
      case 'legend': return Shield;
      case 'perfect_score':
      case 'triple_perfect': return Award;
      case 'streak_3':
      case 'streak_10': return Flame;
      default: return Sparkles;
    }
  };

  const BadgeIcon = getBadgeIcon(badge?.id || '');

  return (
    <Card className="bg-white/5 text-white border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-start gap-4 mb-3">
          {/* Make avatar clickable */}
          {user?.id ? (
            <Link to={`/users/${user.id}`}>
              <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarImage src={userAvatar || undefined} alt={sanitizedUserName || 'User'}/>
                <AvatarFallback>{sanitizedUserName?.charAt(0) || 'A'}</AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Avatar>
              <AvatarImage src={userAvatar || undefined} alt={sanitizedUserName || 'User'}/>
              <AvatarFallback>{sanitizedUserName?.charAt(0) || 'A'}</AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1">
            <p className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              {/* Make user name clickable */}
              {user?.id ? (
                <Link to={`/users/${user.id}`} className="font-bold hover:underline hover:text-blue-300 transition-colors">
                  {sanitizedUserName}
                </Link>
              ) : (
                <span className="font-bold">{sanitizedUserName}</span>
              )}
              {' '} earned a new badge
            </p>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Badge details */}
        <div className={`rounded-lg p-4 ml-5 border ${getRarityColor(badgeRarity)}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-full ${getRarityColor(badgeRarity)}`}>
              <BadgeIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white">{sanitize(badgeName)}</h4>
              <p className="text-sm text-gray-300">{sanitize(badgeDescription)}</p>
            </div>
            <Badge 
              variant="outline" 
              className={`capitalize ${getRarityColor(badgeRarity)}`}
            >
              {badgeRarity}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgeEarnedFeedItem;

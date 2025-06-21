
import { useState } from "react";
import { Badge, UserBadge } from "@/types/badges";
import { BADGES } from "@/data/badges";
import BadgeCard from "./BadgeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Shield } from "lucide-react";
import { useUserBadges } from "@/hooks/useUserBadges";

interface BadgeShowcaseProps {
  userBadges: UserBadge[];
}

const BadgeShowcase = ({ userBadges }: BadgeShowcaseProps) => {
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');
  const { refreshBadges } = useUserBadges();
  
  // Ensure userBadges is always an array
  const safeBadges = userBadges || [];
  
  // Create a set of earned badge IDs for faster lookup
  const earnedBadgeIds = new Set(safeBadges.map(ub => ub.badge_id));
  
  const filteredBadges = BADGES.filter(badge => {
    if (filter === 'earned') return earnedBadgeIds.has(badge.id);
    if (filter === 'locked') return !earnedBadgeIds.has(badge.id);
    return true;
  });

  const earnedCount = earnedBadgeIds.size;
  const totalCount = BADGES.length;

  console.log('BadgeShowcase - User badges:', safeBadges);
  console.log('BadgeShowcase - Earned badge IDs:', Array.from(earnedBadgeIds));
  console.log('BadgeShowcase - Available badges:', BADGES.map(b => ({ id: b.id, icon: b.icon })));

  return (
    <Card className="w-full bg-white/5 border-white/20 text-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Badge Collection ({earnedCount}/{totalCount})
          </CardTitle>
          <Button
            onClick={refreshBadges}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Shield className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}
          >
            All ({totalCount})
          </Button>
          <Button
            variant={filter === 'earned' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('earned')}
            className={filter === 'earned' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}
          >
            Earned ({earnedCount})
          </Button>
          <Button
            variant={filter === 'locked' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('locked')}
            className={filter === 'locked' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}
          >
            Locked ({totalCount - earnedCount})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {earnedCount === 0 && (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No badges earned yet!</p>
            <p className="text-sm text-gray-500">Complete quizzes to start earning badges.</p>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredBadges.map(badge => {
            const userBadge = safeBadges.find(ub => ub.badge_id === badge.id);
            const isEarned = earnedBadgeIds.has(badge.id);
            
            console.log(`Badge ${badge.id}: isEarned=${isEarned}, userBadge=`, userBadge);
            
            return (
              <BadgeCard
                key={badge.id}
                badge={badge}
                userBadge={userBadge}
                isEarned={isEarned}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgeShowcase;

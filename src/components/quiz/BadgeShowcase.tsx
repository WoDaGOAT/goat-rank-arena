
import { useState } from "react";
import { Badge, UserBadge } from "@/types/badges";
import { BADGES } from "@/data/badges";
import BadgeCard from "./BadgeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

interface BadgeShowcaseProps {
  userBadges: UserBadge[];
}

const BadgeShowcase = ({ userBadges }: BadgeShowcaseProps) => {
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');
  
  const earnedBadgeIds = userBadges.map(ub => ub.badge_id);
  
  const filteredBadges = BADGES.filter(badge => {
    if (filter === 'earned') return earnedBadgeIds.includes(badge.id);
    if (filter === 'locked') return !earnedBadgeIds.includes(badge.id);
    return true;
  });

  const earnedCount = earnedBadgeIds.length;
  const totalCount = BADGES.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          Badge Collection ({earnedCount}/{totalCount})
        </CardTitle>
        <div className="flex gap-2 mt-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({totalCount})
          </Button>
          <Button
            variant={filter === 'earned' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('earned')}
          >
            Earned ({earnedCount})
          </Button>
          <Button
            variant={filter === 'locked' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('locked')}
          >
            Locked ({totalCount - earnedCount})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredBadges.map(badge => {
            const userBadge = userBadges.find(ub => ub.badge_id === badge.id);
            const isEarned = !!userBadge;
            
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

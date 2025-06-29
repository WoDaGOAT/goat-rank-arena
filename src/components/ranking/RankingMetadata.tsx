
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserHoverCard from "@/components/profile/UserHoverCard";

interface RankingMetadataProps {
  description?: string | null;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  userId: string;
  categories?: {
    name: string | null;
  } | null;
  categoryId: string;
}

const RankingMetadata = ({ description, profiles, userId, categories, categoryId }: RankingMetadataProps) => {
  return (
    <Card className="bg-white/5 border-white/10 text-white">
      <CardHeader>
        <h2 className="text-2xl font-semibold leading-none tracking-tight">About this Ranking</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {description ? (
          <p className="text-gray-300">{description}</p>
        ) : (
          <p className="text-gray-400 italic">No description provided.</p>
        )}

        {profiles && (
          <div className="flex items-center gap-4 pt-2">
            <UserHoverCard user={{ id: userId, full_name: profiles.full_name, avatar_url: profiles.avatar_url }}>
              <Avatar>
                <AvatarImage src={profiles.avatar_url || undefined} />
                <AvatarFallback>{profiles.full_name?.charAt(0) || 'A'}</AvatarFallback>
              </Avatar>
            </UserHoverCard>
            <div>
              <p className="text-sm text-gray-400">Created by</p>
              <UserHoverCard user={{ id: userId, full_name: profiles.full_name, avatar_url: profiles.avatar_url }}>
                <Link to={`/users/${userId}`} className="font-semibold text-white hover:underline">
                  {profiles.full_name || 'Anonymous User'}
                </Link>
              </UserHoverCard>
            </div>
          </div>
        )}
        
        {categories && (
          <div className="!mt-6">
            <p className="text-sm text-gray-400 mb-2">Category</p>
            <Link to={`/category/${categoryId}`} className="inline-block px-3 py-1 text-sm font-medium bg-blue-500/20 text-blue-300 rounded-full hover:bg-blue-500/40 transition-colors">
              {categories.name || 'Uncategorized'}
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RankingMetadata;

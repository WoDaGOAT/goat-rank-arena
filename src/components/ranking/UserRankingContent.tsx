
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import RankedAthleteRow from "@/components/feed/items/RankedAthleteRow";
import { SocialActions } from "@/components/category/SocialActions";
import RankingMetadata from "./RankingMetadata";
import { UserRankingDetails } from "@/types/userRanking";

interface UserRankingContentProps {
  ranking: UserRankingDetails;
}

const UserRankingContent = ({ ranking }: UserRankingContentProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">Ranked Athletes</h2>
            <CardDescription className="text-gray-400">
              See who made the cut in this ranking.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col">
              {ranking.athletes.length > 0 ? (
                ranking.athletes.map((athlete) => (
                  <RankedAthleteRow key={athlete.id} athlete={athlete} />
                ))
              ) : (
                <p className="p-6 text-gray-400">No athletes have been ranked yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <SocialActions rankingId={ranking.id} />
        </div>
      </div>

      <aside className="space-y-8">
        <RankingMetadata
          description={ranking.description}
          profiles={ranking.profiles}
          userId={ranking.user_id}
          categories={ranking.categories}
          categoryId={ranking.category_id}
        />
      </aside>
    </div>
  );
};

export default UserRankingContent;

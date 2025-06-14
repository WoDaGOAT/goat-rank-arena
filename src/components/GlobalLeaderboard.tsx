
import { Athlete } from "@/types";
import LeaderboardRow from "./LeaderboardRow";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface GlobalLeaderboardProps {
  athletes: Athlete[];
  categoryName: string;
}

const GlobalLeaderboard = ({ athletes, categoryName }: GlobalLeaderboardProps) => {
  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-3xl font-bold text-primary">{categoryName}</CardTitle>
        <CardDescription>Global Top 10 - Powered by User Rankings</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-[auto_60px_1fr_auto_auto] gap-4 items-center p-3 border-b border-border bg-muted/50 font-semibold text-muted-foreground text-sm">
          <div>#</div>
          <div>Pic</div>
          <div>Athlete</div>
          <div className="text-center">Trend</div>
          <div className="text-right">Points</div>
        </div>
        {athletes.slice(0, 10).map((athlete) => (
          <LeaderboardRow key={athlete.id} athlete={athlete} />
        ))}
      </CardContent>
    </Card>
  );
};

export default GlobalLeaderboard;

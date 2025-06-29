
import { Skeleton } from "@/components/ui/skeleton";

interface UserStats {
  totalQuizzes: number;
  totalScore: number;
  averageScore: number;
  perfectScores: number;
  accuracy: number;
}

interface PublicProfileStatsProps {
  userStats: UserStats | null;
  isLoading: boolean;
}

const PublicProfileStats = ({ userStats, isLoading }: PublicProfileStatsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-20 bg-white/10 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!userStats || userStats.totalQuizzes === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Quiz Performance</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 p-4 rounded-lg border border-gray-700">
          <div className="text-2xl font-bold text-white">{userStats.totalQuizzes}</div>
          <div className="text-sm text-gray-400">Quizzes Taken</div>
        </div>
        <div className="bg-white/5 p-4 rounded-lg border border-gray-700">
          <div className="text-2xl font-bold text-white">{userStats.totalScore}</div>
          <div className="text-sm text-gray-400">Total Score</div>
        </div>
        <div className="bg-white/5 p-4 rounded-lg border border-gray-700">
          <div className="text-2xl font-bold text-white">{userStats.averageScore}/5</div>
          <div className="text-sm text-gray-400">Average Score</div>
        </div>
        <div className="bg-white/5 p-4 rounded-lg border border-gray-700">
          <div className="text-2xl font-bold text-white">{userStats.accuracy}%</div>
          <div className="text-sm text-gray-400">Accuracy</div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfileStats;

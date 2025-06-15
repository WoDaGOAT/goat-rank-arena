
import { useQuizLeaderboard } from "@/hooks/useQuizLeaderboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import QuizLeaderboardRow from "@/components/quiz/QuizLeaderboardRow";
import { Trophy } from "lucide-react";

const QuizLeaderboard = () => {
    const { data: leaderboard, isLoading, isError } = useQuizLeaderboard();

    if (isLoading) {
        return (
            <div className="space-y-2 max-w-4xl mx-auto">
                {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} className="h-[76px] w-full bg-white/5 rounded-lg" />
                ))}
            </div>
        );
    }

    if (isError) {
        return <p className="text-center text-red-400 max-w-4xl mx-auto py-10">Failed to load the leaderboard. Please try again later.</p>;
    }

    if (!leaderboard || leaderboard.length === 0) {
        return <p className="text-center text-gray-400 max-w-4xl mx-auto py-10">No one has taken any quizzes yet. Be the first!</p>;
    }
    
    return (
        <Card className="bg-white/5 border-white/10 text-white max-w-4xl mx-auto">
            <CardHeader className="border-b border-white/10">
                <div className="flex items-center gap-4">
                    <Trophy className="h-8 w-8 text-yellow-400" />
                    <div>
                        <CardTitle className="text-2xl font-bold">Quiz Leaderboard</CardTitle>
                        <CardDescription className="text-gray-400">Top players based on total quiz scores.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-white/10">
                    <div className="grid grid-cols-[60px_1fr_120px_120px] items-center p-3 text-xs uppercase text-gray-400 font-bold tracking-wider">
                        <div className="text-center">Rank</div>
                        <div className="pl-4">Player</div>
                        <div className="text-center">Total Score</div>
                        <div className="text-center">Quizzes</div>
                    </div>
                    {leaderboard.map((user, index) => (
                        <QuizLeaderboardRow key={user.user_id} user={user} rank={index + 1} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default QuizLeaderboard;

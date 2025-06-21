
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { UserQuizAttemptForProfile } from "@/types/quiz";
import { Award, History, Target } from "lucide-react";
import { useUserBadges } from "@/hooks/useUserBadges";
import BadgeCard from "@/components/quiz/BadgeCard";

interface QuizActivityProps {
    quizAttempts: UserQuizAttemptForProfile[] | undefined;
    isLoading: boolean;
}

const QuizActivity = ({ quizAttempts, isLoading }: QuizActivityProps) => {
    const { userBadges, loading: badgesLoading } = useUserBadges();

    const getScoreColor = (score: number) => {
        if (score === 5) return "text-yellow-400 font-bold"; // Perfect score
        if (score >= 4) return "text-green-400 font-semibold"; // Excellent
        if (score >= 3) return "text-blue-400"; // Good
        if (score >= 2) return "text-orange-400"; // Okay
        return "text-gray-400"; // Needs improvement
    };

    const getScoreLabel = (score: number) => {
        if (score === 5) return "Perfect! 🏆";
        if (score >= 4) return "Excellent!";
        if (score >= 3) return "Good job!";
        if (score >= 2) return "Not bad!";
        return "Keep trying!";
    };

    return (
        <div className="space-y-6 pt-4">
            <div>
                <h3 className="text-xl font-semibold border-b border-gray-600 pb-2 mb-3 flex items-center gap-2">
                    <History className="h-5 w-5" />
                    My Daily Quiz History
                </h3>
                {isLoading ? (
                    <div className="space-y-3">
                        <Skeleton className="h-16 w-full bg-gray-700 rounded-md" />
                        <Skeleton className="h-16 w-full bg-gray-700 rounded-md" />
                    </div>
                ) : quizAttempts && quizAttempts.length > 0 ? (
                    <ul className="space-y-3 text-gray-300">
                        {quizAttempts.map(attempt => (
                            <li key={attempt.id} className="p-4 bg-white/5 rounded-lg border border-gray-700/50 hover:bg-white/10 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <span className="font-semibold text-white block mb-1">
                                            {attempt.quizzes?.title || 'Daily Quiz'}
                                        </span>
                                        <div className="text-gray-400 text-xs">
                                            {format(new Date(attempt.completed_at), 'MMM d, yyyy, p')}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-2xl font-bold ${getScoreColor(attempt.score)}`}>
                                            {attempt.score}/5
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {getScoreLabel(attempt.score)}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Progress bar for visual representation */}
                                <div className="mt-3">
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full transition-all ${
                                                attempt.score === 5 ? 'bg-yellow-500' :
                                                attempt.score >= 4 ? 'bg-green-500' :
                                                attempt.score >= 3 ? 'bg-blue-500' :
                                                attempt.score >= 2 ? 'bg-orange-500' : 'bg-gray-500'
                                            }`}
                                            style={{ width: `${(attempt.score / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                                        <span>0</span>
                                        <span className="flex items-center gap-1">
                                            <Target className="h-3 w-3" />
                                            Max: 5 points
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-4">🎯</div>
                        <p className="text-gray-400 text-sm mb-2">No daily quizzes taken yet</p>
                        <p className="text-gray-500 text-xs">Take today's 5-question quiz to start your journey!</p>
                    </div>
                )}
            </div>
            
            <div>
                <h3 className="text-xl font-semibold border-b border-gray-600 pb-2 mb-3 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    My Badges ({userBadges.length})
                </h3>
                {badgesLoading ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-20 w-full bg-gray-700 rounded-md" />
                        ))}
                    </div>
                ) : userBadges.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {userBadges.slice(0, 12).map(userBadge => (
                            <BadgeCard
                                key={userBadge.id}
                                badge={userBadge.badge}
                                userBadge={userBadge}
                                isEarned={true}
                                className="bg-white/5 border-gray-600"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-4">🏆</div>
                        <p className="text-gray-400 text-sm mb-2">No badges earned yet</p>
                        <p className="text-gray-500 text-xs">Complete daily quizzes to start earning badges!</p>
                    </div>
                )}
                
                {userBadges.length > 12 && (
                    <div className="mt-4 text-center">
                        <p className="text-gray-400 text-sm">
                            And {userBadges.length - 12} more badge{userBadges.length - 12 !== 1 ? 's' : ''}...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizActivity;


import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { UserQuizAttemptForProfile } from "@/types/quiz";
import { Award, History } from "lucide-react";
import { useUserBadges } from "@/hooks/useUserBadges";
import BadgeCard from "@/components/quiz/BadgeCard";
import { BADGES } from "@/data/badges";

interface QuizActivityProps {
    quizAttempts: UserQuizAttemptForProfile[] | undefined;
    isLoading: boolean;
}

const QuizActivity = ({ quizAttempts, isLoading }: QuizActivityProps) => {
    const { userBadges, loading: badgesLoading } = useUserBadges();

    const getTotalQuestions = (attempt: UserQuizAttemptForProfile) => {
        return attempt.quizzes?.quiz_questions?.length || 0;
    }

    return (
        <div className="space-y-6 pt-4">
            <div>
                <h3 className="text-xl font-semibold border-b border-gray-600 pb-2 mb-3 flex items-center gap-2">
                    <History className="h-5 w-5" />
                    My Quiz History
                </h3>
                 {isLoading ? (
                    <div className="space-y-3">
                        <Skeleton className="h-12 w-full bg-gray-700 rounded-md" />
                        <Skeleton className="h-12 w-full bg-gray-700 rounded-md" />
                    </div>
                ) : quizAttempts && quizAttempts.length > 0 ? (
                    <ul className="space-y-3 text-gray-300">
                        {quizAttempts.map(attempt => (
                            <li key={attempt.id} className="text-sm p-3 bg-white/5 rounded-lg border border-gray-700/50">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-white">
                                        {attempt.quizzes?.title || 'Daily Quiz'}
                                    </span>
                                    <span className="font-bold text-primary text-lg">
                                        {attempt.score} / {getTotalQuestions(attempt)}
                                    </span>
                                </div>
                                <div className="text-gray-400 text-xs mt-1">
                                  {format(new Date(attempt.completed_at), 'MMM d, yyyy, p')}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 text-sm">No quizzes taken yet. Take today's quiz!</p>
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
                    <p className="text-gray-400 text-sm">No badges earned yet. Complete quizzes to start earning badges!</p>
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

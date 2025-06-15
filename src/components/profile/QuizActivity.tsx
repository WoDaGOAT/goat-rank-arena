
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { UserQuizAttemptForProfile } from "@/types/quiz";
import { Award, History } from "lucide-react";

interface QuizActivityProps {
    quizAttempts: UserQuizAttemptForProfile[] | undefined;
    isLoading: boolean;
}

const QuizActivity = ({ quizAttempts, isLoading }: QuizActivityProps) => {
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
                    My Badges
                </h3>
                <p className="text-gray-400 text-sm">Badge system coming soon! Keep taking quizzes to earn them.</p>
            </div>
        </div>
    );
};

export default QuizActivity;

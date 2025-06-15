
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Quiz, QuizAttempt, UserAnswerSelection } from "@/types/quiz";
import Navbar from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import QuizView from "@/components/quiz/QuizView";
import QuizResult from "@/components/quiz/QuizResult";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import QuizLeaderboard from "@/components/quiz/QuizLeaderboard";
import { Swords, Trophy } from "lucide-react";

const fetchTodaysQuiz = async () => {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('quizzes')
    .select(`*, quiz_questions(*, quiz_answers(*))`)
    .eq('active_date', today)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Quiz | null;
};

const fetchUserAttempt = async (userId: string, quizId: string) => {
    if (!userId || !quizId) return null;
    const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', userId)
        .eq('quiz_id', quizId)
        .maybeSingle();
    
    if (error) {
        throw new Error(error.message);
    }
    return data as QuizAttempt | null;
};


const QuizPage = () => {
    const { user, loading: authLoading } = useAuth();
    const queryClient = useQueryClient();
    const [view, setView] = useState<'quiz' | 'leaderboard'>('quiz');

    const { data: quiz, isLoading: quizLoading, isError: quizError } = useQuery({
        queryKey: ['todaysQuiz'],
        queryFn: fetchTodaysQuiz,
        retry: 1,
    });
    
    const { data: userAttempt, isLoading: attemptLoading } = useQuery({
        queryKey: ['userAttempt', user?.id, quiz?.id],
        queryFn: () => fetchUserAttempt(user!.id, quiz!.id),
        enabled: !!user && !!quiz,
    });

    const saveAttemptMutation = useMutation({
        mutationFn: async ({ score, answers }: { score: number, answers: UserAnswerSelection }) => {
            if (!user || !quiz) throw new Error("User or quiz not found");
            
            const { error } = await supabase.from('quiz_attempts').insert({
                user_id: user.id,
                quiz_id: quiz.id,
                score,
                answers,
                started_at: new Date().toISOString(),
            });

            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            toast.success("Quiz submitted successfully!");
            queryClient.invalidateQueries({ queryKey: ['userAttempt', user?.id, quiz?.id] });
        },
        onError: (error) => {
            toast.error(`Failed to save quiz attempt: ${error.message}`);
        }
    });

    const handleSubmit = (answers: UserAnswerSelection) => {
        let score = 0;
        quiz?.quiz_questions.forEach(q => {
            const correctAnswer = q.quiz_answers.find(a => a.is_correct);
            if (correctAnswer && answers[q.id] === correctAnswer.id) {
                score++;
            }
        });
        saveAttemptMutation.mutate({ score, answers });
    };

    const renderContent = () => {
        if (authLoading || quizLoading || attemptLoading) {
            return <Skeleton className="h-[400px] w-full max-w-3xl mx-auto bg-white/5" />;
        }
        
        if (!user) {
            return (
                <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">Ready for a Challenge?</h2>
                    <p className="text-lg text-gray-300 mb-6">Please log in or sign up to take the daily quiz.</p>
                </div>
            )
        }

        if (quizError) {
             return <p className="text-center text-red-400 text-lg">Could not load quiz. Please try again later.</p>;
        }

        if (!quiz) {
            return (
                 <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">No Quiz Today!</h2>
                    <p className="text-lg text-gray-300 mb-6">Check back tomorrow for a new challenge.</p>
                     <Link to="/">
                        <Button>Go Home</Button>
                    </Link>
                </div>
            );
        }
        
        if (userAttempt) {
            return <QuizResult score={userAttempt.score} totalQuestions={quiz.quiz_questions.length} />;
        }

        return <QuizView quiz={quiz} onSubmit={handleSubmit} />;
    };

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen py-12 px-4"
        style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}
      >
        <main className="container mx-auto">
            <div className="flex justify-center mb-8 gap-4">
                <Button onClick={() => setView('quiz')} variant={view === 'quiz' ? 'default' : 'outline'} className="w-48">
                    <Swords className="mr-2 h-4 w-4" />
                    Daily Quiz
                </Button>
                <Button onClick={() => setView('leaderboard')} variant={view === 'leaderboard' ? 'default' : 'outline'} className="w-48">
                    <Trophy className="mr-2 h-4 w-4" />
                    Leaderboard
                </Button>
            </div>
            {view === 'quiz' ? renderContent() : <QuizLeaderboard />}
        </main>
      </div>
    </>
  );
};

export default QuizPage;

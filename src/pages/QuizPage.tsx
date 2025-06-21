
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Quiz, QuizAttempt, UserAnswerSelection } from "@/types/quiz";
import { Skeleton } from "@/components/ui/skeleton";
import QuizView from "@/components/quiz/QuizView";
import QuizResult from "@/components/quiz/QuizResult";
import QuizLeaderboard from "@/components/quiz/QuizLeaderboard";
import BadgeShowcase from "@/components/quiz/BadgeShowcase";
import UserStatsCard from "@/components/quiz/UserStatsCard";
import QuizProgressChart from "@/components/quiz/QuizProgressChart";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Swords, Trophy, Award, TrendingUp, Calendar, Clock } from "lucide-react";
import { useUserStats } from "@/hooks/useUserStats";
import { useUserQuizAttempts } from "@/hooks/useUserQuizAttempts";
import { useUserBadges } from "@/hooks/useUserBadges";

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

// Function to manually check and award badges
const checkAndAwardBadges = async (userId: string) => {
  try {
    console.log('Manually triggering badge check for user:', userId);
    const { error } = await supabase.rpc('check_and_award_badges', {
      p_user_id: userId
    });
    
    if (error) {
      console.error('Error checking badges:', error);
    } else {
      console.log('Badge check completed successfully');
    }
  } catch (error) {
    console.error('Error calling badge check function:', error);
  }
};

const QuizPage = () => {
    const { user, loading: authLoading } = useAuth();
    const queryClient = useQueryClient();
    const [view, setView] = useState<'quiz' | 'leaderboard' | 'badges' | 'progress'>('quiz');
    
    const { stats, loading: statsLoading } = useUserStats();
    const { data: userQuizAttempts, isLoading: attemptsLoading } = useUserQuizAttempts();
    const { userBadges, loading: badgesLoading, refreshBadges } = useUserBadges();

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
            
            console.log('Saving quiz attempt for user:', user.id, 'with score:', score);
            
            const { error } = await supabase.from('quiz_attempts').insert({
                user_id: user.id,
                quiz_id: quiz.id,
                score,
                answers,
                started_at: new Date().toISOString(),
            });

            if (error) throw new Error(error.message);
            
            console.log('Quiz attempt saved successfully');
        },
        onSuccess: async () => {
            toast.success("Quiz submitted successfully!");
            queryClient.invalidateQueries({ queryKey: ['userAttempt', user?.id, quiz?.id] });
            queryClient.invalidateQueries({ queryKey: ['userQuizAttempts', user?.id] });
            queryClient.invalidateQueries({ queryKey: ['userStats', user?.id] });
            
            // Refresh badges after quiz completion (the trigger should award them automatically)
            if (refreshBadges) {
                setTimeout(() => {
                    refreshBadges();
                }, 1000); // Small delay to ensure trigger has completed
            }
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

    const getNextQuizCountdown = () => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const diff = tomorrow.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${hours}h ${minutes}m`;
    };

    const mockUserBadges = []; // This would come from a real API call

    const chartData = userQuizAttempts?.map(attempt => ({
        date: attempt.completed_at,
        score: attempt.score,
        percentage: attempt.quizzes?.quiz_questions ? (attempt.score / attempt.quizzes.quiz_questions.length) * 100 : 0
    })) || [];

    const renderContent = () => {
        if (authLoading || quizLoading || attemptLoading) {
            return <Skeleton className="h-[400px] w-full max-w-4xl mx-auto bg-white/5" />;
        }
        
        if (!user) {
            return (
                <div className="text-center text-white max-w-md mx-auto">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold mb-4">🎯 Ready for the Challenge?</h2>
                        <p className="text-lg text-gray-300 mb-6">Join WoDaGOAT and test your sports knowledge with our daily quizzes!</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                        <h3 className="text-xl font-semibold mb-4">Why Take Our Quizzes?</h3>
                        <ul className="text-left space-y-2 text-gray-300">
                            <li className="flex items-center gap-2">
                                <Trophy className="h-4 w-4 text-yellow-400" />
                                Earn badges and climb the leaderboard
                            </li>
                            <li className="flex items-center gap-2">
                                <Swords className="h-4 w-4 text-blue-400" />
                                Daily challenges to test your knowledge
                            </li>
                            <li className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-purple-400" />
                                Unlock achievements and track your progress
                            </li>
                        </ul>
                        <p className="text-sm text-gray-400 mt-4">Sign up now to start your journey to becoming the ultimate sports GOAT!</p>
                    </div>
                </div>
            )
        }

        if (quizError) {
             return <p className="text-center text-red-400 text-lg">Could not load quiz. Please try again later.</p>;
        }

        if (!quiz) {
            return (
                 <div className="text-center text-white max-w-md mx-auto">
                    <h2 className="text-2xl font-bold mb-4">No Quiz Today!</h2>
                    <p className="text-lg text-gray-300 mb-4">Check back tomorrow for a new challenge.</p>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 mb-6">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Clock className="h-5 w-5 text-blue-400" />
                            <span className="font-semibold">Next Quiz In:</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-400">{getNextQuizCountdown()}</p>
                    </div>
                     <Link to="/">
                        <Button>Go Home</Button>
                    </Link>
                </div>
            );
        }
        
        if (userAttempt) {
            return (
                <div className="space-y-6">
                    <QuizResult score={userAttempt.score} totalQuestions={quiz.quiz_questions.length} />
                    {stats && <UserStatsCard stats={stats} />}
                    {user && (
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                            <Button 
                                onClick={refreshBadges}
                                className="w-full"
                                variant="outline"
                            >
                                🏆 Check for New Badges
                            </Button>
                            <p className="text-xs text-gray-400 mt-2 text-center">
                                Click to check if you've earned any new badges
                            </p>
                        </div>
                    )}
                </div>
            );
        }

        return <QuizView quiz={quiz} onSubmit={handleSubmit} />;
    };

    const renderDashboard = () => {
        if (view === 'quiz') {
            return (
                <div className="space-y-6">
                    {user && stats && !statsLoading && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                {renderContent()}
                            </div>
                            <div>
                                <UserStatsCard stats={stats} />
                            </div>
                        </div>
                    )}
                    {(!user || statsLoading) && renderContent()}
                </div>
            );
        }

        if (view === 'badges') {
            return <BadgeShowcase userBadges={userBadges} />;
        }

        if (view === 'progress') {
            return (
                <div className="space-y-6">
                    {stats && <UserStatsCard stats={stats} />}
                    <QuizProgressChart data={chartData} />
                </div>
            );
        }

        return <QuizLeaderboard />;
    };

  return (
    <div
      className="py-8 px-4 flex flex-col flex-grow min-h-screen"
      style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}
    >
      <div className="container mx-auto flex-grow max-w-6xl">
          <div className="flex flex-wrap justify-center mb-8 gap-2">
              <Button 
                onClick={() => setView('quiz')} 
                variant={view === 'quiz' ? 'default' : 'secondary'} 
                className="flex-1 sm:flex-none sm:w-40 bg-white/10 border-white/20 text-white hover:bg-white/20 data-[state=active]:bg-blue-600"
                style={view === 'quiz' ? { backgroundColor: '#3b82f6' } : {}}
              >
                  <Swords className="mr-2 h-4 w-4" />
                  Daily Quiz
              </Button>
              <Button 
                onClick={() => setView('leaderboard')} 
                variant={view === 'leaderboard' ? 'default' : 'secondary'} 
                className="flex-1 sm:flex-none sm:w-40 bg-white/10 border-white/20 text-white hover:bg-white/20 data-[state=active]:bg-blue-600"
                style={view === 'leaderboard' ? { backgroundColor: '#3b82f6' } : {}}
              >
                  <Trophy className="mr-2 h-4 w-4" />
                  Leaderboard
              </Button>
              <Button 
                onClick={() => setView('badges')} 
                variant={view === 'badges' ? 'default' : 'secondary'} 
                className="flex-1 sm:flex-none sm:w-40 bg-white/10 border-white/20 text-white hover:bg-white/20 data-[state=active]:bg-blue-600"
                style={view === 'badges' ? { backgroundColor: '#3b82f6' } : {}}
              >
                  <Award className="mr-2 h-4 w-4" />
                  Badges
              </Button>
              <Button 
                onClick={() => setView('progress')} 
                variant={view === 'progress' ? 'default' : 'secondary'} 
                className="flex-1 sm:flex-none sm:w-40 bg-white/10 border-white/20 text-white hover:bg-white/20 data-[state=active]:bg-blue-600"
                style={view === 'progress' ? { backgroundColor: '#3b82f6' } : {}}
              >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Progress
              </Button>
          </div>
          {renderDashboard()}
      </div>
    </div>
  );
};

export default QuizPage;

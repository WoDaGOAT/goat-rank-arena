
import { QuizLeaderboardUser } from '@/hooks/useQuizLeaderboard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Medal, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuizLeaderboardRowProps {
  user: QuizLeaderboardUser;
  rank: number;
}

const rankBgColors = [
    "bg-yellow-500/10",
    "bg-gray-400/10",
    "bg-amber-600/10",
];

const rankTextColors = [
    "text-yellow-400",
    "text-gray-300",
    "text-amber-500",
];

const rankBorderColors = [
    "border-yellow-500/30",
    "border-gray-400/30",
    "border-amber-600/30",
];

const QuizLeaderboardRow = ({ user, rank }: QuizLeaderboardRowProps) => {

    const getRankIcon = () => {
        if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
        if (rank === 3) return <Trophy className="w-6 h-6 text-amber-600" />;
        return <span className="font-bold text-lg text-gray-400 w-6 text-center">{rank}</span>;
    };
    
    const rowStyle = rank <= 3 ? `${rankBgColors[rank - 1]} border-l-4 ${rankBorderColors[rank - 1]}` : "hover:bg-white/5";

    return (
        <div className={`grid grid-cols-[60px_1fr_120px_120px] items-center p-3 transition-colors duration-200 ${rowStyle}`}>
            <div className="flex items-center justify-center">{getRankIcon()}</div>

            <Link to={`/users/${user.user_id}`} className="flex items-center gap-4 group overflow-hidden">
                <Avatar className="h-10 w-10 border-2 border-white/20">
                    <AvatarImage src={user.avatar_url || undefined} alt={user.full_name || 'User'} />
                    <AvatarFallback>{user.full_name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="truncate">
                    <p className="font-semibold text-white group-hover:underline truncate">{user.full_name || 'Anonymous User'}</p>
                    <p className={`text-sm ${rank <=3 ? rankTextColors[rank-1] : 'text-gray-400'}`}>
                        {rank === 1 ? "Quiz Champion" : `Rank ${rank}`}
                    </p>
                </div>
            </Link>
            
            <div className="text-center">
                <p className="font-bold text-xl text-blue-300">{user.total_score}</p>
                <p className="text-xs text-gray-400">Total Score</p>
            </div>

            <div className="text-center">
                <p className="font-bold text-xl text-green-300">{user.quizzes_completed}</p>
                <p className="text-xs text-gray-400">Quizzes Taken</p>
            </div>
        </div>
    );
};

export default QuizLeaderboardRow;

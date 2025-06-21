
import { QuizLeaderboardUser } from '@/hooks/useQuizLeaderboard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Medal, Trophy, Award } from 'lucide-react';
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

const badgeRarityColors = {
    legendary: "text-yellow-400",
    epic: "text-purple-400", 
    rare: "text-blue-400",
    common: "text-green-400"
};

const QuizLeaderboardRow = ({ user, rank }: QuizLeaderboardRowProps) => {

    const getRankIcon = () => {
        if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
        if (rank === 3) return <Trophy className="w-6 h-6 text-amber-600" />;
        return <span className="font-bold text-lg text-gray-400 w-6 text-center">{rank}</span>;
    };
    
    const rowStyle = rank <= 3 ? `${rankBgColors[rank - 1]} border-l-4 ${rankBorderColors[rank - 1]}` : "hover:bg-white/5";

    const getBadgeDisplay = () => {
        if (user.highest_badge_name) {
            const rarityColor = badgeRarityColors[user.highest_badge_rarity as keyof typeof badgeRarityColors] || "text-gray-400";
            return (
                <div className="flex items-center gap-1">
                    <Award className={`w-3 h-3 ${rarityColor}`} />
                    <span className={`text-sm ${rarityColor}`}>{user.highest_badge_name}</span>
                </div>
            );
        }
        
        // Fallback for users without badges
        if (rank === 1) return <span className="text-sm text-yellow-400">Quiz Champion</span>;
        if (rank === 2) return <span className="text-sm text-gray-300">2nd Place</span>;
        if (rank === 3) return <span className="text-sm text-amber-500">3rd Place</span>;
        return <span className="text-sm text-gray-400">Rank {rank}</span>;
    };

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
                    {getBadgeDisplay()}
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

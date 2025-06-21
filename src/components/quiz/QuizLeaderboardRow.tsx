
import { QuizLeaderboardUser } from '@/hooks/useQuizLeaderboard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  getBadgeById, 
  getBadgeIcon, 
  getBadgeRarityColor, 
  getRankFallback 
} from '@/utils/badgeLookup';

interface QuizLeaderboardRowProps {
  user: QuizLeaderboardUser;
  rank: number;
}

const QuizLeaderboardRow = ({ user, rank }: QuizLeaderboardRowProps) => {
    console.log(`QuizLeaderboardRow for user ${user.user_id} at rank ${rank}:`, {
        highest_badge_id: user.highest_badge_id,
        highest_badge_name: user.highest_badge_name,
        highest_badge_rarity: user.highest_badge_rarity,
    });

    const getRankIcon = () => {
        // Try to get the user's actual badge first
        if (user.highest_badge_id) {
            const badge = getBadgeById(user.highest_badge_id);
            if (badge) {
                const IconComponent = getBadgeIcon(badge);
                const rarityColor = getBadgeRarityColor(user.highest_badge_rarity || 'common');
                
                console.log(`Displaying badge icon for ${badge.name} with rarity ${badge.rarity}`);
                
                return (
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                        rank <= 3 ? getRankFallback(rank).bgColor : 'bg-gray-600/30'
                    } ${
                        rank <= 3 ? getRankFallback(rank).borderColor : 'border-gray-500/50'
                    }`}>
                        <IconComponent 
                            size={24}
                            className={rarityColor}
                            strokeWidth={2}
                        />
                    </div>
                );
            }
        }
        
        // Fallback to rank-based icons
        const fallback = getRankFallback(rank);
        console.log(`Using rank fallback for rank ${rank}`);
        
        if (fallback.icon) {
            const IconComponent = fallback.icon;
            return (
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${fallback.bgColor} ${fallback.borderColor}`}>
                    <IconComponent 
                        size={24}
                        className={fallback.textColor}
                        strokeWidth={2}
                        fill="currentColor"
                    />
                </div>
            );
        }
        
        // For ranks 4+, show the number
        return (
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${fallback.bgColor} ${fallback.borderColor}`}>
                <span className={`font-bold text-lg ${fallback.textColor}`}>
                    {rank}
                </span>
            </div>
        );
    };
    
    const rowStyle = rank <= 3 ? `${getRankFallback(rank).bgColor.replace('/30', '/10')} border-l-4 ${getRankFallback(rank).borderColor}` : "hover:bg-white/5";

    const getBadgeDisplay = () => {
        console.log('getBadgeDisplay called with:', {
            badge_id: user.highest_badge_id,
            badge_name: user.highest_badge_name,
            badge_rarity: user.highest_badge_rarity,
        });

        // Show actual badge if available
        if (user.highest_badge_id && user.highest_badge_name) {
            const badge = getBadgeById(user.highest_badge_id);
            const rarityColor = getBadgeRarityColor(user.highest_badge_rarity || 'common');
            
            console.log(`Displaying badge: ${user.highest_badge_name} with rarity: ${user.highest_badge_rarity}`);
            
            return (
                <div className="flex items-center gap-1">
                    <Award className={`w-3 h-3 ${rarityColor}`} />
                    <span className={`text-sm ${rarityColor}`}>{user.highest_badge_name}</span>
                </div>
            );
        }
        
        // Fallback to rank-based labels
        const fallback = getRankFallback(rank);
        console.log(`No badge found, using rank fallback: ${fallback.label}`);
        
        return <span className={`text-sm ${fallback.textColor}`}>{fallback.label}</span>;
    };

    return (
        <div className={`grid grid-cols-[80px_1fr_120px_120px] items-center p-3 transition-colors duration-200 ${rowStyle}`}>
            <div className="flex items-center justify-center min-h-[48px]">
                {getRankIcon()}
            </div>

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

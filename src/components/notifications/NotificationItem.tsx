
import { Link } from 'react-router-dom';
import { Notification } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Layers, UserPlus, Users, Heart, Trophy, Flame, ThumbsUp, Frown, Award, Star, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface NotificationItemProps {
    notification: Notification;
    acceptFriendRequest: (friendshipId: string) => void;
    declineFriendRequest: (friendshipId: string) => void;
    isAccepting: boolean;
    isDeclining: boolean;
}

const NotificationItem = ({ notification, acceptFriendRequest, declineFriendRequest, isAccepting, isDeclining }: NotificationItemProps) => {
    const renderContent = () => {
        switch (notification.type) {
            case 'new_comment_reply':
                return (
                    <p>
                        <span className="font-semibold">{notification.data.replying_user_name || 'Someone'}</span> replied to your comment on{' '}
                        <span className="font-semibold">{notification.data.category_name}</span>.
                    </p>
                );
            case 'new_category':
                return (
                    <p>
                        A new leaderboard has been added:{' '}
                        <span className="font-semibold">{notification.data.category_name}</span>.
                    </p>
                );
            case 'new_friend_request':
                return (
                    <p>
                        <span className="font-semibold">{notification.data.requester_name || 'Someone'}</span> sent you a friend request.
                    </p>
                );
            case 'friend_request_accepted':
                 return (
                    <p>
                        You and <span className="font-semibold">{notification.data.receiver_name || 'Someone'}</span> are now friends.
                    </p>
                );
            case 'ranking_reaction':
                const reactionEmoji = notification.data.reaction_type === 'thumbs-up' ? '👍' 
                    : notification.data.reaction_type === 'trophy' ? '🏆'
                    : notification.data.reaction_type === 'flame' ? '🔥'
                    : notification.data.reaction_type === 'frown' ? '😔'
                    : '👍';
                
                return (
                    <p>
                        <span className="font-semibold">{notification.data.reacting_user_name || 'Someone'}</span> reacted {reactionEmoji} to your ranking{' '}
                        <span className="font-semibold">"{notification.data.ranking_title}"</span>.
                    </p>
                );
            case 'category_reaction':
                return (
                    <p>
                        <span className="font-semibold">{notification.data.reacting_user_name || 'Someone'}</span> reacted to the category{' '}
                        <span className="font-semibold">{notification.data.category_name}</span>.
                    </p>
                );
            case 'quiz_completed':
                const score = notification.data.score || 0;
                const totalQuestions = notification.data.total_questions || 5;
                const accuracy = Math.round((score / totalQuestions) * 100);
                
                return (
                    <p>
                        You completed <span className="font-semibold">{notification.data.quiz_title}</span>{' '}
                        with a score of <span className="font-semibold">{score}/{totalQuestions}</span>{' '}
                        ({accuracy}% accuracy).
                    </p>
                );
            case 'badge_earned':
                return (
                    <p>
                        Congratulations! You earned the{' '}
                        <span className="font-semibold">{notification.data.badge_name}</span> badge.{' '}
                        <span className="text-gray-400">{notification.data.badge_description}</span>
                    </p>
                );
            default:
                const _exhaustiveCheck: never = notification;
                return <p>You have a new notification.</p>;
        }
    };
    
    const getReactionIcon = (reactionType: string) => {
        switch (reactionType) {
            case 'thumbs-up':
                return <ThumbsUp className="w-5 h-5 text-blue-400" />;
            case 'trophy':
                return <Trophy className="w-5 h-5 text-yellow-400" />;
            case 'flame':
                return <Flame className="w-5 h-5 text-orange-400" />;
            case 'frown':
                return <Frown className="w-5 h-5 text-red-400" />;
            default:
                return <Heart className="w-5 h-5 text-pink-400" />;
        }
    };

    const getQuizIcon = (accuracy: number) => {
        if (accuracy === 100) return <Star className="w-5 h-5 text-yellow-400" />;
        if (accuracy >= 80) return <Trophy className="w-5 h-5 text-green-400" />;
        return <Target className="w-5 h-5 text-blue-400" />;
    };

    const getBadgeIcon = (badgeRarity: string) => {
        switch (badgeRarity) {
            case 'legendary': return <Star className="w-5 h-5 text-yellow-400" />;
            case 'epic': return <Trophy className="w-5 h-5 text-purple-400" />;
            case 'rare': return <Award className="w-5 h-5 text-blue-400" />;
            default: return <Award className="w-5 h-5 text-green-400" />;
        }
    };
    
    const icon = notification.type === 'new_comment_reply' 
        ? <MessageSquare className="w-5 h-5 text-blue-400" />
        : notification.type === 'new_category'
        ? <Layers className="w-5 h-5 text-green-400" />
        : notification.type === 'new_friend_request'
        ? <UserPlus className="w-5 h-5 text-purple-400" />
        : notification.type === 'friend_request_accepted'
        ? <Users className="w-5 h-5 text-teal-400" />
        : notification.type === 'ranking_reaction'
        ? getReactionIcon(notification.data.reaction_type)
        : notification.type === 'category_reaction'
        ? getReactionIcon(notification.data.reaction_type)
        : notification.type === 'quiz_completed'
        ? getQuizIcon(Math.round(((notification.data.score || 0) / (notification.data.total_questions || 5)) * 100))
        : notification.type === 'badge_earned'
        ? getBadgeIcon(notification.data.badge_rarity || 'common')
        : <MessageSquare className="w-5 h-5 text-gray-400" />;

    const handleAccept = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (notification.type === 'new_friend_request') {
            acceptFriendRequest(notification.data.friendship_id);
        }
    };

    const handleDecline = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (notification.type === 'new_friend_request') {
            declineFriendRequest(notification.data.friendship_id);
        }
    };

    const content = (
        <div className="flex items-start gap-3 relative">
            {!notification.is_read && (
                <div className="w-2 h-2 rounded-full bg-blue-500 absolute top-2 left-[-4px]"></div>
            )}
            <div className="flex-shrink-0 pt-1">
                {icon}
            </div>
            <div className="flex-1">
                <div className={cn("text-sm", notification.is_read ? "text-gray-400" : "text-white")}>
                    {renderContent()}
                </div>
                 {notification.type === 'new_friend_request' && (
                    <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" onClick={handleAccept} disabled={isAccepting || isDeclining}>
                            {isAccepting ? "Accepting..." : "Accept"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDecline} disabled={isAccepting || isDeclining}>
                            {isDeclining ? "Declining..." : "Decline"}
                        </Button>
                    </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </p>
            </div>
        </div>
    );

    if (notification.type === 'new_comment_reply' || notification.type === 'new_category') {
        return (
            <Link 
                to={`/category/${notification.data.category_id}`} 
                className="block p-3 hover:bg-white/10 rounded-md transition-colors"
            >
                {content}
            </Link>
        );
    }

    if (notification.type === 'ranking_reaction') {
        return (
            <Link 
                to={`/user-ranking/${notification.data.ranking_id}`} 
                className="block p-3 hover:bg-white/10 rounded-md transition-colors"
            >
                {content}
            </Link>
        );
    }

    if (notification.type === 'category_reaction') {
        return (
            <Link 
                to={`/category/${notification.data.category_id}`} 
                className="block p-3 hover:bg-white/10 rounded-md transition-colors"
            >
                {content}
            </Link>
        );
    }

    // Quiz completed and badge earned notifications are not clickable but still show content
    return (
        <div className="block p-3 hover:bg-white/10 rounded-md transition-colors cursor-default">
            {content}
        </div>
    );
};

export default NotificationItem;

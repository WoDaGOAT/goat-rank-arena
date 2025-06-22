
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { sanitize } from "@/lib/sanitize";
import { Trophy, Heart, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { useFriendshipStatus } from "@/hooks/useFriendshipStatus";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export interface RankedAthlete {
  id: string;
  name: string;
  imageUrl: string;
  position: number;
  points: number;
}

export interface NewRankingFeedData {
  author: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  ranking_id: string;
  ranking_title: string;
  ranking_description?: string;
  category_id: string;
  category_name: string;
  athletes: RankedAthlete[];
}

interface NewRankingFeedItemProps {
  data: NewRankingFeedData;
  createdAt: string;
}

const NewRankingFeedItem = ({ data, createdAt }: NewRankingFeedItemProps) => {
  const { user } = useAuthState();
  const { data: friendshipStatus } = useFriendshipStatus(user?.id, data.author.id);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});
  const [commentCount, setCommentCount] = useState(0);
  
  const authorName = data.author.full_name || 'Anonymous';
  const sanitizedAuthorName = sanitize(authorName);
  const sanitizedTitle = sanitize(data.ranking_title);
  const sanitizedCategoryName = sanitize(data.category_name);
  const sanitizedDescription = data.ranking_description ? sanitize(data.ranking_description) : null;

  // Fetch user's reaction and reaction counts
  useEffect(() => {
    const fetchReactionData = async () => {
      if (!data.ranking_id) return;

      try {
        // Fetch user's reaction
        if (user) {
          const { data: userReactionData } = await supabase
            .from('ranking_reactions')
            .select('reaction_type')
            .eq('ranking_id', data.ranking_id)
            .eq('user_id', user.id)
            .maybeSingle();

          setUserReaction(userReactionData?.reaction_type || null);
        }

        // Fetch all reactions for counts
        const { data: allReactions } = await supabase
          .from('ranking_reactions')
          .select('reaction_type')
          .eq('ranking_id', data.ranking_id);

        const counts: Record<string, number> = {};
        allReactions?.forEach(reaction => {
          counts[reaction.reaction_type] = (counts[reaction.reaction_type] || 0) + 1;
        });
        setReactionCounts(counts);
      } catch (error) {
        console.error('Error fetching reaction data:', error);
      }
    };

    fetchReactionData();
  }, [data.ranking_id, user]);

  // Fetch comment count
  useEffect(() => {
    const fetchCommentCount = async () => {
      if (!data.ranking_id) return;

      try {
        const { count } = await supabase
          .from('ranking_comments')
          .select('*', { count: 'exact', head: true })
          .eq('ranking_id', data.ranking_id);

        setCommentCount(count || 0);
      } catch (error) {
        console.error('Error fetching comment count:', error);
      }
    };

    fetchCommentCount();
  }, [data.ranking_id]);

  const handleReaction = async (reactionType: string) => {
    if (!user) {
      toast.error("Please log in to react");
      return;
    }

    try {
      if (userReaction === reactionType) {
        // Remove reaction
        await supabase
          .from('ranking_reactions')
          .delete()
          .eq('ranking_id', data.ranking_id)
          .eq('user_id', user.id);
        
        setUserReaction(null);
        setReactionCounts(prev => ({
          ...prev,
          [reactionType]: Math.max((prev[reactionType] || 1) - 1, 0)
        }));
      } else {
        // Add or update reaction
        await supabase
          .from('ranking_reactions')
          .upsert({
            ranking_id: data.ranking_id,
            user_id: user.id,
            reaction_type: reactionType
          });

        // Update counts
        const newCounts = { ...reactionCounts };
        if (userReaction) {
          newCounts[userReaction] = Math.max((newCounts[userReaction] || 1) - 1, 0);
        }
        newCounts[reactionType] = (newCounts[reactionType] || 0) + 1;
        
        setUserReaction(reactionType);
        setReactionCounts(newCounts);
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
      toast.error("Failed to update reaction");
    }
  };

  const handleSendFriendRequest = async () => {
    if (!user) {
      toast.error("Please log in to send friend requests");
      return;
    }

    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          requester_id: user.id,
          receiver_id: data.author.id,
          status: 'pending'
        });

      if (error) throw error;
      
      toast.success("Friend request sent!");
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error("Failed to send friend request");
    }
  };

  const getFriendshipButtonText = () => {
    if (!friendshipStatus) return "Add Friend";
    
    switch (friendshipStatus.status) {
      case 'pending':
        return friendshipStatus.requester_id === user?.id ? "Request Sent" : "Accept Request";
      case 'accepted':
        return "Friends";
      case 'declined':
      case 'blocked':
        return "Unavailable";
      default:
        return "Add Friend";
    }
  };

  const canSendFriendRequest = () => {
    return !friendshipStatus && user?.id !== data.author.id;
  };

  return (
    <Card className="bg-white/5 text-white border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-start gap-4 mb-3">
          <Link to={`/users/${data.author.id}`}>
            <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage src={data.author.avatar_url || undefined} alt={sanitizedAuthorName} />
              <AvatarFallback>{sanitizedAuthorName.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <p className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <Link to={`/users/${data.author.id}`} className="font-bold hover:underline hover:text-blue-300 transition-colors">
                {sanitizedAuthorName}
              </Link>
              {' '} created a new ranking
            </p>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>
          {user && user.id !== data.author.id && (
            <Button
              onClick={handleSendFriendRequest}
              disabled={!canSendFriendRequest()}
              variant={friendshipStatus?.status === 'accepted' ? "secondary" : "default"}
              size="sm"
              className="text-xs"
            >
              {getFriendshipButtonText()}
            </Button>
          )}
        </div>

        {/* Ranking details */}
        <div className="bg-white/10 rounded-lg p-4 ml-5">
          <div className="flex items-center justify-between mb-2">
            <Link to={`/category/${data.category_id}/ranking/${data.ranking_id}`}>
              <h4 className="font-semibold text-blue-300 hover:underline cursor-pointer">
                {sanitizedTitle}
              </h4>
            </Link>
            <Badge variant="outline" className="text-xs">
              {sanitizedCategoryName}
            </Badge>
          </div>
          
          {sanitizedDescription && (
            <p className="text-sm text-gray-300 mb-3">{sanitizedDescription}</p>
          )}
          
          {/* Top 3 athletes preview */}
          <div className="space-y-2">
            {data.athletes.slice(0, 3).map((athlete, index) => (
              <div key={athlete.id} className="flex items-center gap-3 text-sm">
                <span className="text-yellow-400 font-bold w-6">#{index + 1}</span>
                <span className="flex-1">{sanitize(athlete.name)}</span>
                <span className="text-gray-400">{athlete.points} pts</span>
              </div>
            ))}
            {data.athletes.length > 3 && (
              <p className="text-xs text-gray-500 text-center">
                +{data.athletes.length - 3} more athletes
              </p>
            )}
          </div>

          {/* Reactions and comments */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReaction('like')}
              className={`flex items-center gap-1 text-xs ${userReaction === 'like' ? 'text-blue-400' : 'text-gray-400'}`}
            >
              <ThumbsUp className="w-3 h-3" />
              {reactionCounts.like || 0}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReaction('dislike')}
              className={`flex items-center gap-1 text-xs ${userReaction === 'dislike' ? 'text-red-400' : 'text-gray-400'}`}
            >
              <ThumbsDown className="w-3 h-3" />
              {reactionCounts.dislike || 0}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReaction('love')}
              className={`flex items-center gap-1 text-xs ${userReaction === 'love' ? 'text-red-400' : 'text-gray-400'}`}
            >
              <Heart className="w-3 h-3" />
              {reactionCounts.love || 0}
            </Button>

            <Link to={`/category/${data.category_id}/ranking/${data.ranking_id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-white"
              >
                <MessageCircle className="w-3 h-3" />
                {commentCount}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewRankingFeedItem;

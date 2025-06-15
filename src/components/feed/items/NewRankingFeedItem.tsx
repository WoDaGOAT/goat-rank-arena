
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { Link } from "react-router-dom";
import { BarChart3, MessageSquare, ThumbsUp, Trophy, Flame, Frown } from "lucide-react";
import RankedAthleteRow from './RankedAthleteRow';
import UserHoverCard from "../../profile/UserHoverCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface RankedAthlete {
  id: string;
  name: string;
  imageUrl?: string;
  points: number;
  position: number;
}

export interface NewRankingFeedData {
  author: {
    id: string;
    full_name: string | null;
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
  const { author, ranking_title, ranking_description, category_id, category_name, athletes } = data;
  const userInitial = author?.full_name?.charAt(0) || '?';
  const [showComments, setShowComments] = useState(false);

  const user = {
    id: author.id,
    full_name: author.full_name,
    avatar_url: author.avatar_url,
  };

  const sortedAthletes = athletes?.sort((a, b) => a.position - b.position);

  return (
    <Card className="bg-white/5 border-gray-700 text-white shadow-lg overflow-hidden animate-fade-in">
      <CardHeader className="p-4 border-b border-gray-700/50">
        <div className="flex items-start gap-4">
          <BarChart3 className="h-8 w-8 text-indigo-400 mt-1 flex-shrink-0" />
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={author.avatar_url || undefined} />
                  <AvatarFallback className="bg-gray-700 text-xs">{userInitial.toUpperCase()}</AvatarFallback>
                </Avatar>
                <p className="text-sm text-gray-200">
                  <UserHoverCard user={user}>
                      <Link to={`/user/${user.id}`} className="font-semibold hover:underline">
                          {author.full_name || "A user"}
                      </Link>
                  </UserHoverCard>
                  <span className="font-normal text-gray-400"> submitted a new ranking</span>
                </p>
            </div>
            
            <div className="pl-1">
                <h3 className="text-xl font-bold text-white">{ranking_title}</h3>
                <p className="text-sm text-gray-300 mb-2">
                    in <Link to={`/category/${category_id}`} className="font-semibold text-blue-400 hover:underline">{category_name}</Link>
                </p>
                {ranking_description && (
                  <blockquote className="mt-2 pl-3 border-l-2 border-gray-600/80">
                    <p className="text-sm text-gray-400 italic">{ranking_description}</p>
                  </blockquote>
                )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 space-y-1">
        {sortedAthletes && sortedAthletes.length > 0 ? (
          sortedAthletes.map((athlete) => (
            <RankedAthleteRow key={athlete.id} athlete={athlete} />
          ))
        ) : (
          <p className="text-gray-400 text-center py-4">This ranking has no athletes.</p>
        )}
      </CardContent>
      <div className="border-t border-gray-700/50">
        <div className="p-3 flex justify-between items-center">
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white rounded-full w-8 h-8"><ThumbsUp className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white rounded-full w-8 h-8"><Trophy className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white rounded-full w-8 h-8"><Flame className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white rounded-full w-8 h-8"><Frown className="h-4 w-4" /></Button>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => setShowComments(s => !s)} className="text-gray-400 hover:text-white flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Comments</span>
                </Button>
                <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                </p>
            </div>
        </div>
        {showComments && (
            <div className="p-4 border-t border-gray-700/50 bg-black/20">
                <h4 className="text-lg font-semibold mb-4 text-white">Comments</h4>
                <p className="text-gray-400 text-center py-4">You will be able to discuss feed items here soon!</p>
            </div>
        )}
      </div>
    </Card>
  );
};

export default NewRankingFeedItem;

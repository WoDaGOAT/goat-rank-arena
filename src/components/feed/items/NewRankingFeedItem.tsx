
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { sanitize } from "@/lib/sanitize";
import { Trophy } from "lucide-react";
import RankedAthleteRow from "./RankedAthleteRow";

export interface ProfileInfo {
  id?: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface CategoryInfo {
  id: string;
  name: string;
}

export interface RankedAthlete {
  id: string;
  name: string;
  position: number;
  imageUrl?: string;
}

export interface NewRankingFeedData {
  user: ProfileInfo | null;
  category: CategoryInfo | null;
  ranking_title: string;
  top_athletes: RankedAthlete[];
}

interface NewRankingFeedItemProps {
  data: NewRankingFeedData;
  createdAt: string;
}

const NewRankingFeedItem = ({ data, createdAt }: NewRankingFeedItemProps) => {
  const { user, category, ranking_title, top_athletes } = data;
  
  console.log('NewRankingFeedItem data:', data); // Debug log
  
  // Don't render if we don't have valid user data
  if (!user?.full_name || user.full_name.trim() === '' || !category?.name) {
    console.log('NewRankingFeedItem: Missing required data', { user, category }); // Debug log
    return null;
  }
  
  const userName = user.full_name;
  const userAvatar = user.avatar_url;
  const sanitizedUserName = sanitize(userName);
  const categoryName = category.name;
  const rankingTitle = sanitize(ranking_title) || 'Untitled Ranking';

  // Ensure top_athletes is an array
  const athletesArray = Array.isArray(top_athletes) ? top_athletes : [];

  return (
    <Card className="bg-white/5 text-white border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-start gap-4 mb-3">
          {user.id ? (
            <Link to={`/users/${user.id}`}>
              <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarImage src={userAvatar || undefined} alt={sanitizedUserName}/>
                <AvatarFallback>{sanitizedUserName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Avatar>
              <AvatarImage src={userAvatar || undefined} alt={sanitizedUserName}/>
              <AvatarFallback>{sanitizedUserName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1">
            <p className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              {user.id ? (
                <Link to={`/users/${user.id}`} className="font-bold hover:underline hover:text-blue-300 transition-colors">
                  {sanitizedUserName}
                </Link>
              ) : (
                <span className="font-bold">{sanitizedUserName}</span>
              )}
              {' '} created a new ranking in {' '}
              <Link to={`/category/${category.id}`} className="text-blue-300 hover:underline">
                {sanitize(categoryName)}
              </Link>
            </p>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Ranking preview */}
        <div className="bg-white/10 rounded-lg p-4 ml-5">
          <h4 className="font-semibold text-blue-300 mb-3">{rankingTitle}</h4>
          
          {/* Show top 3 athletes */}
          <div className="space-y-2">
            {athletesArray?.slice(0, 3).map((athlete) => (
              <RankedAthleteRow key={athlete.id} athlete={athlete} />
            ))}
          </div>
          
          {athletesArray && athletesArray.length > 3 && (
            <p className="text-xs text-gray-400 mt-2 text-center">
              +{athletesArray.length - 3} more athletes
            </p>
          )}
          
          {(!athletesArray || athletesArray.length === 0) && (
            <p className="text-xs text-gray-400 text-center">
              No athletes in this ranking yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewRankingFeedItem;

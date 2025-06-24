import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { sanitize } from "@/lib/sanitize";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import RankedAthleteRow from "./RankedAthleteRow";
import { useState } from "react";

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

// Updated interface to match actual database structure
export interface NewRankingFeedData {
  // Support both formats for backward compatibility
  user?: ProfileInfo | null;
  author?: ProfileInfo | null;
  category?: CategoryInfo | null;
  category_id?: string;
  category_name?: string;
  ranking_title: string;
  ranking_id?: string;
  top_athletes?: RankedAthlete[];
  athletes?: any; // Can be array or JSONB
}

interface NewRankingFeedItemProps {
  data: NewRankingFeedData;
  createdAt: string;
}

const NewRankingFeedItem = ({ data, createdAt }: NewRankingFeedItemProps) => {
  console.log('NewRankingFeedItem received data:', data); // Debug log
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Handle both data formats (user vs author)
  const userProfile = data.user || data.author;
  
  // Handle both category formats (object vs separate fields)
  const category = data.category || (data.category_id && data.category_name ? {
    id: data.category_id,
    name: data.category_name
  } : null);
  
  // Handle both athlete formats (top_athletes vs athletes)
  let athletesArray: RankedAthlete[] = [];
  if (data.top_athletes && Array.isArray(data.top_athletes)) {
    athletesArray = data.top_athletes;
  } else if (data.athletes) {
    // Handle JSONB or array format
    if (Array.isArray(data.athletes)) {
      athletesArray = data.athletes;
    } else if (typeof data.athletes === 'string') {
      try {
        const parsed = JSON.parse(data.athletes);
        athletesArray = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.warn('Failed to parse athletes data:', e);
        athletesArray = [];
      }
    }
  }
  
  // Don't render if we don't have valid user data
  if (!userProfile?.full_name || userProfile.full_name.trim() === '' || !category?.name) {
    console.log('NewRankingFeedItem: Missing required data', { userProfile, category }); // Debug log
    return null;
  }
  
  const userName = userProfile.full_name;
  const userAvatar = userProfile.avatar_url;
  const sanitizedUserName = sanitize(userName);
  const categoryName = category.name;

  const athletesToShow = isExpanded ? athletesArray : athletesArray?.slice(0, 3);
  const hasMoreAthletes = athletesArray && athletesArray.length > 3;

  return (
    <Card className="bg-white/5 text-white border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-start gap-4 mb-3">
          {userProfile.id ? (
            <Link to={`/users/${userProfile.id}`}>
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
              {userProfile.id ? (
                <Link to={`/users/${userProfile.id}`} className="font-bold hover:underline hover:text-blue-300 transition-colors">
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
          {data.ranking_title && data.ranking_title.trim() && data.ranking_title !== "My Ranking" && (
            <h4 className="font-semibold text-blue-300 mb-3">{sanitize(data.ranking_title)}</h4>
          )}
          
          {/* Show athletes */}
          <div className="space-y-2">
            {athletesToShow?.map((athlete) => (
              <RankedAthleteRow key={athlete.id} athlete={athlete} />
            ))}
          </div>
          
          {/* Expand/Collapse button */}
          {hasMoreAthletes && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-xs text-blue-300 hover:text-blue-200 mt-3 py-2 rounded-md hover:bg-white/5 transition-colors flex items-center justify-center gap-1"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  +{athletesArray.length - 3} more athletes
                </>
              )}
            </button>
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


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";

export interface NewRankingFeedData {
  author: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  ranking_id: string;
  ranking_title: string;
  category_id: string;
  category_name: string;
}

interface NewRankingFeedItemProps {
  data: NewRankingFeedData;
  createdAt: string;
}

const NewRankingFeedItem = ({ data, createdAt }: NewRankingFeedItemProps) => {
  const { author, ranking_title, category_id, category_name } = data;
  const userInitial = author?.full_name?.charAt(0) || '?';

  return (
    <Card className="bg-white/5 border-gray-700 text-white shadow-lg overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <BarChart3 className="h-6 w-6 text-indigo-400 mt-1 flex-shrink-0" />
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={author.avatar_url || undefined} />
                  <AvatarFallback className="bg-gray-700 text-xs">{userInitial.toUpperCase()}</AvatarFallback>
                </Avatar>
                <p className="font-semibold text-sm text-gray-200">
                  {author.full_name || "A user"}
                  <span className="font-normal text-gray-400"> submitted a new ranking</span>
                </p>
            </div>
            
            <div className="pl-1">
                <h3 className="text-lg font-bold text-white">{ranking_title}</h3>
                <p className="text-sm text-gray-300">
                    in <Link to={`/category/${category_id}`} className="font-semibold text-blue-400 hover:underline">{category_name}</Link>
                </p>
            </div>
            
            <p className="text-xs text-gray-500 mt-2 pl-1">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewRankingFeedItem;

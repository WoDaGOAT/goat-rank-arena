
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { sanitize } from "@/lib/sanitize";
import { MessageSquare } from "lucide-react";

export interface ProfileInfo {
  id?: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface CategoryInfo {
  id: string;
  name: string;
}

export interface NewCommentFeedData {
  user: ProfileInfo | null;
  category: CategoryInfo | null;
  comment_preview: string;
  comment_id: string;
}

interface NewCommentFeedItemProps {
  data: NewCommentFeedData;
  createdAt: string;
}

const NewCommentFeedItem = ({ data, createdAt }: NewCommentFeedItemProps) => {
  const { user, category, comment_preview } = data;
  
  // Don't render if we don't have valid user data
  if (!user?.full_name || user.full_name.trim() === '' || !category?.name) {
    return null;
  }
  
  const userName = user.full_name;
  const userAvatar = user.avatar_url;
  const sanitizedUserName = sanitize(userName);
  const categoryName = category.name;
  const commentPreview = sanitize(comment_preview) || '';

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
              <MessageSquare className="w-4 h-4 text-blue-300" />
              {user.id ? (
                <Link to={`/users/${user.id}`} className="font-bold hover:underline hover:text-blue-300 transition-colors">
                  {sanitizedUserName}
                </Link>
              ) : (
                <span className="font-bold">{sanitizedUserName}</span>
              )}
              {' '} commented on {' '}
              <Link to={`/category/${category.id}`} className="text-blue-300 hover:underline">
                {sanitize(categoryName)}
              </Link>
            </p>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Comment preview */}
        <div className="bg-white/10 rounded-lg p-3 ml-5">
          <p className="text-sm text-gray-200 italic">
            "{commentPreview.length > 100 ? commentPreview.substring(0, 100) + '...' : commentPreview}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewCommentFeedItem;

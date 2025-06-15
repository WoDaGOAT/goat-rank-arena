
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { sanitize } from "@/lib/sanitize";

export interface ProfileInfo {
  id?: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface NewCommentFeedData {
  author: ProfileInfo | null;
  comment_text: string;
  category_id: string;
  category_name: string;
}

interface NewCommentFeedItemProps {
  data: NewCommentFeedData;
  createdAt: string;
}

const NewCommentFeedItem = ({ data, createdAt }: NewCommentFeedItemProps) => {
    const { author, comment_text, category_id, category_name } = data;
    
    const authorName = author?.full_name || 'Anonymous';
    const authorAvatar = author?.avatar_url;
    const sanitizedAuthorName = sanitize(authorName);

    return (
        <Card className="bg-white/5 text-white border-gray-700">
            <CardContent className="p-4">
                 <div className="flex items-start gap-4 mb-2">
                    <Avatar>
                        <AvatarImage src={authorAvatar || undefined} alt={sanitizedAuthorName || 'User'}/>
                        <AvatarFallback>{sanitizedAuthorName?.charAt(0) || 'A'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p>
                            <span className="font-bold">{sanitizedAuthorName}</span>
                            {' '} commented on {' '}
                            <Link to={`/category/${category_id}`} className="font-bold hover:underline text-blue-300">{sanitize(category_name)}</Link>
                        </p>
                        <p className="text-xs text-gray-400">
                            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>
                <div className="border-l-2 border-gray-700 pl-4 ml-5">
                  <p className="text-gray-300 italic">"{sanitize(comment_text)}"</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default NewCommentFeedItem;

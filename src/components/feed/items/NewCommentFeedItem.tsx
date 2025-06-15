
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

export interface ProfileInfo {
  id?: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface NewCommentFeedData {
  author: ProfileInfo;
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
    return (
        <Card className="bg-white/5 text-white border-gray-700">
            <CardContent className="p-4">
                 <div className="flex items-start gap-4 mb-2">
                    <Avatar>
                        <AvatarImage src={author.avatar_url || undefined} alt={author.full_name || 'User'}/>
                        <AvatarFallback>{author.full_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p>
                            <span className="font-bold">{author.full_name || 'Someone'}</span>
                            {' '} commented on {' '}
                            <Link to={`/category/${category_id}`} className="font-bold hover:underline text-blue-300">{category_name}</Link>
                        </p>
                        <p className="text-xs text-gray-400">
                            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>
                <div className="border-l-2 border-gray-700 pl-4 ml-5">
                  <p className="text-gray-300 italic">"{comment_text}"</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default NewCommentFeedItem;

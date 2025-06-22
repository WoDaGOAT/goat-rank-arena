
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { sanitize } from "@/lib/sanitize";
import { MessageSquare, Reply } from "lucide-react";

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
  parent_comment_id?: string | null;
  parent_comment_text?: string | null;
  parent_comment_author?: ProfileInfo | null;
}

interface NewCommentFeedItemProps {
  data: NewCommentFeedData;
  createdAt: string;
}

const NewCommentFeedItem = ({ data, createdAt }: NewCommentFeedItemProps) => {
    const { 
      author, 
      comment_text, 
      category_id, 
      category_name,
      parent_comment_id,
      parent_comment_text,
      parent_comment_author
    } = data;
    
    const authorName = author?.full_name || 'Anonymous';
    const authorAvatar = author?.avatar_url;
    const sanitizedAuthorName = sanitize(authorName);

    const isReply = !!parent_comment_id;
    const parentAuthorName = parent_comment_author?.full_name || 'Anonymous';
    const sanitizedParentAuthorName = sanitize(parentAuthorName);

    // Debug logging to see what data we're getting
    console.log('NewCommentFeedItem data:', {
      isReply,
      parent_comment_id,
      parent_comment_text,
      parent_comment_author,
      authorName,
      comment_text
    });

    return (
        <Card className="bg-white/5 text-white border-gray-700">
            <CardContent className="p-4">
                 <div className="flex items-start gap-4 mb-2">
                    {/* Make avatar clickable */}
                    {author?.id ? (
                        <Link to={`/users/${author.id}`}>
                            <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
                                <AvatarImage src={authorAvatar || undefined} alt={sanitizedAuthorName || 'User'}/>
                                <AvatarFallback>{sanitizedAuthorName?.charAt(0) || 'A'}</AvatarFallback>
                            </Avatar>
                        </Link>
                    ) : (
                        <Avatar>
                            <AvatarImage src={authorAvatar || undefined} alt={sanitizedAuthorName || 'User'}/>
                            <AvatarFallback>{sanitizedAuthorName?.charAt(0) || 'A'}</AvatarFallback>
                        </Avatar>
                    )}
                    <div className="flex-1">
                        <p className="flex items-center gap-1">
                            {isReply && <Reply className="w-4 h-4 text-blue-300" />}
                            {/* Make author name clickable */}
                            {author?.id ? (
                                <Link to={`/users/${author.id}`} className="font-bold hover:underline hover:text-blue-300 transition-colors">
                                    {sanitizedAuthorName}
                                </Link>
                            ) : (
                                <span className="font-bold">{sanitizedAuthorName}</span>
                            )}
                            {isReply ? (
                                <>
                                    {' '} replied to {' '}
                                    {/* Make parent author name clickable if available */}
                                    {parent_comment_author?.id ? (
                                        <Link to={`/users/${parent_comment_author.id}`} className="font-bold text-blue-300 hover:underline">
                                            {sanitizedParentAuthorName}
                                        </Link>
                                    ) : (
                                        <span className="font-bold text-blue-300">{sanitizedParentAuthorName}</span>
                                    )}
                                    {' '} on {' '}
                                </>
                            ) : (
                                <>
                                    {' '} commented on {' '}
                                </>
                            )}
                            <Link to={`/category/${category_id}`} className="font-bold hover:underline text-blue-300">{sanitize(category_name)}</Link>
                        </p>
                        <p className="text-xs text-gray-400">
                            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>

                {/* Show parent comment context for replies */}
                {isReply && parent_comment_text && (
                    <div className="border-l-2 border-gray-600 pl-4 ml-5 mb-3 bg-white/5 rounded-r-lg p-2">
                        <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">Replying to:</span>
                        </div>
                        <p className="text-gray-400 text-sm italic">"{sanitize(parent_comment_text)}"</p>
                    </div>
                )}

                {/* The actual comment/reply */}
                <div className="border-l-2 border-gray-700 pl-4 ml-5">
                  <p className="text-gray-300 italic">"{sanitize(comment_text)}"</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default NewCommentFeedItem;

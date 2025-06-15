
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminComment } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import CommentActions from "./CommentActions";
import { Link } from "react-router-dom";
import { sanitize } from "@/lib/sanitize";

interface CommentsTableProps {
  comments: AdminComment[];
  refetchComments: () => void;
}

const CommentsTable = ({ comments, refetchComments }: CommentsTableProps) => {
    return (
        <div className="rounded-lg border border-gray-700 bg-white/5">
            <Table>
                <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-transparent">
                        <TableHead className="text-white">User</TableHead>
                        <TableHead className="text-white">Comment</TableHead>
                        <TableHead className="text-white">Category</TableHead>
                        <TableHead className="text-white">Posted</TableHead>
                        <TableHead className="text-white">Status</TableHead>
                        <TableHead className="text-right text-white">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {comments.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                                No comments to display.
                            </TableCell>
                        </TableRow>
                    )}
                    {comments.map((comment) => (
                        <TableRow key={comment.comment_id} className="border-gray-700 hover:bg-white/5">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={comment.user_avatar_url || undefined} />
                                        <AvatarFallback>{comment.user_full_name?.charAt(0) || 'A'}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{sanitize(comment.user_full_name) || 'Anonymous'}</p>
                                        <p className="text-xs text-gray-400 break-all">{comment.user_id}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <p className="max-w-xs text-gray-300" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{sanitize(comment.comment_text)}</p>
                            </TableCell>
                             <TableCell>
                                <Link to={`/category/${comment.category_id}`} className="text-blue-400 hover:underline">
                                    {sanitize(comment.category_name) || 'Unknown Category'}
                                </Link>
                            </TableCell>
                            <TableCell className="text-gray-400">
                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </TableCell>
                            <TableCell>
                                <Badge variant={comment.user_status === 'banned' ? 'destructive' : 'default'} className={comment.user_status === 'banned' ? '' : 'bg-green-600/80'}>
                                    {comment.user_status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <CommentActions comment={comment} refetchComments={refetchComments} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default CommentsTable;

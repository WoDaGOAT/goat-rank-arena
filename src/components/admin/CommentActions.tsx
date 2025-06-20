
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { AdminComment } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, UserX, UserCheck } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface CommentActionsProps {
  comment: AdminComment;
  refetchComments: () => void;
}

const CommentActions = ({ comment, refetchComments }: CommentActionsProps) => {
    const { isAdmin } = useAuth();
    const [isBanAlertOpen, setIsBanAlertOpen] = useState(false);
    const [isUnbanAlertOpen, setIsUnbanAlertOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

    const { mutate: setUserStatus, isPending: isSettingStatus } = useMutation({
        mutationFn: async ({ userId, status }: { userId: string, status: 'active' | 'banned' }) => {
            // Use the appropriate function based on user role
            const functionName = isAdmin ? 'set_user_status' : 'set_user_status_moderator';
            const { error } = await supabase.rpc(functionName, {
                p_user_id: userId,
                p_status: status
            });
            if (error) throw error;
        },
        onSuccess: (_, { status }) => {
            toast.success(`User has been ${status}.`);
            refetchComments();
            setIsBanAlertOpen(false);
            setIsUnbanAlertOpen(false);
        },
        onError: (error) => {
            toast.error(`Failed to update user status: ${error.message}`);
            setIsBanAlertOpen(false);
            setIsUnbanAlertOpen(false);
        }
    });

    const { mutate: deleteComment, isPending: isDeleting } = useMutation({
        mutationFn: async (commentId: string) => {
            const { error } = await supabase.rpc('delete_comment_as_admin', {
                p_comment_id: commentId
            });
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success('Comment deleted successfully.');
            refetchComments();
            setIsDeleteAlertOpen(false);
        },
        onError: (error) => {
            toast.error(`Failed to delete comment: ${error.message}`);
            setIsDeleteAlertOpen(false);
        }
    });

    const handleBanUser = () => setUserStatus({ userId: comment.user_id, status: 'banned' });
    const handleUnbanUser = () => setUserStatus({ userId: comment.user_id, status: 'active' });
    const handleDeleteComment = () => deleteComment(comment.comment_id);
    
    const isBanned = comment.user_status === 'banned';

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                    <DropdownMenuItem
                        className="text-red-400 focus:bg-red-500/20 focus:text-red-300 cursor-pointer"
                        onSelect={() => setIsDeleteAlertOpen(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete Comment</span>
                    </DropdownMenuItem>

                    {isBanned ? (
                         <DropdownMenuItem
                            className="text-green-400 focus:bg-green-500/20 focus:text-green-300 cursor-pointer"
                            onSelect={() => setIsUnbanAlertOpen(true)}
                        >
                            <UserCheck className="mr-2 h-4 w-4" />
                            <span>Unban User</span>
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem
                            className="text-red-400 focus:bg-red-500/20 focus:text-red-300 cursor-pointer"
                            onSelect={() => setIsBanAlertOpen(true)}
                        >
                            <UserX className="mr-2 h-4 w-4" />
                            <span>Ban User</span>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            
            <AlertDialog open={isBanAlertOpen} onOpenChange={setIsBanAlertOpen}>
                <AlertDialogContent className="bg-gray-900 border-gray-700 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to ban this user?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            This will prevent the user from posting, editing, or deleting comments. This action can be reversed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-700 border-0 hover:bg-gray-600 text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBanUser} disabled={isSettingStatus} className="bg-red-600 hover:bg-red-700 text-white">
                            {isSettingStatus ? 'Banning...' : 'Ban User'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isUnbanAlertOpen} onOpenChange={setIsUnbanAlertOpen}>
                <AlertDialogContent className="bg-gray-900 border-gray-700 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to unban this user?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            This will allow the user to resume posting comments.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-700 border-0 hover:bg-gray-600 text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUnbanUser} disabled={isSettingStatus} className="bg-green-600 hover:bg-green-700 text-white">
                            {isSettingStatus ? 'Unbanning...' : 'Unban User'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent className="bg-gray-900 border-gray-700 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this comment?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            This action cannot be undone. This will permanently delete the comment.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-700 border-0 hover:bg-gray-600 text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteComment} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
                            {isDeleting ? 'Deleting...' : 'Delete Comment'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default CommentActions;

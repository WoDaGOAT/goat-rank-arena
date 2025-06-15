
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { AdminComment } from '@/types';
import CommentsTable from '@/components/admin/CommentsTable';
import { Skeleton } from '@/components/ui/skeleton';
import { Helmet } from 'react-helmet-async';

const CommentManagementPage = () => {
    const { data: comments, isLoading, error, refetch } = useQuery({
        queryKey: ['allCommentsAdmin'],
        queryFn: async () => {
            const { data, error } = await supabase.rpc('get_all_comments_for_admin');
            
            if (error) {
                toast.error('Failed to fetch comments. You might not have admin rights.');
                console.error('Error fetching comments for admin:', error);
                throw new Error('Failed to fetch comments.');
            }
            return data as AdminComment[];
        },
    });

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-white">Comment Moderation</h1>
                <Skeleton className="h-96 w-full bg-gray-700" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-3xl font-bold mb-6 text-white">Comment Moderation</h1>
                <p className="text-red-400">Error loading comments. Please ensure you are an administrator and try again.</p>
            </div>
        )
    }

    return (
        <>
            <Helmet>
                <title>Comment Moderation</title>
                <meta name="description" content="Manage and moderate user comments." />
            </Helmet>
            <div className="container mx-auto px-4 py-8 text-white">
                <h1 className="text-3xl font-bold mb-6">Comment Moderation</h1>
                <CommentsTable comments={comments || []} refetchComments={refetch} />
            </div>
        </>
    );
};

export default CommentManagementPage;

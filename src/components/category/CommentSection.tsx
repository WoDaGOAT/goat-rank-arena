
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { CommentWithUser } from "@/types";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CommentSectionProps {
  categoryId: string;
}

const CommentSection = ({ categoryId }: CommentSectionProps) => {
  const { data: comments, isLoading, error } = useQuery<CommentWithUser[]>({
    queryKey: ["categoryComments", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("category_comments")
        .select("*, profiles (id, full_name, avatar_url)")
        .eq("category_id", categoryId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!categoryId,
  });

  // Organize comments into threads with proper hierarchy
  const organizeComments = (comments: CommentWithUser[]) => {
    const topLevelComments: CommentWithUser[] = [];
    const repliesMap: { [key: string]: CommentWithUser[] } = {};

    // Separate top-level comments and replies
    comments?.forEach((comment) => {
      if (comment.parent_comment_id) {
        if (!repliesMap[comment.parent_comment_id]) {
          repliesMap[comment.parent_comment_id] = [];
        }
        repliesMap[comment.parent_comment_id].push(comment);
      } else {
        topLevelComments.push(comment);
      }
    });

    // Sort replies chronologically (oldest first for natural conversation flow)
    Object.keys(repliesMap).forEach((parentId) => {
      repliesMap[parentId].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });

    return { topLevelComments, repliesMap };
  };

  const { topLevelComments, repliesMap } = organizeComments(comments || []);
  const totalComments = comments?.length || 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="p-4 sm:p-6 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 mt-6 sm:mt-8">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-blue-300" />
          {totalComments} {totalComments === 1 ? 'Comment' : 'Comments'}
        </h2>
        
        <CommentForm categoryId={categoryId} />

        <div className="mt-6 space-y-4">
          {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full bg-white/10" />)}
          {error && <p className="text-red-400">Could not load comments.</p>}
          {topLevelComments.length === 0 && !isLoading && (
            <p className="text-gray-400 text-center py-8">Be the first to comment!</p>
          )}
          {topLevelComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={repliesMap[comment.id] || []}
              categoryId={categoryId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;


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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="p-6 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 mt-8">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-blue-300" />
          Community Discussion ({comments?.length || 0})
        </h2>
        
        <CommentForm categoryId={categoryId} />

        <div className="mt-6 space-y-4">
          {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full bg-white/10" />)}
          {error && <p className="text-red-400">Could not load comments.</p>}
          {comments && comments.length === 0 && (
            <p className="text-gray-400 text-center py-4">Be the first to comment!</p>
          )}
          {comments?.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;

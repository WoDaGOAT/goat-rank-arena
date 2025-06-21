
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { CommentWithUser } from "@/types";
import { sanitize } from "@/lib/sanitize";
import { FunctionsHttpError } from "@supabase/supabase-js";

interface CommentFormProps {
  categoryId: string;
  onSuccess?: () => void;
}

const CommentForm = ({ categoryId, onSuccess }: CommentFormProps) => {
  const [comment, setComment] = useState("");
  const { user, openLoginDialog } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: addComment, isPending } = useMutation({
    mutationFn: async (commentText: string): Promise<CommentWithUser> => {
      if (!user) {
        openLoginDialog();
        throw new Error("User not authenticated");
      }
      
      console.log("🔍 Starting comment submission...");
      console.log("📝 Comment text:", commentText);
      console.log("🏷️ Category ID:", categoryId);
      console.log("👤 User ID:", user.id);
      
      try {
        const { data, error } = await supabase.functions.invoke("post-comment", {
          body: {
            categoryId: categoryId,
            commentText: commentText,
          },
        });

        console.log("📤 Function invoked, response:", { data, error });

        if (error) {
          console.error("❌ Edge Function error:", error);
          
          // Handle different types of errors
          if (error instanceof FunctionsHttpError) {
            console.error("❌ HTTP Error details:", error.context);
            try {
              const errorJson = await error.context.json();
              console.error("❌ Error JSON:", errorJson);
              throw new Error(errorJson.error || "Failed to post comment.");
            } catch (parseError) {
              console.error("❌ Error parsing response:", parseError);
              throw new Error("Failed to post comment - server error.");
            }
          }
          
          // Handle network or deployment errors
          if (error.message?.includes("Failed to fetch") || error.message?.includes("NetworkError")) {
            throw new Error("Network error - please check your connection and try again.");
          }
          
          if (error.message?.includes("Function not found") || error.message?.includes("404")) {
            throw new Error("Comment function not available - please contact support.");
          }
          
          throw error;
        }

        if (!data) {
          console.error("❌ No data returned from function");
          throw new Error("Comment could not be created - no response.");
        }

        console.log("✅ Comment created successfully:", data);
        return data as CommentWithUser;
        
      } catch (networkError) {
        console.error("❌ Network/Function error:", networkError);
        
        // Provide user-friendly error messages
        if (networkError.message?.includes("failed to send a request")) {
          throw new Error("Unable to reach comment service. Please check if the app is properly deployed and try again.");
        }
        
        throw networkError;
      }
    },
    onSuccess: () => {
      console.log("✅ Comment submission successful, clearing form");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["categoryComments", categoryId] });
      queryClient.invalidateQueries({ queryKey: ["categoryCommentCount", categoryId] });
      toast.success("Comment posted!");
      onSuccess?.();
    },
    onError: (error) => {
      console.error("❌ Comment submission failed:", error);
      
      if (error.message !== "User not authenticated") {
        // Show specific error message to user
        toast.error(error.message || "Failed to post comment. Please try again.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📝 Form submitted with comment:", comment.trim());
    
    if (comment.trim()) {
      addComment(sanitize(comment.trim()));
    } else {
      console.warn("⚠️ Empty comment attempted");
      toast.error("Please enter a comment before posting.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={user ? "Write a comment..." : "Log in to post a comment"}
        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
        rows={3}
        disabled={isPending || !user}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending || !comment.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Send className="w-4 h-4 mr-2" />
          {isPending ? "Posting..." : "Post Comment"}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;

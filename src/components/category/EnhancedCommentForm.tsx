
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { validateAndSanitizeInput, createRateLimiter } from "@/lib/security";
import { useSecurityMonitoring } from "@/hooks/useSecurityMonitoring";

interface EnhancedCommentFormProps {
  categoryId: string;
  onCommentAdded: () => void;
  parentCommentId?: string;
  placeholder?: string;
}

// Rate limiter: max 5 comments per minute
const commentRateLimit = createRateLimiter(5, 60000);

const EnhancedCommentForm = ({ 
  categoryId, 
  onCommentAdded, 
  parentCommentId,
  placeholder = "Share your thoughts..." 
}: EnhancedCommentFormProps) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, openAuthDialog } = useAuth();
  const { logSuspiciousActivity } = useSecurityMonitoring();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      openAuthDialog();
      return;
    }

    // Rate limiting check
    const userKey = user.id;
    if (!commentRateLimit(userKey)) {
      toast.error("Too many comments. Please wait a moment before commenting again.");
      logSuspiciousActivity({
        action: 'comment_rate_limit_exceeded',
        user_id: user.id,
        category_id: categoryId
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Validate and sanitize input
      const sanitizedComment = validateAndSanitizeInput(comment, 2000);
      
      if (!sanitizedComment) {
        toast.error("Comment cannot be empty.");
        return;
      }

      if (sanitizedComment.length < 3) {
        toast.error("Comment must be at least 3 characters long.");
        return;
      }

      // Check for potential spam patterns
      const suspiciousPatterns = [
        /https?:\/\/[^\s]+/gi, // URLs
        /\b(?:buy|sell|cheap|free|click|visit)\b/gi, // Spam keywords
        /(.)\1{10,}/gi, // Repeated characters
      ];

      const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(sanitizedComment));
      
      if (isSuspicious) {
        logSuspiciousActivity({
          action: 'suspicious_comment_pattern',
          user_id: user.id,
          category_id: categoryId,
          comment_preview: sanitizedComment.substring(0, 100)
        });
      }

      const { error } = await supabase
        .from('category_comments')
        .insert({
          user_id: user.id,
          category_id: categoryId,
          comment: sanitizedComment,
          parent_comment_id: parentCommentId || null,
        });

      if (error) {
        console.error('Error posting comment:', error);
        
        // Log potential security issues
        if (error.message.includes('row-level security')) {
          logSuspiciousActivity({
            action: 'rls_violation_attempt',
            user_id: user.id,
            category_id: categoryId,
            error: error.message
          });
        }
        
        toast.error("Failed to post comment. Please try again.");
        return;
      }

      setComment("");
      onCommentAdded();
      toast.success("Comment posted successfully!");
      
    } catch (error: any) {
      console.error('Error posting comment:', error);
      
      if (error.message.includes('maximum length')) {
        toast.error(error.message);
      } else {
        toast.error("Failed to post comment. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Prevent extremely long input
    if (value.length > 2000) {
      toast.warning("Comment is too long. Maximum 2000 characters allowed.");
      return;
    }
    
    setComment(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={comment}
        onChange={handleChange}
        placeholder={placeholder}
        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none"
        rows={3}
        maxLength={2000}
        disabled={isSubmitting}
      />
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">
          {comment.length}/2000 characters
        </span>
        <Button
          type="submit"
          disabled={isSubmitting || !comment.trim()}
          className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 hover:opacity-90"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </div>
    </form>
  );
};

export default EnhancedCommentForm;


import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CommentForm from "./CommentForm";

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
}

export const CommentDialog = ({ open, onOpenChange, categoryId }: CommentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Write a Comment</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <CommentForm 
            categoryId={categoryId} 
            onSuccess={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

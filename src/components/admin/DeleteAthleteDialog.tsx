
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteAthleteDialogProps {
  athlete: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAthleteDeleted: () => void;
}

const DeleteAthleteDialog = ({ athlete, open, onOpenChange, onAthleteDeleted }: DeleteAthleteDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      // Check if athlete is used in any rankings
      const { data: rankings, error: rankingError } = await supabase
        .from("ranking_athletes")
        .select("id")
        .eq("athlete_id", athlete.id)
        .limit(1);

      if (rankingError) throw rankingError;

      if (rankings && rankings.length > 0) {
        toast.error("Cannot delete athlete: They are used in existing rankings");
        return;
      }

      // Delete the athlete
      const { error } = await supabase
        .from("athletes")
        .delete()
        .eq("id", athlete.id);

      if (error) throw error;

      toast.success("Athlete deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["athletesAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["athleteStats"] });
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
      onAthleteDeleted();
    } catch (error: any) {
      console.error("Error deleting athlete:", error);
      toast.error(error.message || "Failed to delete athlete");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Athlete</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                Are you sure you want to delete this athlete? This action cannot be undone.
              </p>
              
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={athlete.profile_picture_url || "/placeholder.svg"} />
                  <AvatarFallback>
                    {athlete.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h4 className="font-semibold">{athlete.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {athlete.country_of_origin} {athlete.nationality && `• ${athlete.nationality}`}
                  </p>
                  {athlete.positions && athlete.positions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {athlete.positions.map((position: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {position}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <Badge variant={athlete.is_active ? "default" : "secondary"}>
                  {athlete.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              <p className="text-sm text-red-600">
                Note: If this athlete is used in any rankings, deletion will be prevented.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAthleteDialog;

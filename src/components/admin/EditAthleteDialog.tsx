
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEditAthleteForm } from "./editAthlete/useEditAthleteForm";
import { BasicInfoFields } from "./editAthlete/BasicInfoFields";
import { CareerInfoFields } from "./editAthlete/CareerInfoFields";
import { PositionsManager } from "./editAthlete/PositionsManager";

interface EditAthleteDialogProps {
  athlete: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAthleteUpdated: () => void;
}

const EditAthleteDialog = ({ athlete, open, onOpenChange, onAthleteUpdated }: EditAthleteDialogProps) => {
  const {
    form,
    positions,
    setPositions,
    isSubmitting,
    onSubmit,
    handleClose,
  } = useEditAthleteForm({ athlete, open, onAthleteUpdated, onOpenChange });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Athlete: {athlete?.name || 'Unknown'}</DialogTitle>
          <DialogDescription>
            Update athlete information. All changes will be saved to the database.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BasicInfoFields control={form.control} />

            <CareerInfoFields control={form.control} />

            <FormField
              control={form.control}
              name="profile_picture_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL to the athlete's profile picture
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <PositionsManager 
              positions={positions} 
              onPositionsChange={setPositions} 
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Athlete"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAthleteDialog;


import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const athleteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  country_of_origin: z.string().optional(),
  nationality: z.string().optional(),
  date_of_birth: z.string().optional(),
  date_of_death: z.string().optional(),
  is_active: z.boolean(),
  profile_picture_url: z.string().optional(),
});

type AthleteFormData = z.infer<typeof athleteSchema>;

interface EditAthleteDialogProps {
  athlete: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAthleteUpdated: () => void;
}

const EditAthleteDialog = ({ athlete, open, onOpenChange, onAthleteUpdated }: EditAthleteDialogProps) => {
  const [positions, setPositions] = useState<string[]>([]);
  const [newPosition, setNewPosition] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<AthleteFormData>({
    resolver: zodResolver(athleteSchema),
    defaultValues: {
      name: "",
      country_of_origin: "",
      nationality: "",
      date_of_birth: "",
      date_of_death: "",
      is_active: true,
      profile_picture_url: "",
    },
  });

  useEffect(() => {
    if (athlete) {
      form.reset({
        name: athlete.name || "",
        country_of_origin: athlete.country_of_origin || "",
        nationality: athlete.nationality || "",
        date_of_birth: athlete.date_of_birth || "",
        date_of_death: athlete.date_of_death || "",
        is_active: athlete.is_active,
        profile_picture_url: athlete.profile_picture_url || "",
      });
      setPositions(athlete.positions || []);
    }
  }, [athlete, form]);

  const addPosition = () => {
    if (newPosition.trim() && !positions.includes(newPosition.trim())) {
      setPositions([...positions, newPosition.trim()]);
      setNewPosition("");
    }
  };

  const removePosition = (position: string) => {
    setPositions(positions.filter(p => p !== position));
  };

  const onSubmit = async (data: AthleteFormData) => {
    try {
      setIsSubmitting(true);

      const updates = {
        name: data.name,
        country_of_origin: data.country_of_origin || null,
        nationality: data.nationality || null,
        date_of_birth: data.date_of_birth || null,
        date_of_death: data.date_of_death || null,
        is_active: data.is_active,
        positions: positions.length > 0 ? positions : null,
        profile_picture_url: data.profile_picture_url || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("athletes")
        .update(updates)
        .eq("id", athlete.id);

      if (error) throw error;

      toast.success("Athlete updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["athletesAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
      onAthleteUpdated();
    } catch (error: any) {
      console.error("Error updating athlete:", error);
      toast.error(error.message || "Failed to update athlete");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Athlete</DialogTitle>
          <DialogDescription>
            Update athlete information. All changes will be saved to the database.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Athlete full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country_of_origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country of Origin</FormLabel>
                    <FormControl>
                      <Input placeholder="Birth country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <FormControl>
                      <Input placeholder="Nationality" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_of_death"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Death</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      Only fill if the athlete is deceased
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <FormDescription>
                        Is this athlete currently active?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

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

            <div className="space-y-3">
              <FormLabel>Positions</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Add position"
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPosition())}
                />
                <Button type="button" onClick={addPosition} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {positions.map((position) => (
                  <Badge key={position} variant="secondary" className="flex items-center gap-1">
                    {position}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removePosition(position)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
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

import { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FOOTBALL_POSITIONS } from "@/constants/positions";
import ClubsMultiSelect from "./ClubsMultiSelect";

const athleteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  country_of_origin: z.string().optional(),
  nationality: z.string().optional(),
  year_of_birth: z.number().min(1800).max(new Date().getFullYear()).optional(),
  date_of_death: z.string().optional(),
  is_active: z.boolean().default(true),
  profile_picture_url: z.string().optional(),
  career_start_year: z.number().min(1800).max(new Date().getFullYear()).optional(),
  career_end_year: z.number().min(1800).max(new Date().getFullYear()).optional(),
}).refine((data) => {
  if (data.career_start_year && data.career_end_year) {
    return data.career_end_year >= data.career_start_year;
  }
  return true;
}, {
  message: "Career end year must be greater than or equal to career start year",
  path: ["career_end_year"],
});

type AthleteFormData = z.infer<typeof athleteSchema>;

interface AddAthleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddAthleteDialog = ({ open, onOpenChange }: AddAthleteDialogProps) => {
  const [positions, setPositions] = useState<string[]>([]);
  const [clubs, setClubs] = useState<string[]>([]);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<AthleteFormData>({
    resolver: zodResolver(athleteSchema),
    defaultValues: {
      name: "",
      country_of_origin: "",
      nationality: "",
      year_of_birth: undefined,
      date_of_death: "",
      is_active: true,
      profile_picture_url: "",
      career_start_year: undefined,
      career_end_year: undefined,
    },
  });

  const addPosition = () => {
    if (selectedPosition && !positions.includes(selectedPosition)) {
      setPositions([...positions, selectedPosition]);
      setSelectedPosition("");
    }
  };

  const removePosition = (position: string) => {
    setPositions(positions.filter(p => p !== position));
  };

  const onSubmit = async (data: AthleteFormData) => {
    try {
      setIsSubmitting(true);

      const athleteData = {
        id: crypto.randomUUID(),
        name: data.name,
        country_of_origin: data.country_of_origin || null,
        nationality: data.nationality || null,
        year_of_birth: data.year_of_birth || null,
        date_of_death: data.date_of_death || null,
        is_active: data.is_active,
        positions: positions.length > 0 ? positions : null,
        clubs: clubs.length > 0 ? clubs : null,
        profile_picture_url: data.profile_picture_url || null,
        career_start_year: data.career_start_year || null,
        career_end_year: data.career_end_year || null,
      };

      const { error } = await supabase
        .from("athletes")
        .insert([athleteData]);

      if (error) throw error;

      toast.success("Athlete added successfully!");
      queryClient.invalidateQueries({ queryKey: ["athletesAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["athleteStats"] });
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
      
      form.reset();
      setPositions([]);
      setClubs([]);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error adding athlete:", error);
      toast.error(error.message || "Failed to add athlete");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Athlete</DialogTitle>
          <DialogDescription>
            Add a new athlete to the database. Fill in as much information as available.
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
                name="year_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year of Birth</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="YYYY" 
                        min="1800" 
                        max={new Date().getFullYear()}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="career_start_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Career Start Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="YYYY" 
                        min="1800" 
                        max={new Date().getFullYear()}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormDescription>
                      Year the professional career started
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="career_end_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Career End Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="YYYY" 
                        min="1800" 
                        max={new Date().getFullYear()}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormDescription>
                      Year the professional career ended (leave empty if active)
                    </FormDescription>
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
                <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a position" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                    {FOOTBALL_POSITIONS.map((position) => (
                      <SelectItem key={position} value={position} className="hover:bg-gray-100">
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  onClick={addPosition} 
                  size="sm"
                  disabled={!selectedPosition || positions.includes(selectedPosition)}
                >
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

            <div className="space-y-3">
              <FormLabel>Clubs</FormLabel>
              <FormDescription>
                Select clubs that this athlete has played for
              </FormDescription>
              <ClubsMultiSelect
                selectedClubs={clubs}
                onClubsChange={setClubs}
                placeholder="Select clubs..."
              />
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
                {isSubmitting ? "Adding..." : "Add Athlete"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAthleteDialog;

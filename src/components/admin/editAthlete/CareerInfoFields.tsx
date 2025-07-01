
import { Control } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AthleteFormData } from "./athleteFormSchema";

interface CareerInfoFieldsProps {
  control: Control<AthleteFormData>;
}

export const CareerInfoFields = ({ control }: CareerInfoFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
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
        control={control}
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
        control={control}
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
        control={control}
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
  );
};

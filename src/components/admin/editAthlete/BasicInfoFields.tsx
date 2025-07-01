
import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AthleteFormData } from "./athleteFormSchema";

interface BasicInfoFieldsProps {
  control: Control<AthleteFormData>;
}

export const BasicInfoFields = ({ control }: BasicInfoFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
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
        control={control}
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
        control={control}
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
        control={control}
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
    </div>
  );
};

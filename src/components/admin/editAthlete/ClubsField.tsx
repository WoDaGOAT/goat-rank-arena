
import { FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import ClubsMultiSelect from "../ClubsMultiSelect";
import { Control } from "react-hook-form";

interface ClubsFieldProps {
  control: Control<any>;
  clubs: string[];
  onClubsChange: (clubs: string[]) => void;
}

const ClubsField = ({ control, clubs, onClubsChange }: ClubsFieldProps) => {
  return (
    <div className="space-y-3">
      <FormLabel>Clubs</FormLabel>
      <FormDescription>
        Select clubs that this athlete has played for
      </FormDescription>
      <ClubsMultiSelect
        selectedClubs={clubs}
        onClubsChange={onClubsChange}
        placeholder="Select clubs..."
      />
    </div>
  );
};

export default ClubsField;

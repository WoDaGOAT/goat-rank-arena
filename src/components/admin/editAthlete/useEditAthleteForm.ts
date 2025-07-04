
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { athleteSchema, AthleteFormData } from "./athleteFormSchema";

interface UseEditAthleteFormProps {
  athlete: any;
  open: boolean;
  onAthleteUpdated: () => void;
  onOpenChange: (open: boolean) => void;
}

export const useEditAthleteForm = ({ athlete, open, onAthleteUpdated, onOpenChange }: UseEditAthleteFormProps) => {
  const [positions, setPositions] = useState<string[]>([]);
  const [clubs, setClubs] = useState<string[]>([]);
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

  // Reset form and positions when athlete changes or dialog opens
  useEffect(() => {
    if (athlete && open) {
      console.log('Resetting form with athlete data:', athlete);
      
      const formData = {
        name: athlete.name || "",
        country_of_origin: athlete.country_of_origin || "",
        nationality: athlete.nationality || "",
        year_of_birth: athlete.year_of_birth || undefined,
        date_of_death: athlete.date_of_death || "",
        is_active: athlete.is_active ?? true,
        profile_picture_url: athlete.profile_picture_url || "",
        career_start_year: athlete.career_start_year || undefined,
        career_end_year: athlete.career_end_year || undefined,
      };
      
      form.reset(formData);
      setPositions(athlete.positions || []);
      setClubs(athlete.clubs || []);
    }
  }, [athlete, open, form]);

  // Clear form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset();
      setPositions([]);
      setClubs([]);
      setIsSubmitting(false);
    }
  }, [open, form]);

  const onSubmit = async (data: AthleteFormData) => {
    if (!athlete?.id) {
      toast.error("No athlete selected for editing");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Submitting athlete update:', data);

      const updates = {
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
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating athlete:", error);
      toast.error(error.message || "Failed to update athlete");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return {
    form,
    positions,
    setPositions,
    clubs,
    setClubs,
    isSubmitting,
    onSubmit,
    handleClose,
  };
};

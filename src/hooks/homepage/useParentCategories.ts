
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const useParentCategories = () => {
  return useQuery({
    queryKey: ["parentCategories"],
    queryFn: async () => {
      const { data: parentCategories, error: parentError } = await supabase
        .from("categories")
        .select("id, name")
        .in("name", ["GOAT", "Current GOAT", "Competitions"])
        .is("parent_id", null);

      if (parentError || !parentCategories || parentCategories.length === 0) {
        toast.error("Failed to load parent categories.");
        console.error("Error fetching parent categories for homepage:", parentError);
        throw new Error(parentError?.message || "Parent categories not found");
      }

      return parentCategories.map(p => p.id);
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

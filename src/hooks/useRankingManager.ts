
import { useState } from "react";
import { Athlete } from "@/types";
import { toast } from "sonner";

export interface SelectedAthlete extends Athlete {
  userPoints: number;
  error?: string | null;
}

export const useRankingManager = () => {
  const [selectedAthletes, setSelectedAthletes] = useState<SelectedAthlete[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addAthlete = (athlete: Athlete): boolean => {
    if (selectedAthletes.length >= 10) {
      toast.info("You can only rank up to 10 athletes.");
      return false;
    }

    const newPosition = selectedAthletes.length + 1;
    const userPoints = Math.max(0, 100 - (newPosition - 1) * 5); // Points decrease by 5 for each position
    
    setSelectedAthletes(prev => [...prev, {
      ...athlete,
      userPoints,
      error: null,
    }]);
    return true;
  };

  const removeAthlete = (athleteId: string) => {
    setSelectedAthletes(prev => {
      const updated = prev.filter(athlete => athlete.id !== athleteId);
      // Recalculate points based on new positions and clear errors
      return updated.map((athlete, index) => ({
        ...athlete,
        userPoints: Math.max(0, 100 - index * 5),
        error: null,
      }));
    });
  };

  const updateAthletePoints = (athleteId: string, points: number) => {
    setSelectedAthletes(prev => {
      const updatedList = prev.map(athlete =>
        athlete.id === athleteId ? { ...athlete, userPoints: points } : athlete
      );

      return updatedList.map((athlete, index, arr) => {
        let error: string | null = null;

        if (athlete.userPoints < 0 || athlete.userPoints > 100) {
          error = "Points must be 0-100.";
        } else if (index > 0) {
          const prevAthlete = arr[index - 1];
          if (athlete.userPoints >= prevAthlete.userPoints) {
            error = "Must be less than rank above.";
          } else if (prevAthlete.userPoints - athlete.userPoints > 10) {
            error = "Max 10 point gap.";
          }
        }
        return { ...athlete, error };
      });
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedAthletes = [...selectedAthletes];
    const draggedItem = updatedAthletes[draggedIndex];
    updatedAthletes.splice(draggedIndex, 1);
    updatedAthletes.splice(index, 0, draggedItem);

    // Recalculate points based on new positions and clear errors
    const reorderedWithPoints = updatedAthletes.map((athlete, idx) => ({
      ...athlete,
      userPoints: Math.max(0, 100 - idx * 5),
      error: null,
    }));

    setSelectedAthletes(reorderedWithPoints);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return {
    selectedAthletes,
    addAthlete,
    removeAthlete,
    updateAthletePoints,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};

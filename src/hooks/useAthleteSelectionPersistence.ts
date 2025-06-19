
import { useEffect } from 'react';
import { SelectedAthlete } from '@/hooks/useRankingManager';

const STORAGE_KEY = 'pending_athlete_selection';

export const useAthleteSelectionPersistence = () => {
  const saveSelection = (athletes: SelectedAthlete[], categoryId: string) => {
    const selectionData = {
      athletes,
      categoryId,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectionData));
  };

  const loadSelection = (currentCategoryId: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const selectionData = JSON.parse(stored);
      
      // Check if the selection is for the current category and not too old (1 hour)
      if (
        selectionData.categoryId === currentCategoryId &&
        Date.now() - selectionData.timestamp < 60 * 60 * 1000
      ) {
        return selectionData.athletes;
      }
    } catch (error) {
      console.error('Error loading athlete selection:', error);
    }
    return null;
  };

  const clearSelection = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    saveSelection,
    loadSelection,
    clearSelection,
  };
};


import { useEffect } from 'react';
import { SelectedAthlete } from '@/hooks/useRankingManager';

const STORAGE_KEY = 'pending_athlete_selection';

export const useAthleteSelectionPersistence = () => {
  const saveSelection = (athletes: SelectedAthlete[], categoryId: string) => {
    console.log('Saving athlete selection:', athletes.length, 'athletes for category:', categoryId);
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
      if (!stored) {
        console.log('No stored athlete selection found');
        return null;
      }

      const selectionData = JSON.parse(stored);
      console.log('Found stored selection:', selectionData);
      
      // Check if the selection is for the current category and not too old (1 hour)
      if (
        selectionData.categoryId === currentCategoryId &&
        Date.now() - selectionData.timestamp < 60 * 60 * 1000
      ) {
        console.log('Restoring athlete selection:', selectionData.athletes.length, 'athletes');
        return selectionData.athletes;
      } else {
        console.log('Stored selection is for different category or too old, clearing');
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error loading athlete selection:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
    return null;
  };

  const clearSelection = () => {
    console.log('Clearing stored athlete selection');
    localStorage.removeItem(STORAGE_KEY);
  };

  const hasStoredSelection = (currentCategoryId: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return false;

      const selectionData = JSON.parse(stored);
      return selectionData.categoryId === currentCategoryId &&
             Date.now() - selectionData.timestamp < 60 * 60 * 1000;
    } catch {
      return false;
    }
  };

  return {
    saveSelection,
    loadSelection,
    clearSelection,
    hasStoredSelection,
  };
};

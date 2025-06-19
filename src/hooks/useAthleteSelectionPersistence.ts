
import { useCallback } from 'react';
import { SelectedAthlete } from '@/hooks/useRankingManager';

const STORAGE_KEY = 'pending_athlete_selection';

export const useAthleteSelectionPersistence = () => {
  const saveSelection = useCallback((athletes: SelectedAthlete[], categoryId: string) => {
    console.log('Saving athlete selection to localStorage:', athletes.length, 'athletes for category:', categoryId);
    const selectionData = {
      athletes,
      categoryId,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectionData));
  }, []);

  const loadSelection = useCallback((currentCategoryId: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        console.log('No stored athlete selection found');
        return null;
      }

      const selectionData = JSON.parse(stored);
      console.log('Found stored selection:', selectionData);
      
      // Check if the selection is for the current category and not too old (24 hours)
      if (
        selectionData.categoryId === currentCategoryId &&
        Date.now() - selectionData.timestamp < 24 * 60 * 60 * 1000
      ) {
        console.log('Loading athlete selection from localStorage:', selectionData.athletes.length, 'athletes');
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
  }, []);

  const clearSelection = useCallback(() => {
    console.log('Clearing stored athlete selection from localStorage');
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const hasStoredSelection = useCallback((currentCategoryId: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return false;

      const selectionData = JSON.parse(stored);
      return selectionData.categoryId === currentCategoryId &&
             Date.now() - selectionData.timestamp < 24 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  }, []);

  return {
    saveSelection,
    loadSelection,
    clearSelection,
    hasStoredSelection,
  };
};

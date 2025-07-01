
import { useCallback } from 'react';

interface SelectedAthleteData {
  id: string;
  userPoints: number;
  error?: string | null;
}

const STORAGE_KEY = 'wodagoat_athlete_selection';

export const useAthleteSelectionPersistence = () => {
  const saveSelection = useCallback((athletes: SelectedAthleteData[], categoryId: string) => {
    try {
      const selectionData = {
        categoryId,
        athletes,
        timestamp: Date.now(),
        // Add expiration time (24 hours)
        expiresAt: Date.now() + (24 * 60 * 60 * 1000)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectionData));
      console.log('🔍 useAthleteSelectionPersistence - Saved selection:', athletes.length, 'athletes');
    } catch (error) {
      console.warn('🔍 useAthleteSelectionPersistence - Failed to save selection:', error);
    }
  }, []);

  const loadSelection = useCallback((categoryId: string): SelectedAthleteData[] | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        console.log('🔍 useAthleteSelectionPersistence - No saved selection found');
        return null;
      }

      const selectionData = JSON.parse(saved);
      
      // Check if data has expired
      if (selectionData.expiresAt && Date.now() > selectionData.expiresAt) {
        console.log('🔍 useAthleteSelectionPersistence - Saved selection expired, clearing');
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      // Check if it's for the same category
      if (selectionData.categoryId !== categoryId) {
        console.log('🔍 useAthleteSelectionPersistence - Selection for different category, ignoring');
        return null;
      }

      console.log('🔍 useAthleteSelectionPersistence - Loaded selection:', selectionData.athletes?.length || 0, 'athletes');
      return selectionData.athletes || null;
    } catch (error) {
      console.warn('🔍 useAthleteSelectionPersistence - Failed to load selection:', error);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }, []);

  const clearSelection = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('🔍 useAthleteSelectionPersistence - Cleared saved selection');
    } catch (error) {
      console.warn('🔍 useAthleteSelectionPersistence - Failed to clear selection:', error);
    }
  }, []);

  // Clear expired selections on hook initialization
  const clearExpiredSelections = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const selectionData = JSON.parse(saved);
        if (selectionData.expiresAt && Date.now() > selectionData.expiresAt) {
          localStorage.removeItem(STORAGE_KEY);
          console.log('🔍 useAthleteSelectionPersistence - Cleared expired selection on init');
        }
      }
    } catch (error) {
      console.warn('🔍 useAthleteSelectionPersistence - Failed to clear expired selections:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Clear expired selections on hook initialization
  clearExpiredSelections();

  return {
    saveSelection,
    loadSelection,
    clearSelection
  };
};

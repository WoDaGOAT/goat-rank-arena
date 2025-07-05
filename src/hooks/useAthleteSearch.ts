
import { useState, useMemo } from "react";
import { useAthletes, DatabaseAthlete } from "./useAthletes";
import { mapDatabaseAthleteToUIAthlete } from "@/utils/athleteDataMapper";
import { Athlete } from "@/types";
import { getCategoryPositionMapping, athleteMatchesCategory } from "@/utils/categoryPositionMapping";

interface UseAthleteSearchParams {
  excludedAthletes?: Athlete[];
  categoryId?: string;
  categoryName?: string;
}

export const useAthleteSearch = ({ 
  excludedAthletes = [], 
  categoryId, 
  categoryName 
}: UseAthleteSearchParams = {}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: athletes = [], isLoading } = useAthletes();

  const filteredAthletes = useMemo(() => {
    console.log('Filtering athletes for category:', categoryName);
    console.log('Total athletes loaded:', athletes.length);
    
    let filtered = athletes.map(athlete => mapDatabaseAthleteToUIAthlete(athlete));
    console.log('Athletes after mapping:', filtered.length);

    // Apply category-based position filtering if category name is provided
    if (categoryName) {
      const positionMapping = getCategoryPositionMapping(categoryName);
      console.log('Position mapping result:', positionMapping);
      
      if (positionMapping) {
        const beforeFilter = filtered.length;
        filtered = filtered.filter(athlete => 
          athleteMatchesCategory(athlete.positions, positionMapping, athlete.isActive)
        );
        console.log(`Category filtering: ${beforeFilter} -> ${filtered.length} athletes`);
      } else {
        console.log('No position filtering applied for category:', categoryName);
      }
    }

    // Exclude already selected athletes
    if (excludedAthletes.length > 0) {
      const excludedIds = excludedAthletes.map(a => a.id);
      const beforeExclude = filtered.length;
      filtered = filtered.filter(athlete => !excludedIds.includes(athlete.id));
      console.log(`After excluding selected: ${beforeExclude} -> ${filtered.length} athletes`);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const lowercaseSearch = searchTerm.toLowerCase();
      const beforeSearch = filtered.length;
      filtered = filtered.filter((athlete: Athlete) => {
        const nameMatch = athlete.name.toLowerCase().includes(lowercaseSearch);
        const countryMatch = athlete.countryOfOrigin?.toLowerCase().includes(lowercaseSearch);
        const nationalityMatch = athlete.nationality?.toLowerCase().includes(lowercaseSearch);
        const positionMatch = athlete.positions?.some(position => 
          position.toLowerCase().includes(lowercaseSearch)
        );
        
        return nameMatch || countryMatch || nationalityMatch || positionMatch;
      });
      console.log(`After search filtering: ${beforeSearch} -> ${filtered.length} athletes`);
    }

    // Log a few example athletes for debugging
    if (filtered.length > 0) {
      console.log('Sample filtered athletes:', filtered.slice(0, 3).map(a => ({ 
        name: a.name, 
        positions: a.positions, 
        isActive: a.isActive 
      })));
    }

    return filtered;
  }, [athletes, searchTerm, excludedAthletes, categoryName]);

  const resetSearch = () => {
    setSearchTerm("");
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedLetter: "", // Keep for compatibility but always empty
    setSelectedLetter: () => {}, // Keep for compatibility but do nothing
    athletes: filteredAthletes,
    filteredAthletes,
    isLoading,
    resetSearch,
  };
};

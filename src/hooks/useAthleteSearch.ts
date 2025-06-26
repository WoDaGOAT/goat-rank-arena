
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
  const [selectedLetter, setSelectedLetter] = useState<string>("");
  const { data: athletes = [], isLoading } = useAthletes();

  const filteredAthletes = useMemo(() => {
    let filtered = athletes.map(athlete => mapDatabaseAthleteToUIAthlete(athlete));

    // Apply category-based position filtering if category name is provided
    if (categoryName) {
      const positionMapping = getCategoryPositionMapping(categoryName);
      if (positionMapping) {
        filtered = filtered.filter(athlete => 
          athleteMatchesCategory(athlete.positions, positionMapping, athlete.isActive)
        );
      }
    }

    // Exclude already selected athletes
    if (excludedAthletes.length > 0) {
      const excludedIds = excludedAthletes.map(a => a.id);
      filtered = filtered.filter(athlete => !excludedIds.includes(athlete.id));
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((athlete: Athlete) => {
        const nameMatch = athlete.name.toLowerCase().includes(lowercaseSearch);
        const countryMatch = athlete.countryOfOrigin?.toLowerCase().includes(lowercaseSearch);
        const nationalityMatch = athlete.nationality?.toLowerCase().includes(lowercaseSearch);
        const positionMatch = athlete.positions?.some(position => 
          position.toLowerCase().includes(lowercaseSearch)
        );
        
        return nameMatch || countryMatch || nationalityMatch || positionMatch;
      });
    }

    // Filter by selected letter
    if (selectedLetter) {
      filtered = filtered.filter(athlete => 
        athlete.name.charAt(0).toLowerCase() === selectedLetter.toLowerCase()
      );
    }

    return filtered;
  }, [athletes, searchTerm, selectedLetter, excludedAthletes, categoryName]);

  const resetSearch = () => {
    setSearchTerm("");
    setSelectedLetter("");
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedLetter,
    setSelectedLetter,
    athletes: filteredAthletes,
    filteredAthletes,
    isLoading,
    resetSearch,
  };
};

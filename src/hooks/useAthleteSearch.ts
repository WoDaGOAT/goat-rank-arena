
import { useState, useMemo } from "react";
import { Athlete } from "@/types";
import allFootballPlayers from "@/data/footballPlayers";
import { SelectedAthlete } from "./useRankingManager";

export const useAthleteSearch = (selectedAthletes: SelectedAthlete[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string>("");

  const filteredAthletes = useMemo(() => {
    return allFootballPlayers.filter(athlete => {
      // Split search term into individual words and clean them
      const searchWords = searchTerm.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0);
      
      // Split athlete name into individual words
      const nameWords = athlete.name.toLowerCase().split(/\s+/);
      
      // Check if all search words match at least one word in the athlete's name
      const matchesSearch = searchWords.length === 0 || searchWords.every(searchWord => 
        nameWords.some(nameWord => nameWord.includes(searchWord))
      );
      
      const matchesLetter = selectedLetter === "" || athlete.name.charAt(0).toUpperCase() === selectedLetter;
      const notSelected = !selectedAthletes.some(selected => selected.id === athlete.id);
      
      return matchesSearch && matchesLetter && notSelected;
    });
  }, [searchTerm, selectedLetter, selectedAthletes]);

  const resetSearch = () => {
    setSearchTerm("");
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedLetter,
    setSelectedLetter,
    filteredAthletes,
    resetSearch
  };
};

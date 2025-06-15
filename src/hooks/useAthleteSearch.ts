
import { useState, useMemo } from "react";
import { Athlete } from "@/types";
import allFootballPlayers from "@/data/footballPlayers";
import { SelectedAthlete } from "./useRankingManager";

export const useAthleteSearch = (selectedAthletes: SelectedAthlete[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string>("");

  const filteredAthletes = useMemo(() => {
    return allFootballPlayers.filter(athlete => {
      const matchesSearch = athlete.name.toLowerCase().includes(searchTerm.toLowerCase());
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

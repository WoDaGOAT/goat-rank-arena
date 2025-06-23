
import { useState, useMemo } from "react";
import { useAthletes, DatabaseAthlete } from "./useAthletes";
import { mapDatabaseAthleteToUIAthlete } from "@/utils/athleteDataMapper";
import { Athlete } from "@/types";

export const useAthleteSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: athletes = [], isLoading } = useAthletes();

  const filteredAthletes = useMemo(() => {
    if (!searchTerm.trim()) {
      return athletes.map(athlete => mapDatabaseAthleteToUIAthlete(athlete));
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    return athletes
      .filter((athlete: DatabaseAthlete) => {
        const nameMatch = athlete.name.toLowerCase().includes(lowercaseSearch);
        const countryMatch = athlete.country_of_origin?.toLowerCase().includes(lowercaseSearch);
        const nationalityMatch = athlete.nationality?.toLowerCase().includes(lowercaseSearch);
        const positionMatch = athlete.positions?.some(position => 
          position.toLowerCase().includes(lowercaseSearch)
        );
        
        return nameMatch || countryMatch || nationalityMatch || positionMatch;
      })
      .map(athlete => mapDatabaseAthleteToUIAthlete(athlete));
  }, [athletes, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    athletes: filteredAthletes,
    isLoading,
  };
};

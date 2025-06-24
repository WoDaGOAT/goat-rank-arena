
import { DatabaseAthlete } from "@/hooks/useAthletes";
import { Athlete } from "@/types";

/**
 * Maps database athlete data to the UI athlete interface
 */
export const mapDatabaseAthleteToUIAthlete = (
  dbAthlete: DatabaseAthlete,
  rank: number = 0,
  points: number = 0
): Athlete => {
  return {
    id: dbAthlete.id,
    rank,
    name: dbAthlete.name,
    imageUrl: dbAthlete.profile_picture_url || "/placeholder.svg",
    points,
    movement: "neutral" as const,
    dateOfBirth: dbAthlete.year_of_birth ? dbAthlete.year_of_birth.toString() : "",
    dateOfDeath: dbAthlete.date_of_death || undefined,
    isActive: dbAthlete.is_active,
    countryOfOrigin: dbAthlete.country_of_origin || "",
    clubs: [],
    competitions: [],
    positions: dbAthlete.positions || [],
    nationality: dbAthlete.nationality || "",
  };
};

/**
 * Maps an array of database athletes to UI athletes
 */
export const mapDatabaseAthletesToUIAthletes = (
  dbAthletes: DatabaseAthlete[],
  withRanking: boolean = false
): Athlete[] => {
  return dbAthletes.map((dbAthlete, index) =>
    mapDatabaseAthleteToUIAthlete(
      dbAthlete,
      withRanking ? index + 1 : 0,
      0
    )
  );
};

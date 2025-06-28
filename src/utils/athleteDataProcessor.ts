import footballPlayers from '@/data/footballPlayers';
import { RankedAthlete, RankingAthlete, DatabaseAthlete } from '@/types/userRanking';

export const hydrateAthleteData = (
  rankingAthletes: RankingAthlete[],
  dbAthletes: DatabaseAthlete[]
): RankedAthlete[] => {
  console.log('hydrateAthleteData: Processing athlete data hydration');
  
  const hydratedAthletes: RankedAthlete[] = rankingAthletes.map(athlete => {
    console.log('hydrateAthleteData: Processing athlete:', athlete.athlete_id, 'type:', typeof athlete.athlete_id);
    
    // First try to find athlete in database (exact match)
    const dbAthlete = dbAthletes.find(db => db.id === athlete.athlete_id);
    
    if (dbAthlete) {
      console.log('hydrateAthleteData: Found athlete in database:', dbAthlete.name);
      return {
        id: athlete.athlete_id,
        name: dbAthlete.name,
        imageUrl: dbAthlete.profile_picture_url || "/placeholder.svg",
        position: athlete.position,
        points: athlete.points
      };
    }
    
    // Enhanced fallback to footballPlayers - try both string and converted formats
    let footballPlayer = null;
    
    // Convert athlete.athlete_id to string for comparison
    const athleteIdStr = String(athlete.athlete_id);
    
    // Try direct string match first (convert both to strings for comparison)
    footballPlayer = footballPlayers.find(p => String(p.id) === athleteIdStr);
    
    // If not found and athlete_id looks like a number, try numeric match
    if (!footballPlayer && !isNaN(Number(athleteIdStr))) {
      const athleteIdNum = Number(athleteIdStr);
      footballPlayer = footballPlayers.find(p => Number(p.id) === athleteIdNum);
    }
    
    if (footballPlayer) {
      console.log('hydrateAthleteData: Found athlete in footballPlayers:', footballPlayer.name);
      return {
        id: athlete.athlete_id,
        name: footballPlayer.name,
        imageUrl: footballPlayer.imageUrl,
        position: athlete.position,
        points: athlete.points
      };
    }
    
    // Last resort - return with unknown athlete info but keep the structure
    console.warn('hydrateAthleteData: Unknown athlete - ID:', athlete.athlete_id, 'Type:', typeof athlete.athlete_id);
    return {
      id: athlete.athlete_id,
      name: `Unknown Athlete (${athlete.athlete_id})`,
      imageUrl: "/placeholder.svg",
      position: athlete.position,
      points: athlete.points
    };
  });
  
  console.log('hydrateAthleteData: SUCCESS - Hydrated athletes:', hydratedAthletes.length, 'athletes');
  console.log('hydrateAthleteData: Athletes breakdown:', {
    total: hydratedAthletes.length,
    fromDatabase: hydratedAthletes.filter(a => !a.name.startsWith('Unknown')).length,
    unknown: hydratedAthletes.filter(a => a.name.startsWith('Unknown')).length
  });
  
  return hydratedAthletes;
};

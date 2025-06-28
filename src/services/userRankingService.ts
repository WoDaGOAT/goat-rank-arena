
import { supabase } from '@/lib/supabase';
import { DatabaseAthlete, RankingAthlete } from '@/types/userRanking';

export const fetchRankingData = async (rankingId: string) => {
  console.log('fetchRankingData: Fetching core ranking data for ID:', rankingId);
  
  const { data: rankingData, error: rankingError } = await supabase
    .from('user_rankings')
    .select('*')
    .eq('id', rankingId)
    .maybeSingle();

  if (rankingError) {
    console.error("fetchRankingData: Error fetching ranking:", rankingError);
    throw new Error(`Failed to fetch ranking: ${rankingError.message}`);
  }
  
  if (!rankingData) {
    console.warn(`fetchRankingData: No ranking found for ID ${rankingId}`);
    return null;
  }

  console.log('fetchRankingData: SUCCESS - Found ranking data:', rankingData);
  return rankingData;
};

export const fetchProfileData = async (userId: string) => {
  try {
    console.log('fetchProfileData: Fetching profile data for user:', userId);
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', userId)
      .maybeSingle();
    
    if (profileError) {
      console.error(`fetchProfileData: Profile error for user ${userId}:`, profileError);
      return null;
    }
    
    console.log('fetchProfileData: SUCCESS - Profile data:', profile);
    return profile;
  } catch (error) {
    console.error('fetchProfileData: Profile fetch failed:', error);
    return null;
  }
};

export const fetchCategoryData = async (categoryId: string) => {
  try {
    console.log('fetchCategoryData: Fetching category data for category:', categoryId);
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('name')
      .eq('id', categoryId)
      .maybeSingle();
    
    if (categoryError) {
      console.error(`fetchCategoryData: Category error for category ${categoryId}:`, categoryError);
      return null;
    }
    
    console.log('fetchCategoryData: SUCCESS - Category data:', category);
    return category;
  } catch (error) {
    console.error('fetchCategoryData: Category fetch failed:', error);
    return null;
  }
};

export const fetchRankingAthletes = async (rankingId: string): Promise<RankingAthlete[]> => {
  console.log('fetchRankingAthletes: Fetching athletes data for ranking:', rankingId);
  
  const { data: athletes, error: athletesError } = await supabase
    .from('ranking_athletes')
    .select('athlete_id, position, points')
    .eq('ranking_id', rankingId)
    .order('position', { ascending: true });
  
  if (athletesError) {
    console.error("fetchRankingAthletes: Athletes error:", athletesError);
    throw new Error(`Failed to fetch ranking athletes: ${athletesError.message}`);
  }
  
  console.log('fetchRankingAthletes: SUCCESS - Athletes data:', athletes);
  return athletes || [];
};

export const fetchDatabaseAthletes = async (athleteIds: string[]): Promise<DatabaseAthlete[]> => {
  if (athleteIds.length === 0) return [];
  
  try {
    console.log('fetchDatabaseAthletes: Fetching database athletes for IDs:', athleteIds);
    const { data: athletes, error: dbAthletesError } = await supabase
      .from('athletes')
      .select('id, name, profile_picture_url')
      .in('id', athleteIds);
    
    if (dbAthletesError) {
      console.error("fetchDatabaseAthletes: Database athletes error:", dbAthletesError);
      return [];
    }
    
    console.log('fetchDatabaseAthletes: SUCCESS - Database athletes found:', athletes?.length || 0);
    return athletes || [];
  } catch (error) {
    console.error('fetchDatabaseAthletes: Database athletes fetch failed:', error);
    return [];
  }
};

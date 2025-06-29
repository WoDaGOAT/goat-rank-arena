
export interface RankedAthlete {
  id: string;
  name: string;
  imageUrl?: string;
  position: number;
  points: number;
}

export interface UserRankingDetails {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  user_id: string;
  category_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  categories: {
    name: string | null;
  } | null;
  athletes: RankedAthlete[];
}

export interface RankingAthlete {
  athlete_id: string;
  position: number;
  points: number;
}

export interface DatabaseAthlete {
  id: string;
  name: string;
  profile_picture_url: string | null;
}

export type AthleteMovement = "up" | "down" | "neutral";

export interface Club {
  name: string;
  country: string;
  league: string;
  yearsActive: string; // e.g., "2008-2015"
}

export interface Competition {
  name: string;
  type: "domestic" | "international" | "continental";
}

export interface Athlete {
  id: string;
  rank: number;
  name: string;
  imageUrl?: string;
  points: number;
  movement: AthleteMovement;
  // New detailed fields
  dateOfBirth: string;
  dateOfDeath?: string;
  isActive: boolean;
  countryOfOrigin: string;
  clubs: Club[];
  competitions: Competition[];
  positions: string[]; // e.g., ["Forward", "Right Winger"]
  nationality: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  athleteIds?: string[];
  userRankingCount: number;
  leaderboard: Athlete[];
}

// New type for user comments on their profile
export interface UserComment {
  id: string;
  comment: string;
  created_at: string;
  category_id: string;
  categories: { name: string | null } | null;
}

// New type for comments with user profile information
export interface CommentWithUser {
  id: string;
  comment: string;
  created_at: string;
  parent_comment_id: string | null;
  user_id: string;
  profiles: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

// New type for the admin comment management view
export interface AdminComment {
  comment_id: string;
  comment_text: string;
  created_at: string;
  user_id: string;
  user_full_name: string | null;
  user_avatar_url: string | null;
  user_status: 'active' | 'banned';
  category_id: string;
  category_name: string | null;
}

// New type for notifications - using a discriminated union
export type Notification =
  | {
      id: string;
      user_id: string;
      is_read: boolean;
      created_at: string;
      type: 'new_comment_reply';
      data: {
        category_id: string;
        category_name: string;
        comment_id: string;
        parent_comment_id: string;
        replying_user_id: string;
        replying_user_name: string;
      };
    }
  | {
      id: string;
      user_id: string;
      is_read: boolean;
      created_at: string;
      type: 'new_category';
      data: {
        category_id: string;
        category_name: string;
      };
    }
  | {
      id: string;
      user_id: string;
      is_read: boolean;
      created_at: string;
      type: 'new_friend_request';
      data: {
        requester_id: string;
        requester_name: string;
        friendship_id: string;
      };
    }
  | {
      id: string;
      user_id: string;
      is_read: boolean;
      created_at: string;
      type: 'friend_request_accepted';
      data: {
        receiver_id: string;
        receiver_name: string;
        friendship_id: string;
      };
    };

// Placeholder images (keys from provided list)
export const placeholderImages: Record<string, string> = {
  "lionel-messi": "photo-1493962853295-0fd70327578a",
  "cristiano-ronaldo": "photo-1466721591366-2d5fba72006d",
  "neymar-jr": "photo-1452378174528-3090a4bba7b2",
  "kylian-mbappe": "photo-1469041797191-50ace28483c3",
  "kevin-de-bruyne": "photo-1438565434616-3ef039228b15",
  "robert-lewandowski": "photo-1441057206919-63d19fac2369",
  "erling-haaland": "photo-1518877593221-1f28583780b4",
  "mohamed-salah": "photo-1493962853295-0fd70327578a",
  "virgil-van-dijk": "photo-1466721591366-2d5fba72006d",
  "sadio-mane": "photo-1452378174528-3090a4bba7b2",
  "lebron-james": "photo-1469041797191-50ace28483c3",
  "stephen-curry": "photo-1438565434616-3ef039228b15",
};

// Function to get a placeholder image URL
export const getPlaceholderImageUrl = (key: string | undefined): string => {
  let imagePathId: string | undefined = undefined;

  if (key) {
    if (placeholderImages[key]) {
      imagePathId = placeholderImages[key];
    } else if (key.startsWith("photo-")) {
      imagePathId = key;
    }
  }

  if (imagePathId) {
    return `https://images.unsplash.com/${imagePathId}?w=400&h=225&fit=crop&q=80`;
  }
  return `/placeholder.svg`;
};

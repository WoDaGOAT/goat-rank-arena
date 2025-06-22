
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
    }
  | {
      id: string;
      user_id: string;
      is_read: boolean;
      created_at: string;
      type: 'ranking_reaction';
      data: {
        ranking_id: string;
        ranking_title: string;
        reaction_type: string;
        reacting_user_id: string;
        reacting_user_name: string;
      };
    }
  | {
      id: string;
      user_id: string;
      is_read: boolean;
      created_at: string;
      type: 'category_reaction';
      data: {
        category_id: string;
        category_name: string;
        reaction_type: string;
        reacting_user_id: string;
        reacting_user_name: string;
      };
    }
  | {
      id: string;
      user_id: string;
      is_read: boolean;
      created_at: string;
      type: 'quiz_completed';
      data: {
        quiz_id: string;
        quiz_title: string;
        score: number;
        total_questions: number;
        user_name: string;
        completed_at: string;
      };
    }
  | {
      id: string;
      user_id: string;
      is_read: boolean;
      created_at: string;
      type: 'badge_earned';
      data: {
        badge_id: string;
        badge_name: string;
        badge_description: string;
        badge_rarity: string;
        user_name: string;
        earned_at: string;
      };
    };

// Enhanced placeholder images with more athlete mappings
export const placeholderImages: Record<string, string> = {
  // Existing mappings
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
  
  // Additional football legends
  "pele": "photo-1488590528505-98d2b5aba04b",
  "diego-maradona": "photo-1518770660439-4636190af475",
  "zinedine-zidane": "photo-1461749280684-dccba630e2f6",
  "ronaldinho": "photo-1486312338219-ce68d2c6f44d",
  "ronaldo-nazario": "photo-1581091226825-a6a2a5aee158",
  "thierry-henry": "photo-1485827404703-89b55fcc595e",
  "francesco-totti": "photo-1526374965328-7f61d4dc18c5",
  "andrea-pirlo": "photo-1531297484001-80022131f5a1",
  "frank-lampard": "photo-1487058792275-0ad4aaf24ca7",
  "steven-gerrard": "photo-1605810230434-7631ac76ec81",
  "xavi-hernandez": "photo-1493962853295-0fd70327578a",
  "andres-iniesta": "photo-1466721591366-2d5fba72006d",
  "luis-figo": "photo-1452378174528-3090a4bba7b2",
  "david-beckham": "photo-1469041797191-50ace28483c3",
  "kaka": "photo-1438565434616-3ef039228b15",
  "paolo-maldini": "photo-1441057206919-63d19fac2369",
  "roberto-carlos": "photo-1518877593221-1f28583780b4",
  "cafu": "photo-1488590528505-98d2b5aba04b",
  "gianluigi-buffon": "photo-1518770660439-4636190af475",
  "iker-casillas": "photo-1461749280684-dccba630e2f6",
};

// Enhanced function to get a placeholder image URL with better fallback logic
export const getPlaceholderImageUrl = (key: string | undefined): string => {
  if (!key) {
    // Return a default sports-related image if no key provided
    return `https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=225&fit=crop&q=80`;
  }

  // Check if we have a direct mapping
  if (placeholderImages[key]) {
    return `https://images.unsplash.com/photo-${placeholderImages[key]}?w=400&h=225&fit=crop&q=80`;
  }

  // Check if the key already starts with "photo-" (direct Unsplash ID)
  if (key.startsWith("photo-")) {
    return `https://images.unsplash.com/${key}?w=400&h=225&fit=crop&q=80`;
  }

  // Try to find a partial match (case-insensitive) for athlete names
  const lowerKey = key.toLowerCase();
  for (const [athleteKey, imageId] of Object.entries(placeholderImages)) {
    if (athleteKey.toLowerCase().includes(lowerKey) || lowerKey.includes(athleteKey.toLowerCase())) {
      return `https://images.unsplash.com/photo-${imageId}?w=400&h=225&fit=crop&q=80`;
    }
  }

  // Use a hash-based approach to assign consistent images to unmapped athletes
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  // Get all available image IDs
  const imageIds = Object.values(placeholderImages);
  const imageIndex = hashCode(key) % imageIds.length;
  
  return `https://images.unsplash.com/photo-${imageIds[imageIndex]}?w=400&h=225&fit=crop&q=80`;
};

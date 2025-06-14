
export type AthleteMovement = "up" | "down" | "neutral";

export interface Athlete {
  id: string;
  rank: number;
  name: string;
  imageUrl?: string; // Using one of the placeholder keys or a full URL
  points: number;
  movement: AthleteMovement;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl?: string; // Optional image for the category
  athleteIds?: string[]; // To link athletes to this category if needed later
  userRankingCount: number;
  leaderboard: Athlete[]; // Each category has its own leaderboard
}

// Placeholder images (keys from provided list)
export const placeholderImages: Record<string, string> = {
  "lionel-messi": "photo-1493962853295-0fd70327578a",
  "cristiano-ronaldo": "photo-1466721591366-2d5fba72006d",
  "neymar-jr": "photo-1452378174528-3090a4bba7b2",
  "kylian-mbappe": "photo-1469041797191-50ace28483c3",
  "kevin-de-bruyne": "photo-1438565434616-3ef039228b15",
  "robert-lewandowski": "photo-1441057206919-63d19fac2369",
  "erling-haaland": "photo-1518877593221-1f28583780b4",
  "mohamed-salah": "photo-1493962853295-0fd70327578a", // Re-using for example
  "virgil-van-dijk": "photo-1466721591366-2d5fba72006d",
  "sadio-mane": "photo-1452378174528-3090a4bba7b2",
  "lebron-james": "photo-1469041797191-50ace28483c3",
  "stephen-curry": "photo-1438565434616-3ef039228b15",
  // Note: The placeholder_images context listed more generic images like:
  // "photo-1488590528505-98d2b5aba04b" (laptop)
  // "photo-1518770660439-4636190af475" (circuit board)
  // "photo-1461749280684-dccba630e2f6" (code on monitor)
  // "photo-1526374965328-7f61d4dc18c5" (matrix movie)
  // "photo-1487058792275-0ad4aaf24ca7" (colorful code)
  // "photo-1605810230434-7631ac76ec81" (people around screens)
  // "photo-1581090464777-f3220bbe1b8b" (blue light bulb)
  // "photo-1498050108023-c5249f4df085" (macbook with code)
  // "photo-1483058712412-4245e9b90334" (imac)
  // "photo-1470813740244-df37b8c1edcb" (starry night)
  // "photo-1500375592092-40eb2168fd21" (ocean wave)
  // "photo-1458668383970-8ddd3927deed" (mountain alps)
  // These could be added here if needed for athletes or other general purposes.
};

// Function to get a placeholder image URL
export const getPlaceholderImageUrl = (key: string | undefined): string => {
  let imagePathId: string | undefined = undefined; // This will be the string like "photo-xxxx..."

  if (key) {
    if (placeholderImages[key]) { // Case 1: key is an athlete ID (e.g., "messi"), value is "photo-xxxx..."
      imagePathId = placeholderImages[key];
    } else if (key.startsWith("photo-")) { // Case 2: key is already a "photo-xxxx..." string (e.g., category.imageUrl)
      imagePathId = key;
    }
  }

  if (imagePathId) {
    // Construct Unsplash URL. CategoryCard image is h-48 (192px).
    // w=400 & h=225 provides a 16:9 image suitable for object-cover.
    return `https://images.unsplash.com/${imagePathId}?w=400&h=225&fit=crop&q=80`;
  }
  return `/placeholder.svg`; // Default placeholder if no key or no match
};


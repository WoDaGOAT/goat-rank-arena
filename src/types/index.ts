
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
  "lionel-messi": "photo-1493962853295-0fd70327578a", // Example, replace with actual logic if images are uploaded
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
};

// Function to get a placeholder image URL (simplified)
// In a real app, you'd fetch from a CDN or backend
export const getPlaceholderImageUrl = (key: string | undefined): string => {
  if (key && placeholderImages[key]) {
    // This is a placeholder URL structure.
    // Replace with actual image serving logic if you upload images.
    // For now, let's use a generic placeholder.
    // return `https://images.unsplash.com/${placeholderImages[key]}?w=100&h=100&fit=crop`;
    return `/placeholder.svg`; // Using the existing placeholder
  }
  return `/placeholder.svg`; // Default placeholder
};


import { Category } from "@/types";

// Define the return type interface
export interface HomepageCategoriesData {
  goatFootballer: Category | null;
  otherCategories: Category[];
}

// Simple fallback data for preview environment
export const getFallbackData = (): HomepageCategoriesData => {
  return {
    goatFootballer: {
      id: 'fallback-goat-footballer',
      name: 'GOAT Footballer',
      description: 'Greatest footballer of all time',
      userRankingCount: 0,
      leaderboard: []
    },
    otherCategories: [
      {
        id: 'fallback-goalkeeper',
        name: 'GOAT Goalkeeper',
        description: 'Greatest goalkeeper of all time',
        userRankingCount: 0,
        leaderboard: []
      },
      {
        id: 'fallback-defender',
        name: 'GOAT Defender', 
        description: 'Greatest defender of all time',
        userRankingCount: 0,
        leaderboard: []
      }
    ]
  };
};

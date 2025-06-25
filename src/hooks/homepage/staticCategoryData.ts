
import { Category } from "@/types";
import { HomepageCategoriesData } from "./fallbackData";

// Static category data for immediate homepage loading
const createStaticCategory = (
  id: string, 
  name: string, 
  description: string, 
  imageUrl?: string
): Category => ({
  id,
  name,
  description,
  userRankingCount: 0, // Will be updated progressively if needed
  leaderboard: [], // Empty for static display
  imageUrl
});

// Featured categories with their actual database IDs for navigation
export const getStaticHomepageData = (): HomepageCategoriesData => {
  const goatFootballer = createStaticCategory(
    'goat-footballer-static', // Temporary static ID
    'GOAT Footballer',
    'Vote for the greatest footballer of all time. Compare legends across eras and decide who truly deserves the title.',
    undefined
  );

  const otherCategories = [
    createStaticCategory(
      'goat-goalkeeper-static',
      'GOAT Goalkeeper',
      'The greatest shot-stoppers in football history. From Yashin to Neuer, who stands between the posts as the ultimate GOAT?'
    ),
    createStaticCategory(
      'goat-defender-static',
      'GOAT Defender',
      'Masters of defense who defined generations. Vote for the defender who best combined skill, leadership, and tactical brilliance.'
    ),
    createStaticCategory(
      'goat-midfielder-static',
      'GOAT Midfielder',
      'The engines of their teams. From playmakers to destroyers, who controlled the game better than anyone else?'
    ),
    createStaticCategory(
      'goat-attacker-static',
      'GOAT Attacker',
      'Goal scorers, creators, and game changers. Which forward terrorized defenses and delivered when it mattered most?'
    ),
    createStaticCategory(
      'goat-free-kick-taker-static',
      'GOAT Free-Kick Taker',
      'Masters of the dead ball. Precision, power, and technique - who could bend it like no other?'
    ),
    createStaticCategory(
      'current-goat-footballer-static',
      'Current GOAT Footballer',
      'Among today\'s active players, who has the strongest claim to greatness? Vote for the current generation\'s finest.'
    )
  ];

  return {
    goatFootballer,
    otherCategories
  };
};

// Map static IDs to real category names for navigation
export const getCategoryNavigationPath = (staticId: string): string => {
  const categoryMap: Record<string, string> = {
    'goat-footballer-static': 'GOAT Footballer',
    'goat-goalkeeper-static': 'GOAT Goalkeeper', 
    'goat-defender-static': 'GOAT Defender',
    'goat-midfielder-static': 'GOAT Midfielder',
    'goat-attacker-static': 'GOAT Attacker',
    'goat-free-kick-taker-static': 'GOAT Free-Kick Taker',
    'current-goat-footballer-static': 'Current GOAT Footballer'
  };
  
  return categoryMap[staticId] || staticId;
};

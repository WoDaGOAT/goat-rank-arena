
import { FOOTBALL_POSITIONS } from "@/constants/positions";

export interface CategoryPositionMapping {
  positions: string[];
  activeOnly: boolean;
}

/**
 * Maps category names to their relevant football positions
 */
export const getCategoryPositionMapping = (categoryName: string): CategoryPositionMapping | null => {
  const lowerCaseName = categoryName.toLowerCase();
  
  // Current GOAT categories (active players only)
  if (lowerCaseName.includes('current goat')) {
    if (lowerCaseName.includes('goalkeeper')) {
      return { positions: ['Goalkeeper'], activeOnly: true };
    }
    if (lowerCaseName.includes('defender')) {
      return { positions: ['Defender'], activeOnly: true };
    }
    if (lowerCaseName.includes('midfielder') && !lowerCaseName.includes('attacking')) {
      return { positions: ['Midfielder'], activeOnly: true };
    }
    if (lowerCaseName.includes('attacking midfielder') || lowerCaseName.includes('winger')) {
      return { positions: ['Attacking Midfielder', 'Winger'], activeOnly: true };
    }
    if (lowerCaseName.includes('attacker') || lowerCaseName.includes('forward') || lowerCaseName.includes('striker')) {
      return { positions: ['Forward', 'Striker'], activeOnly: true };
    }
  }
  
  // Regular GOAT categories (all players)
  if (lowerCaseName.includes('goat')) {
    if (lowerCaseName.includes('goalkeeper')) {
      return { positions: ['Goalkeeper'], activeOnly: false };
    }
    if (lowerCaseName.includes('defender')) {
      return { positions: ['Defender'], activeOnly: false };
    }
    if (lowerCaseName.includes('midfielder') && !lowerCaseName.includes('attacking')) {
      return { positions: ['Midfielder'], activeOnly: false };
    }
    if (lowerCaseName.includes('attacking midfielder') || lowerCaseName.includes('winger')) {
      return { positions: ['Attacking Midfielder', 'Winger'], activeOnly: false };
    }
    if (lowerCaseName.includes('attacker') || lowerCaseName.includes('forward') || lowerCaseName.includes('striker')) {
      return { positions: ['Forward', 'Striker'], activeOnly: false };
    }
  }
  
  // No specific filtering for other categories
  return null;
};

/**
 * Checks if an athlete's positions match the required positions for a category
 */
export const athleteMatchesCategory = (
  athletePositions: string[] | null,
  mapping: CategoryPositionMapping,
  isActive: boolean
): boolean => {
  // Check active status if required
  if (mapping.activeOnly && !isActive) {
    return false;
  }
  
  // If no positions are specified for the athlete, don't filter them out
  if (!athletePositions || athletePositions.length === 0) {
    return true;
  }
  
  // Check if athlete has at least one matching position
  return athletePositions.some(position => 
    mapping.positions.includes(position)
  );
};

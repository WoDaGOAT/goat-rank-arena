import { FOOTBALL_POSITIONS } from "@/constants/positions";

export interface CategoryPositionMapping {
  positions: string[];
  activeOnly: boolean;
}

export interface CategoryPositionFilter {
  positions: string[];
  activeOnly: boolean;
}

/**
 * Maps category names to their relevant football positions
 */
export const getCategoryPositionMapping = (categoryName: string): CategoryPositionFilter | null => {
  const lowerCategoryName = categoryName.toLowerCase();
  
  console.log('Getting position mapping for category:', categoryName);
  
  // More inclusive mappings - allow broader position criteria
  if (lowerCategoryName.includes('goalkeeper') || lowerCategoryName.includes('gk')) {
    return {
      positions: ['goalkeeper', 'gk'],
      activeOnly: false
    };
  }
  
  if (lowerCategoryName.includes('defender') || lowerCategoryName.includes('defence') || lowerCategoryName.includes('defense')) {
    return {
      positions: ['centre-back', 'center-back', 'left-back', 'right-back', 'defender', 'centre back', 'center back', 'left back', 'right back', 'cb', 'lb', 'rb'],
      activeOnly: false
    };
  }
  
  if (lowerCategoryName.includes('midfielder') || lowerCategoryName.includes('midfield')) {
    return {
      positions: ['central midfielder', 'defensive midfielder', 'attacking midfielder', 'left midfielder', 'right midfielder', 'midfielder', 'central midfield', 'defensive midfield', 'attacking midfield', 'cm', 'cdm', 'cam', 'lm', 'rm'],
      activeOnly: false
    };
  }
  
  if (lowerCategoryName.includes('winger') || lowerCategoryName.includes('wing')) {
    return {
      positions: ['left winger', 'right winger', 'winger', 'left wing', 'right wing', 'lw', 'rw'],
      activeOnly: false
    };
  }
  
  if (lowerCategoryName.includes('forward') || lowerCategoryName.includes('striker') || lowerCategoryName.includes('attack')) {
    return {
      positions: ['striker', 'centre-forward', 'center-forward', 'forward', 'centre forward', 'center forward', 'st', 'cf'],
      activeOnly: false
    };
  }
  
  if (lowerCategoryName.includes('active') || lowerCategoryName.includes('current')) {
    return {
      positions: [], // No position restriction for active players
      activeOnly: true
    };
  }
  
  // For GOAT categories or general skills categories, don't apply any position filtering
  if (lowerCategoryName.includes('goat') || 
      lowerCategoryName.includes('skill') || 
      lowerCategoryName.includes('best') || 
      lowerCategoryName.includes('greatest') ||
      lowerCategoryName.includes('all time') ||
      lowerCategoryName.includes('legend') ||
      lowerCategoryName.includes('icon')) {
    console.log('GOAT/Skills category detected - no position filtering');
    return null; // No filtering for GOAT categories
  }
  
  // Default: no filtering for unrecognized categories
  console.log('No specific filtering rules for category:', categoryName);
  return null;
};

/**
 * Checks if an athlete's positions match the required positions for a category
 */
export const athleteMatchesCategory = (
  athletePositions: string[] | null | undefined,
  positionMapping: CategoryPositionFilter,
  isActive: boolean
): boolean => {
  console.log('Checking athlete match:', { athletePositions, positionMapping, isActive });
  
  // Check active status requirement
  if (positionMapping.activeOnly && !isActive) {
    console.log('Athlete filtered out - not active');
    return false;
  }
  
  // If no position requirements, athlete matches
  if (!positionMapping.positions || positionMapping.positions.length === 0) {
    console.log('No position requirements - athlete matches');
    return true;
  }
  
  // If athlete has no positions but category requires specific positions, don't match
  if (!athletePositions || athletePositions.length === 0) {
    console.log('Athlete has no positions but category requires specific positions');
    return false;
  }
  
  // Check if athlete has any of the required positions (case-insensitive)
  const athletePositionsLower = athletePositions.map(pos => pos.toLowerCase().trim());
  const requiredPositionsLower = positionMapping.positions.map(pos => pos.toLowerCase().trim());
  
  const hasMatchingPosition = athletePositionsLower.some(athletePos =>
    requiredPositionsLower.some(requiredPos => 
      athletePos.includes(requiredPos) || requiredPos.includes(athletePos)
    )
  );
  
  console.log('Position match result:', hasMatchingPosition, { athletePositionsLower, requiredPositionsLower });
  return hasMatchingPosition;
};

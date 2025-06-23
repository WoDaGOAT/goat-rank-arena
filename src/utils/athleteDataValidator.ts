
// Validation utilities for athlete data quality
export const isValidCountryOrNationality = (value: string): boolean => {
  if (!value || typeof value !== 'string') return false;
  
  const cleanValue = value.trim();
  
  // Check length
  if (cleanValue.length < 3 || cleanValue.length > 25) return false;
  
  // Invalid terms that indicate low quality
  const invalidTerms = [
    'professional', 'footballer', 'player', 'soccer', 'football',
    'former', 'active', 'retired', 'current', 'international',
    'club', 'team', 'league', 'sport', 'athlete'
  ];
  
  const lowerValue = cleanValue.toLowerCase();
  return !invalidTerms.some(term => lowerValue.includes(term));
};

export const isValidPosition = (position: string): boolean => {
  if (!position || typeof position !== 'string') return false;
  
  const cleanPosition = position.trim();
  
  // Check length
  if (cleanPosition.length < 3 || cleanPosition.length > 25) return false;
  
  // Invalid single words
  const invalidSingleWords = ['left', 'right', 'centre', 'center', 'back', 'front', 'side', 'top', 'bottom'];
  if (invalidSingleWords.includes(cleanPosition.toLowerCase())) return false;
  
  // Invalid terms that indicate low quality
  const invalidTerms = [
    'professional', 'footballer', 'player', 'soccer', 'football',
    'club', 'team', 'league'
  ];
  
  const lowerPosition = cleanPosition.toLowerCase();
  if (invalidTerms.some(term => lowerPosition.includes(term))) return false;
  
  // Check if it's only numbers
  if (/^\d+$/.test(cleanPosition)) return false;
  
  // Valid position patterns (standardized list)
  const validPositions = [
    'goalkeeper', 'centre-back', 'left-back', 'right-back', 'defender',
    'central midfielder', 'defensive midfielder', 'attacking midfielder',
    'left midfielder', 'right midfielder', 'midfielder',
    'left winger', 'right winger', 'winger',
    'centre-forward', 'striker', 'forward'
  ];
  
  // Allow exact matches or positions that end with valid terms
  const positionLower = cleanPosition.toLowerCase();
  return validPositions.some(valid => 
    positionLower === valid || 
    positionLower.endsWith('back') || 
    positionLower.endsWith('midfielder') || 
    positionLower.endsWith('winger') || 
    positionLower.endsWith('forward') || 
    positionLower.endsWith('striker') ||
    positionLower.endsWith('goalkeeper') ||
    positionLower.endsWith('defender')
  );
};

export const isValidProfilePictureUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  const cleanUrl = url.trim();
  
  // Check basic URL format
  if (cleanUrl.length < 10 || !cleanUrl.startsWith('http')) return false;
  
  // Invalid placeholder values
  const invalidValues = ['placeholder', 'n/a', 'null', 'undefined', ''];
  if (invalidValues.includes(cleanUrl.toLowerCase())) return false;
  
  // Should contain common image hosting domains or file extensions
  const validPatterns = [
    'wikimedia.org', 'wikipedia.org', 'imgur.com', 'getty', 
    '.jpg', '.jpeg', '.png', '.webp'
  ];
  
  return validPatterns.some(pattern => cleanUrl.toLowerCase().includes(pattern));
};

export const standardizePosition = (position: string): string => {
  const positionMap: { [key: string]: string } = {
    'gk': 'Goalkeeper',
    'cb': 'Centre-back',
    'lb': 'Left-back',
    'rb': 'Right-back',
    'cm': 'Central midfielder',
    'cdm': 'Defensive midfielder',
    'cam': 'Attacking midfielder',
    'lm': 'Left midfielder',
    'rm': 'Right midfielder',
    'lw': 'Left winger',
    'rw': 'Right winger',
    'cf': 'Centre-forward',
    'st': 'Striker',
    'center-back': 'Centre-back',
    'center-forward': 'Centre-forward',
    'centerback': 'Centre-back',
    'centreforward': 'Centre-forward',
    'attacking mid': 'Attacking midfielder',
    'defensive mid': 'Defensive midfielder',
    'central mid': 'Central midfielder'
  };
  
  const key = position.toLowerCase().trim();
  return positionMap[key] || position;
};

export const validateAthleteData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validate nationality
  if (data.nationality && !isValidCountryOrNationality(data.nationality)) {
    errors.push('Nationality contains invalid or low-quality data');
  }
  
  // Validate country of origin
  if (data.country_of_origin && !isValidCountryOrNationality(data.country_of_origin)) {
    errors.push('Country of origin contains invalid or low-quality data');
  }
  
  // Validate positions
  if (data.positions && Array.isArray(data.positions)) {
    const invalidPositions = data.positions.filter((pos: string) => !isValidPosition(pos));
    if (invalidPositions.length > 0) {
      errors.push(`Invalid positions: ${invalidPositions.join(', ')}`);
    }
  }
  
  // Validate profile picture URL
  if (data.profile_picture_url && !isValidProfilePictureUrl(data.profile_picture_url)) {
    errors.push('Profile picture URL is invalid or low-quality');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

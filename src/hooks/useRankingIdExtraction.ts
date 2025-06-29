
import { useParams } from "react-router-dom";

export const useRankingIdExtraction = () => {
  const params = useParams<{ id: string }>();
  
  // Enhanced parameter extraction with validation
  console.log('useRankingIdExtraction - Raw params from useParams():', params);
  console.log('useRankingIdExtraction - params.id:', params.id);
  console.log('useRankingIdExtraction - typeof params.id:', typeof params.id);
  
  // Extract and validate the ranking ID
  let rankingId: string | undefined;
  
  if (params.id && typeof params.id === 'string' && params.id.trim() !== '') {
    rankingId = params.id.trim();
  } else if (params.id && typeof params.id === 'object') {
    // Handle the malformed object case
    console.warn('useRankingIdExtraction - Malformed id object:', params.id);
    const idObj = params.id as any;
    if (idObj.value && typeof idObj.value === 'string' && idObj.value !== 'undefined') {
      rankingId = idObj.value.trim();
    }
  }
  
  // Validate that we have a proper UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isValidUUID = rankingId && uuidRegex.test(rankingId);
  
  console.log('useRankingIdExtraction - Final extracted rankingId:', rankingId);
  console.log('useRankingIdExtraction - Is valid UUID:', isValidUUID);
  
  return {
    rankingId,
    isValidUUID,
    originalParams: params
  };
};

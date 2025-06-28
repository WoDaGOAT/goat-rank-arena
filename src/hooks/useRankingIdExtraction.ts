
import { useParams } from "react-router-dom";

export const useRankingIdExtraction = () => {
  const params = useParams<{ rankingId: string }>();
  
  // Enhanced parameter extraction with validation
  console.log('useRankingIdExtraction - Raw params from useParams():', params);
  console.log('useRankingIdExtraction - params.rankingId:', params.rankingId);
  console.log('useRankingIdExtraction - typeof params.rankingId:', typeof params.rankingId);
  
  // Extract and validate the ranking ID
  let rankingId: string | undefined;
  
  if (params.rankingId && typeof params.rankingId === 'string' && params.rankingId.trim() !== '') {
    rankingId = params.rankingId.trim();
  } else if (params.rankingId && typeof params.rankingId === 'object') {
    // Handle the malformed object case
    console.warn('useRankingIdExtraction - Malformed rankingId object:', params.rankingId);
    const rankingIdObj = params.rankingId as any;
    if (rankingIdObj.value && typeof rankingIdObj.value === 'string' && rankingIdObj.value !== 'undefined') {
      rankingId = rankingIdObj.value.trim();
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

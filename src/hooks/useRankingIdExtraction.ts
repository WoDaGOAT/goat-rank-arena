
import { useParams } from "react-router-dom";

export const useRankingIdExtraction = () => {
  const params = useParams<{ id: string }>();
  
  // Enhanced parameter extraction with validation
  console.log('🔍 useRankingIdExtraction - ===================== HOOK START =====================');
  console.log('🔍 useRankingIdExtraction - Raw params from useParams():', params);
  console.log('🔍 useRankingIdExtraction - params.id:', params.id);
  console.log('🔍 useRankingIdExtraction - typeof params.id:', typeof params.id);
  console.log('🔍 useRankingIdExtraction - Current URL:', window.location.href);
  console.log('🔍 useRankingIdExtraction - Current pathname:', window.location.pathname);
  console.log('🔍 useRankingIdExtraction - URL match test:', window.location.pathname.match(/\/ranking\/([^\/]+)/));
  
  // Extract and validate the ranking ID
  let rankingId: string | undefined;
  
  if (params.id && typeof params.id === 'string' && params.id.trim() !== '') {
    rankingId = params.id.trim();
    console.log('🔍 useRankingIdExtraction - Successfully extracted string ID:', rankingId);
  } else if (params.id && typeof params.id === 'object') {
    // Handle the malformed object case
    console.warn('🔍 useRankingIdExtraction - Malformed id object:', params.id);
    const idObj = params.id as any;
    if (idObj.value && typeof idObj.value === 'string' && idObj.value !== 'undefined') {
      rankingId = idObj.value.trim();
      console.log('🔍 useRankingIdExtraction - Extracted from object:', rankingId);
    }
  } else {
    console.error('🔍 useRankingIdExtraction - No valid ID found in params');
    // Try to extract from URL directly as fallback
    const urlMatch = window.location.pathname.match(/\/ranking\/([^\/]+)/);
    if (urlMatch && urlMatch[1]) {
      rankingId = urlMatch[1];
      console.log('🔍 useRankingIdExtraction - FALLBACK: Extracted from URL:', rankingId);
    }
  }
  
  // Validate that we have a proper UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isValidUUID = rankingId && uuidRegex.test(rankingId);
  
  console.log('🔍 useRankingIdExtraction - Final extracted rankingId:', rankingId);
  console.log('🔍 useRankingIdExtraction - Is valid UUID:', isValidUUID);
  console.log('🔍 useRankingIdExtraction - UUID validation result:', {
    rankingId,
    passesRegex: rankingId ? uuidRegex.test(rankingId) : false,
    isValidUUID,
    regexPattern: uuidRegex.toString()
  });
  
  console.log('🔍 useRankingIdExtraction - ===================== HOOK END =====================');
  
  return {
    rankingId,
    isValidUUID,
    originalParams: params
  };
};

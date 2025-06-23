
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface AthleteEnrichmentData {
  country_of_origin?: string;
  nationality?: string;
  date_of_birth?: string;
  positions?: string[];
  profile_picture_url?: string;
}

interface EnrichmentSuggestion {
  field: string;
  current_value: any;
  suggested_value: any;
  confidence: 'high' | 'medium' | 'low';
  source: string;
}

// Comprehensive valid countries/nationalities whitelist
const VALID_COUNTRIES = new Set([
  'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'Chile', 'Colombia',
  'Croatia', 'Czech Republic', 'Denmark', 'Egypt', 'England', 'France', 'Germany', 'Ghana',
  'Greece', 'Hungary', 'Iceland', 'Iran', 'Ireland', 'Italy', 'Japan', 'Mexico', 'Morocco',
  'Netherlands', 'Nigeria', 'Norway', 'Peru', 'Poland', 'Portugal', 'Russia', 'Saudi Arabia',
  'Senegal', 'Serbia', 'South Korea', 'Spain', 'Sweden', 'Switzerland', 'Tunisia', 'Turkey',
  'Ukraine', 'United States', 'Uruguay', 'Wales', 'Scotland', 'American', 'Canadian',
  'Australian', 'South African', 'Egyptian', 'Moroccan', 'Algerian', 'Tunisian', 'Ghanaian',
  'Nigerian', 'Senegalese', 'Cameroonian', 'Ivorian', 'Malian', 'Burkinabe', 'British',
  'English', 'Scottish', 'Welsh', 'Irish', 'Portuguese', 'Spanish', 'French', 'German',
  'Italian', 'Dutch', 'Belgian', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Swiss'
]);

const VALID_POSITIONS = new Set([
  'Goalkeeper', 'Defender', 'Centre-back', 'Left-back', 'Right-back', 'Midfielder',
  'Defensive midfielder', 'Central midfielder', 'Attacking midfielder', 'Left midfielder',
  'Right midfielder', 'Winger', 'Left winger', 'Right winger', 'Forward', 'Striker',
  'Centre-forward', 'Left forward', 'Right forward', 'Second striker', 'False 9',
  'Wing-back', 'Sweeper', 'Libero', 'Box-to-box midfielder', 'Playmaker'
]);

// Enhanced validation functions
function isHighQualityNationality(nationality: string): boolean {
  if (!nationality || nationality.length < 4 || nationality.length > 20) return false;
  
  // Check against comprehensive whitelist
  if (VALID_COUNTRIES.has(nationality)) return true;
  
  // Reject obvious invalid patterns
  const invalidPatterns = [
    /professional/i, /former/i, /current/i, /active/i, /retired/i, /player/i,
    /footballer/i, /soccer/i, /football/i, /sport/i, /athlete/i, /club/i,
    /team/i, /league/i, /position/i, /midfielder/i, /defender/i, /forward/i
  ];
  
  return !invalidPatterns.some(pattern => pattern.test(nationality));
}

function isHighQualityPosition(position: string): boolean {
  if (!position || position.length < 3) return false;
  
  // Check against known positions
  return VALID_POSITIONS.has(position) || 
         [...VALID_POSITIONS].some(validPos => 
           validPos.toLowerCase().includes(position.toLowerCase()) ||
           position.toLowerCase().includes(validPos.toLowerCase())
         );
}

function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  
  // Only accept high-quality sources
  const validSources = [
    'upload.wikimedia.org',
    'commons.wikimedia.org'
  ];
  
  return validSources.some(source => url.includes(source)) &&
         (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png'));
}

function extractNationalityFromText(text: string): string | null {
  const cleanText = text.toLowerCase();
  
  // Enhanced patterns for nationality extraction
  const nationalityPatterns = [
    /(?:is|was)\s+(?:a|an)\s+([a-z]{4,20})\s+(?:footballer|soccer player|player)/,
    /([a-z]{4,20})\s+(?:international|national team|footballer)/,
    /(?:born|from)\s+(?:in\s+)?([a-z\s]{4,25})(?:\s+and|\s+but|\.|,)/,
    /(?:representing|represents)\s+([a-z\s]{4,25})(?:\s+at|\s+in|\.|,)/
  ];

  for (const pattern of nationalityPatterns) {
    const match = cleanText.match(pattern);
    if (match && match[1]) {
      const candidate = capitalizeWords(match[1].trim());
      if (isHighQualityNationality(candidate)) {
        return candidate;
      }
    }
  }

  return null;
}

function extractPositionsFromText(text: string): string[] {
  const cleanText = text.toLowerCase();
  const foundPositions: string[] = [];
  
  const positionPatterns = [
    /(?:plays|playing|positioned)\s+as\s+(?:a|an)\s+([a-z\s-]+?)(?:\s+(?:for|at|in)|\.|\,)/,
    /(?:position|role)(?:s)?\s*:?\s*([a-z\s,-]+?)(?:\s+(?:for|at|in)|\.|\,)/,
    /(goalkeeper|defender|midfielder|forward|striker|winger)(?:s)?/g
  ];

  for (const pattern of positionPatterns) {
    const matches = cleanText.matchAll(new RegExp(pattern.source, 'g'));
    for (const match of matches) {
      if (match[1]) {
        const positions = match[1].split(/[,&]/).map(p => {
          const normalized = normalizePosition(p.trim());
          return normalized ? capitalizeWords(normalized) : null;
        }).filter(Boolean);
        
        foundPositions.push(...positions);
      }
    }
  }

  // Filter and return only high-quality positions
  const uniquePositions = [...new Set(foundPositions)];
  return uniquePositions.filter(pos => isHighQualityPosition(pos)).slice(0, 3);
}

function normalizePosition(position: string): string | null {
  const positionMap: Record<string, string> = {
    'gk': 'Goalkeeper', 'goalkeeper': 'Goalkeeper',
    'cb': 'Centre-back', 'center-back': 'Centre-back', 'centre-back': 'Centre-back',
    'lb': 'Left-back', 'left-back': 'Left-back',
    'rb': 'Right-back', 'right-back': 'Right-back',
    'cdm': 'Defensive midfielder', 'defensive midfielder': 'Defensive midfielder',
    'cm': 'Central midfielder', 'central midfielder': 'Central midfielder',
    'cam': 'Attacking midfielder', 'attacking midfielder': 'Attacking midfielder',
    'lm': 'Left midfielder', 'left midfielder': 'Left midfielder',
    'rm': 'Right midfielder', 'right midfielder': 'Right midfielder',
    'lw': 'Left winger', 'left winger': 'Left winger',
    'rw': 'Right winger', 'right winger': 'Right winger',
    'cf': 'Centre-forward', 'center-forward': 'Centre-forward',
    'st': 'Striker', 'striker': 'Striker'
  };

  const lower = position.toLowerCase().trim();
  return positionMap[lower] || position;
}

function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}

// Enhanced Wikipedia fetching with better data extraction
async function fetchFromWikipedia(athleteName: string): Promise<AthleteEnrichmentData> {
  try {
    console.log(`Fetching high-quality data for athlete: ${athleteName}`);
    
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(athleteName)}`;
    
    const response = await fetch(searchUrl);
    if (!response.ok) {
      console.log(`Wikipedia API error for ${athleteName}: ${response.status}`);
      return {};
    }

    const data = await response.json();
    console.log(`Wikipedia data found for ${athleteName}`);

    const enrichmentData: AthleteEnrichmentData = {};

    if (data.extract) {
      // Extract nationality with strict validation
      const nationality = extractNationalityFromText(data.extract);
      if (nationality && isHighQualityNationality(nationality)) {
        enrichmentData.nationality = nationality;
        enrichmentData.country_of_origin = nationality;
      }

      // Extract positions with strict validation
      const positions = extractPositionsFromText(data.extract);
      if (positions.length > 0) {
        enrichmentData.positions = positions;
      }
    }

    // Only accept high-quality images
    if (data.thumbnail?.source && isValidImageUrl(data.thumbnail.source)) {
      enrichmentData.profile_picture_url = data.thumbnail.source;
    }

    console.log(`High-quality enrichment data for ${athleteName}:`, enrichmentData);
    return enrichmentData;

  } catch (error) {
    console.error(`Error fetching data for ${athleteName}:`, error);
    return {};
  }
}

// Generate enrichment suggestions instead of direct updates
function generateEnrichmentSuggestions(existing: any, enrichment: AthleteEnrichmentData): EnrichmentSuggestion[] {
  const suggestions: EnrichmentSuggestion[] = [];

  // Country suggestion
  if (!existing.country_of_origin && enrichment.country_of_origin && isHighQualityNationality(enrichment.country_of_origin)) {
    suggestions.push({
      field: 'country_of_origin',
      current_value: null,
      suggested_value: enrichment.country_of_origin,
      confidence: 'high',
      source: 'Wikipedia'
    });
  }
  
  // Nationality suggestion
  if (!existing.nationality && enrichment.nationality && isHighQualityNationality(enrichment.nationality)) {
    suggestions.push({
      field: 'nationality',
      current_value: null,
      suggested_value: enrichment.nationality,
      confidence: 'high',
      source: 'Wikipedia'
    });
  }
  
  // Positions suggestion
  if ((!existing.positions || existing.positions.length === 0) && enrichment.positions && enrichment.positions.length > 0) {
    const validPositions = enrichment.positions.filter(pos => isHighQualityPosition(pos));
    if (validPositions.length > 0) {
      suggestions.push({
        field: 'positions',
        current_value: existing.positions || [],
        suggested_value: validPositions,
        confidence: 'high',
        source: 'Wikipedia'
      });
    }
  }
  
  // Profile picture suggestion
  if (!existing.profile_picture_url && enrichment.profile_picture_url && isValidImageUrl(enrichment.profile_picture_url)) {
    suggestions.push({
      field: 'profile_picture_url',
      current_value: null,
      suggested_value: enrichment.profile_picture_url,
      confidence: 'high',
      source: 'Wikipedia'
    });
  }

  return suggestions;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { athlete_ids, single_athlete_id, apply_suggestions } = await req.json();

    // Check if user is admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    // Check if user has admin role
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const isAdmin = userRoles?.some(role => role.role === 'admin');
    if (!isAdmin) {
      return new Response('Forbidden: Admin access required', { status: 403, headers: corsHeaders });
    }

    // If applying suggestions, handle the update
    if (apply_suggestions) {
      const { athlete_id, suggestions } = apply_suggestions;
      
      const updateData: any = {};
      suggestions.forEach((suggestion: any) => {
        updateData[suggestion.field] = suggestion.suggested_value;
      });
      
      updateData.updated_at = new Date().toISOString();

      const { error: updateError } = await supabase
        .from('athletes')
        .update(updateData)
        .eq('id', athlete_id);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: 'Failed to apply suggestions', details: updateError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(JSON.stringify({ success: true, updated: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let athletesToProcess: string[] = [];

    if (single_athlete_id) {
      athletesToProcess = [single_athlete_id];
    } else if (athlete_ids && Array.isArray(athlete_ids)) {
      athletesToProcess = athlete_ids;
    } else {
      // Get athletes with missing information
      const { data: athletes, error } = await supabase
        .from('athletes')
        .select('id, name')
        .or('country_of_origin.is.null,nationality.is.null,positions.is.null,profile_picture_url.is.null')
        .limit(20);

      if (error) {
        console.error('Error fetching athletes:', error);
        return new Response('Error fetching athletes', { status: 500, headers: corsHeaders });
      }

      athletesToProcess = athletes?.map(a => a.id) || [];
    }

    console.log(`Processing ${athletesToProcess.length} athletes for enrichment suggestions`);

    const results = {
      processed: 0,
      suggestions_found: 0,
      errors: [] as string[],
      athlete_suggestions: [] as any[]
    };

    // Process each athlete to generate suggestions
    for (const athleteId of athletesToProcess) {
      try {
        results.processed++;

        // Get current athlete data
        const { data: athlete, error: fetchError } = await supabase
          .from('athletes')
          .select('*')
          .eq('id', athleteId)
          .single();

        if (fetchError || !athlete) {
          results.errors.push(`Failed to fetch athlete ${athleteId}`);
          continue;
        }

        console.log(`Processing athlete: ${athlete.name}`);

        // Fetch enrichment data
        const enrichmentData = await fetchFromWikipedia(athlete.name);

        // Generate suggestions
        const suggestions = generateEnrichmentSuggestions(athlete, enrichmentData);

        if (suggestions.length > 0) {
          results.suggestions_found++;
          results.athlete_suggestions.push({
            athlete_id: athlete.id,
            athlete_name: athlete.name,
            suggestions
          });
          console.log(`Found ${suggestions.length} high-quality suggestions for ${athlete.name}`);
        } else {
          console.log(`No high-quality suggestions found for ${athlete.name}`);
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error processing athlete ${athleteId}:`, error);
        results.errors.push(`Error processing athlete ${athleteId}: ${error.message}`);
      }
    }

    console.log('Enrichment suggestions results:', results);

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

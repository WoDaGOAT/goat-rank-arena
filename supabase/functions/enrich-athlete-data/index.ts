
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

interface WikidataResponse {
  entities?: Record<string, {
    claims?: Record<string, Array<{
      mainsnak?: {
        datavalue?: {
          value?: any;
        };
      };
    }>>;
    labels?: Record<string, { value: string }>;
  }>;
}

// Valid countries/nationalities whitelist (partial list for validation)
const VALID_COUNTRIES = new Set([
  'Algeria', 'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Cameroon', 'Canada', 'Chile', 'Colombia',
  'Croatia', 'Czech Republic', 'Denmark', 'Egypt', 'England', 'France', 'Germany', 'Ghana', 'Greece', 'Hungary',
  'Iceland', 'Iran', 'Ireland', 'Italy', 'Japan', 'Mexico', 'Morocco', 'Netherlands', 'Nigeria', 'Norway',
  'Peru', 'Poland', 'Portugal', 'Russia', 'Saudi Arabia', 'Senegal', 'Serbia', 'South Korea', 'Spain', 'Sweden',
  'Switzerland', 'Tunisia', 'Turkey', 'Ukraine', 'United States', 'Uruguay', 'Wales', 'Scottish', 'Irish',
  'Welsh', 'English', 'British', 'American', 'Canadian', 'Australian', 'South African', 'Egyptian', 'Moroccan',
  'Algerian', 'Tunisian', 'Ghanaian', 'Nigerian', 'Senegalese', 'Cameroonian', 'Ivorian', 'Malian', 'Burkinabe'
]);

const VALID_POSITIONS = new Set([
  'Goalkeeper', 'Defender', 'Centre-back', 'Left-back', 'Right-back', 'Midfielder', 'Defensive midfielder',
  'Central midfielder', 'Attacking midfielder', 'Left midfielder', 'Right midfielder', 'Winger', 'Left winger',
  'Right winger', 'Forward', 'Striker', 'Centre-forward', 'Left forward', 'Right forward', 'Attacking midfielder'
]);

// Improved text parsing with better validation
function extractNationalityFromText(text: string): string | null {
  const cleanText = text.toLowerCase();
  
  // More sophisticated patterns for nationality extraction
  const nationalityPatterns = [
    /(?:is|was)\s+(?:a|an)\s+([a-z]{4,20})\s+(?:footballer|soccer player|player|athlete)/,
    /([a-z]{4,20})\s+(?:footballer|soccer player|player|athlete)/,
    /(?:born|from)\s+(?:in\s+)?([a-z\s]{4,25})(?:\s+and|\s+but|\s+on|\.|,)/,
    /(?:representing|represents)\s+([a-z\s]{4,25})(?:\s+at|\s+in|\.|,)/
  ];

  for (const pattern of nationalityPatterns) {
    const match = cleanText.match(pattern);
    if (match && match[1]) {
      const candidate = capitalizeWords(match[1].trim());
      
      // Validate the extracted nationality
      if (isValidNationality(candidate)) {
        return candidate;
      }
    }
  }

  return null;
}

function extractPositionsFromText(text: string): string[] {
  const cleanText = text.toLowerCase();
  const foundPositions: string[] = [];
  
  // More comprehensive position patterns
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

  // Remove duplicates and validate
  const uniquePositions = [...new Set(foundPositions)];
  return uniquePositions.filter(pos => isValidPosition(pos)).slice(0, 3); // Limit to 3 positions
}

function isValidNationality(nationality: string): boolean {
  if (!nationality || nationality.length < 4 || nationality.length > 25) return false;
  
  // Check against whitelist
  if (VALID_COUNTRIES.has(nationality)) return true;
  
  // Additional validation - reject obvious non-nationalities
  const invalidWords = ['professional', 'former', 'current', 'active', 'retired', 'young', 'old', 'best', 'greatest'];
  const lowerNationality = nationality.toLowerCase();
  
  return !invalidWords.some(word => lowerNationality.includes(word));
}

function isValidPosition(position: string): boolean {
  if (!position || position.length < 3) return false;
  
  // Check against known positions
  return VALID_POSITIONS.has(position) || 
         [...VALID_POSITIONS].some(validPos => 
           validPos.toLowerCase().includes(position.toLowerCase()) ||
           position.toLowerCase().includes(validPos.toLowerCase())
         );
}

function normalizePosition(position: string): string | null {
  const positionMap: Record<string, string> = {
    'gk': 'Goalkeeper',
    'cb': 'Centre-back',
    'lb': 'Left-back',
    'rb': 'Right-back',
    'cdm': 'Defensive midfielder',
    'cm': 'Central midfielder',
    'cam': 'Attacking midfielder',
    'lm': 'Left midfielder',
    'rm': 'Right midfielder',
    'lw': 'Left winger',
    'rw': 'Right winger',
    'cf': 'Centre-forward',
    'st': 'Striker'
  };

  const lower = position.toLowerCase().trim();
  return positionMap[lower] || position;
}

// Fetch from Wikipedia with improved data extraction
async function fetchFromWikipedia(athleteName: string): Promise<AthleteEnrichmentData> {
  try {
    console.log(`Fetching data for athlete: ${athleteName}`);
    
    // Try multiple Wikipedia endpoints for better data
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(athleteName)}`;
    
    const response = await fetch(searchUrl);
    if (!response.ok) {
      console.log(`Wikipedia API error for ${athleteName}: ${response.status}`);
      return {};
    }

    const data = await response.json();
    console.log(`Wikipedia data found for ${athleteName}`);

    const enrichmentData: AthleteEnrichmentData = {};

    // Extract nationality with improved validation
    if (data.extract) {
      const nationality = extractNationalityFromText(data.extract);
      if (nationality) {
        enrichmentData.nationality = nationality;
        enrichmentData.country_of_origin = nationality;
      }

      // Extract positions with better validation
      const positions = extractPositionsFromText(data.extract);
      if (positions.length > 0) {
        enrichmentData.positions = positions;
      }
    }

    // Extract thumbnail image if available and valid
    if (data.thumbnail?.source && data.thumbnail.source.includes('upload.wikimedia.org')) {
      enrichmentData.profile_picture_url = data.thumbnail.source;
    }

    console.log(`Enrichment data for ${athleteName}:`, enrichmentData);
    return enrichmentData;

  } catch (error) {
    console.error(`Error fetching data for ${athleteName}:`, error);
    return {};
  }
}

function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}

// Enhanced merge function with better validation
function mergeAthleteData(existing: any, enrichment: AthleteEnrichmentData) {
  const merged = { ...existing };

  // Only update fields that are currently null/empty AND the new data is valid
  if (!existing.country_of_origin && enrichment.country_of_origin && isValidNationality(enrichment.country_of_origin)) {
    merged.country_of_origin = enrichment.country_of_origin;
  }
  
  if (!existing.nationality && enrichment.nationality && isValidNationality(enrichment.nationality)) {
    merged.nationality = enrichment.nationality;
  }
  
  if (!existing.date_of_birth && enrichment.date_of_birth) {
    merged.date_of_birth = enrichment.date_of_birth;
  }
  
  if ((!existing.positions || existing.positions.length === 0) && enrichment.positions && enrichment.positions.length > 0) {
    // Validate all positions before adding
    const validPositions = enrichment.positions.filter(pos => isValidPosition(pos));
    if (validPositions.length > 0) {
      merged.positions = validPositions;
    }
  }
  
  if (!existing.profile_picture_url && enrichment.profile_picture_url) {
    merged.profile_picture_url = enrichment.profile_picture_url;
  }

  return merged;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { athlete_ids, single_athlete_id } = await req.json();

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
        .or('country_of_origin.is.null,nationality.is.null,date_of_birth.is.null,positions.is.null,profile_picture_url.is.null')
        .limit(20); // Process in batches

      if (error) {
        console.error('Error fetching athletes:', error);
        return new Response('Error fetching athletes', { status: 500, headers: corsHeaders });
      }

      athletesToProcess = athletes?.map(a => a.id) || [];
    }

    console.log(`Processing ${athletesToProcess.length} athletes for data enrichment`);

    const results = {
      processed: 0,
      updated: 0,
      errors: [] as string[],
      details: [] as any[]
    };

    // Process each athlete
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

        // Check if we have any valid new data to add
        const hasNewData = Object.keys(enrichmentData).some(key => {
          const currentValue = athlete[key];
          const newValue = enrichmentData[key as keyof AthleteEnrichmentData];
          
          if (!newValue) return false;
          if (currentValue && (!Array.isArray(currentValue) || currentValue.length > 0)) return false;
          
          // Additional validation for specific fields
          if ((key === 'nationality' || key === 'country_of_origin') && typeof newValue === 'string') {
            return isValidNationality(newValue);
          }
          if (key === 'positions' && Array.isArray(newValue)) {
            return newValue.some(pos => isValidPosition(pos));
          }
          
          return true;
        });

        if (!hasNewData) {
          console.log(`No valid new data found for ${athlete.name}`);
          results.details.push({
            athlete_name: athlete.name,
            status: 'no_new_data',
            data_found: enrichmentData
          });
          continue;
        }

        // Merge and update athlete data
        const mergedData = mergeAthleteData(athlete, enrichmentData);

        const { error: updateError } = await supabase
          .from('athletes')
          .update({
            country_of_origin: mergedData.country_of_origin,
            nationality: mergedData.nationality,
            date_of_birth: mergedData.date_of_birth,
            positions: mergedData.positions,
            profile_picture_url: mergedData.profile_picture_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', athleteId);

        if (updateError) {
          console.error(`Error updating athlete ${athlete.name}:`, updateError);
          results.errors.push(`Failed to update ${athlete.name}: ${updateError.message}`);
        } else {
          results.updated++;
          console.log(`Successfully updated ${athlete.name}`);
          results.details.push({
            athlete_name: athlete.name,
            status: 'updated',
            data_added: enrichmentData
          });
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error processing athlete ${athleteId}:`, error);
        results.errors.push(`Error processing athlete ${athleteId}: ${error.message}`);
      }
    }

    console.log('Enrichment results:', results);

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

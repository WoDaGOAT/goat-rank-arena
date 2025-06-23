
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

interface WikipediaSearchResult {
  query?: {
    pages?: Record<string, {
      title: string;
      extract?: string;
      thumbnail?: {
        source: string;
      };
    }>;
  };
}

// Fetch athlete data from Wikipedia API
async function fetchFromWikipedia(athleteName: string): Promise<AthleteEnrichmentData> {
  try {
    console.log(`Fetching data for athlete: ${athleteName}`);
    
    // Search for the athlete on Wikipedia
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(athleteName)}`;
    
    const response = await fetch(searchUrl);
    if (!response.ok) {
      console.log(`Wikipedia API error for ${athleteName}: ${response.status}`);
      return {};
    }

    const data = await response.json();
    console.log(`Wikipedia data found for ${athleteName}`);

    const enrichmentData: AthleteEnrichmentData = {};

    // Extract basic info from the summary
    if (data.extract) {
      const extract = data.extract.toLowerCase();
      
      // Try to extract nationality/country from common patterns
      const nationalityPatterns = [
        /is an? ([a-z\s]+) (footballer|basketball player|tennis player|athlete)/,
        /([a-z\s]+) (footballer|basketball player|tennis player|athlete)/,
        /born.*in ([a-z\s]+)/
      ];

      for (const pattern of nationalityPatterns) {
        const match = extract.match(pattern);
        if (match && match[1]) {
          const country = match[1].trim();
          if (country.length > 2 && country.length < 30) {
            enrichmentData.nationality = capitalizeWords(country);
            enrichmentData.country_of_origin = capitalizeWords(country);
            break;
          }
        }
      }

      // Try to extract position information
      const positionPatterns = [
        /plays? as an? ([a-z\s]+)/,
        /position[s]?[:\s]+([a-z\s,]+)/,
        /(goalkeeper|defender|midfielder|forward|striker|winger)/
      ];

      for (const pattern of positionPatterns) {
        const match = extract.match(pattern);
        if (match && match[1]) {
          const positions = match[1].split(',').map(p => capitalizeWords(p.trim()));
          enrichmentData.positions = positions.filter(p => p.length > 2);
          break;
        }
      }
    }

    // Extract thumbnail image if available
    if (data.thumbnail?.source) {
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

// Validate and merge enrichment data with existing athlete data
function mergeAthleteData(existing: any, enrichment: AthleteEnrichmentData) {
  const merged = { ...existing };

  // Only update fields that are currently null or empty
  if (!existing.country_of_origin && enrichment.country_of_origin) {
    merged.country_of_origin = enrichment.country_of_origin;
  }
  
  if (!existing.nationality && enrichment.nationality) {
    merged.nationality = enrichment.nationality;
  }
  
  if (!existing.date_of_birth && enrichment.date_of_birth) {
    merged.date_of_birth = enrichment.date_of_birth;
  }
  
  if ((!existing.positions || existing.positions.length === 0) && enrichment.positions) {
    merged.positions = enrichment.positions;
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

        // Check if we have any new data to add
        const hasNewData = Object.keys(enrichmentData).some(key => {
          const currentValue = athlete[key];
          const newValue = enrichmentData[key as keyof AthleteEnrichmentData];
          return newValue && (!currentValue || (Array.isArray(currentValue) && currentValue.length === 0));
        });

        if (!hasNewData) {
          console.log(`No new data found for ${athlete.name}`);
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

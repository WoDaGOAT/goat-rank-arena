
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Validation functions for data quality
const isValidCountryOrNationality = (value: string): boolean => {
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

const isValidPosition = (position: string): boolean => {
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

const isValidProfilePictureUrl = (url: string): boolean => {
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

const standardizePosition = (position: string): string => {
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const authorization = req.headers.get('Authorization')
    if (!authorization) {
      throw new Error('No authorization header')
    }

    const token = authorization.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Invalid token')
    }

    const { data: userRoles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)

    const isAdmin = userRoles?.some(role => role.role === 'admin')
    if (!isAdmin) {
      throw new Error('Admin access required')
    }

    const body = await req.json()
    const { single_athlete_id, athlete_ids, apply_suggestions } = body

    // Handle applying suggestions
    if (apply_suggestions) {
      const { athlete_id, suggestions } = apply_suggestions;
      
      let updateData: any = {};
      
      for (const suggestion of suggestions) {
        if (suggestion.field === 'country_of_origin' && isValidCountryOrNationality(suggestion.suggested_value)) {
          updateData.country_of_origin = suggestion.suggested_value;
        } else if (suggestion.field === 'nationality' && isValidCountryOrNationality(suggestion.suggested_value)) {
          updateData.nationality = suggestion.suggested_value;
        } else if (suggestion.field === 'positions' && Array.isArray(suggestion.suggested_value)) {
          const validPositions = suggestion.suggested_value
            .filter(pos => isValidPosition(pos))
            .map(pos => standardizePosition(pos));
          if (validPositions.length > 0) {
            updateData.positions = validPositions;
          }
        } else if (suggestion.field === 'profile_picture_url' && isValidProfilePictureUrl(suggestion.suggested_value)) {
          updateData.profile_picture_url = suggestion.suggested_value;
        }
      }
      
      if (Object.keys(updateData).length > 0) {
        updateData.updated_at = new Date().toISOString();
        
        const { error: updateError } = await supabaseClient
          .from('athletes')
          .update(updateData)
          .eq('id', athlete_id);
          
        if (updateError) {
          throw updateError;
        }
      }
      
      return new Response(
        JSON.stringify({ success: true, applied_fields: Object.keys(updateData) }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle enrichment scanning
    let query = supabaseClient
      .from('athletes')
      .select('id, name, country_of_origin, nationality, positions, profile_picture_url');

    if (single_athlete_id) {
      query = query.eq('id', single_athlete_id);
    } else if (athlete_ids && Array.isArray(athlete_ids)) {
      query = query.in('id', athlete_ids);
    } else {
      // Find athletes with missing high-quality data
      query = query.or('country_of_origin.is.null,nationality.is.null,positions.is.null,profile_picture_url.is.null');
    }

    const { data: athletes, error } = await query.limit(20);

    if (error) {
      throw error;
    }

    const results = {
      processed: 0,
      suggestions_found: 0,
      errors: [] as string[],
      athlete_suggestions: [] as any[]
    };

    for (const athlete of athletes || []) {
      results.processed++;
      console.log(`Processing athlete: ${athlete.name}`);
      
      try {
        console.log(`Fetching high-quality data for athlete: ${athlete.name}`);
        
        // Fetch from Wikipedia API
        const wikiResponse = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(athlete.name)}`
        );
        
        if (!wikiResponse.ok) {
          console.log(`Wikipedia API error for ${athlete.name}: ${wikiResponse.status}`);
          continue;
        }
        
        const wikiData = await wikiResponse.json();
        console.log(`Wikipedia data found for ${athlete.name}`);
        
        // Extract high-quality information with strict validation
        const enrichmentData: any = {};
        
        // Extract nationality/country from description with validation
        if (wikiData.extract) {
          const extract = wikiData.extract.toLowerCase();
          
          // Look for nationality patterns in the description
          const nationalityPatterns = [
            /is (?:a|an) ([a-z\s]+) (?:footballer|soccer player|football player)/,
            /([a-z\s]+) (?:footballer|soccer player|football player)/,
            /^([a-z\s]+) \(/,
          ];
          
          for (const pattern of nationalityPatterns) {
            const match = extract.match(pattern);
            if (match && match[1]) {
              const nationality = match[1].trim();
              if (isValidCountryOrNationality(nationality)) {
                enrichmentData.nationality = nationality.charAt(0).toUpperCase() + nationality.slice(1);
                enrichmentData.country_of_origin = enrichmentData.nationality;
                break;
              }
            }
          }
          
          // Extract positions with validation
          const positionPatterns = [
            /plays? as (?:a|an) ([^.]+)/,
            /position(?:s)? (?:is|are) ([^.]+)/,
            /(?:a|an) ([^.]*(?:back|midfielder|forward|striker|goalkeeper|winger|defender)[^.]*)/,
          ];
          
          for (const pattern of positionPatterns) {
            const match = extract.match(pattern);
            if (match && match[1]) {
              const positionText = match[1].trim();
              const positions = positionText.split(/,|\sand\s/).map(p => p.trim());
              const validPositions = positions
                .filter(pos => isValidPosition(pos))
                .map(pos => standardizePosition(pos));
              
              if (validPositions.length > 0) {
                enrichmentData.positions = [...new Set(validPositions)]; // Remove duplicates
                break;
              }
            }
          }
        }
        
        // Get profile picture with validation
        if (wikiData.thumbnail?.source && isValidProfilePictureUrl(wikiData.thumbnail.source)) {
          enrichmentData.profile_picture_url = wikiData.thumbnail.source;
        }
        
        console.log(`High-quality enrichment data for ${athlete.name}:`, enrichmentData);
        
        // Only create suggestions for high-quality data that passes validation
        const suggestions = [];
        
        if (!athlete.country_of_origin && enrichmentData.country_of_origin) {
          suggestions.push({
            field: 'country_of_origin',
            current_value: athlete.country_of_origin,
            suggested_value: enrichmentData.country_of_origin,
            confidence: 'high',
            source: 'Wikipedia'
          });
        }
        
        if (!athlete.nationality && enrichmentData.nationality) {
          suggestions.push({
            field: 'nationality',
            current_value: athlete.nationality,
            suggested_value: enrichmentData.nationality,
            confidence: 'high',
            source: 'Wikipedia'
          });
        }
        
        if ((!athlete.positions || athlete.positions.length === 0) && enrichmentData.positions) {
          suggestions.push({
            field: 'positions',
            current_value: athlete.positions || [],
            suggested_value: enrichmentData.positions,
            confidence: 'high',
            source: 'Wikipedia'
          });
        }
        
        if (!athlete.profile_picture_url && enrichmentData.profile_picture_url) {
          suggestions.push({
            field: 'profile_picture_url',
            current_value: athlete.profile_picture_url,
            suggested_value: enrichmentData.profile_picture_url,
            confidence: 'high',
            source: 'Wikipedia'
          });
        }
        
        if (suggestions.length > 0) {
          console.log(`Found ${suggestions.length} high-quality suggestions for ${athlete.name}`);
          results.athlete_suggestions.push({
            athlete_id: athlete.id,
            athlete_name: athlete.name,
            suggestions: suggestions
          });
          results.suggestions_found++;
        } else {
          console.log(`No high-quality suggestions found for ${athlete.name}`);
        }
        
      } catch (error) {
        console.error(`Error processing athlete ${athlete.name}:`, error);
        results.errors.push(`Error processing ${athlete.name}: ${error.message}`);
      }
    }

    console.log('Enrichment suggestions results:', results);

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Enrichment error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

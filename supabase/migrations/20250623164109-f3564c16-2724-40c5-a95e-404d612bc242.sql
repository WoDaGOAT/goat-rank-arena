
-- Data Quality Cleanup for Athletes Table
-- This script removes and standardizes low-quality data

-- Step 1: Remove obviously invalid nationalities and countries
UPDATE athletes 
SET nationality = NULL 
WHERE nationality IN (
  'Professional', 'Former Professional', 'Football', 'Soccer', 'Footballer', 
  'Player', 'Professional Footballer', 'Former Player', 'Active', 'Retired',
  'Current', 'International', 'Club', 'Team', 'League', 'Sport', 'Athlete'
) OR nationality ILIKE '%professional%' 
  OR nationality ILIKE '%footballer%' 
  OR nationality ILIKE '%player%'
  OR nationality ILIKE '%soccer%'
  OR nationality ILIKE '%football%'
  OR LENGTH(nationality) < 3
  OR LENGTH(nationality) > 25;

UPDATE athletes 
SET country_of_origin = NULL 
WHERE country_of_origin IN (
  'Professional', 'Former Professional', 'Football', 'Soccer', 'Footballer', 
  'Player', 'Professional Footballer', 'Former Player', 'Active', 'Retired',
  'Current', 'International', 'Club', 'Team', 'League', 'Sport', 'Athlete'
) OR country_of_origin ILIKE '%professional%' 
  OR country_of_origin ILIKE '%footballer%' 
  OR country_of_origin ILIKE '%player%'
  OR country_of_origin ILIKE '%soccer%'
  OR country_of_origin ILIKE '%football%'
  OR LENGTH(country_of_origin) < 3
  OR LENGTH(country_of_origin) > 25;

-- Step 2: Clean up positions array - remove invalid positions
UPDATE athletes 
SET positions = (
  SELECT array_agg(pos)
  FROM unnest(positions) AS pos
  WHERE pos IS NOT NULL 
    AND LENGTH(pos) >= 3 
    AND LENGTH(pos) <= 25
    AND pos NOT ILIKE '%professional%'
    AND pos NOT ILIKE '%footballer%'
    AND pos NOT ILIKE '%player%'
    AND pos NOT ILIKE '%soccer%'
    AND pos NOT ILIKE '%football%'
    AND pos NOT ILIKE '%club%'
    AND pos NOT ILIKE '%team%'
    AND pos NOT ILIKE '%league%'
    AND pos NOT IN ('Left', 'Right', 'Centre', 'Center', 'Back', 'Front', 'Side', 'Top', 'Bottom')
    AND pos !~ '^\d+$' -- Remove numeric-only strings
    AND pos !~ '^[A-Z]{2,4}$' -- Remove abbreviations like 'CB', 'LB', etc. (we'll standardize these separately)
)
WHERE positions IS NOT NULL;

-- Step 3: Set positions to NULL if array becomes empty after cleanup
UPDATE athletes 
SET positions = NULL 
WHERE positions IS NOT NULL AND array_length(positions, 1) IS NULL;

-- Step 4: Standardize common position abbreviations and variations
UPDATE athletes 
SET positions = array_replace(positions, 'GK', 'Goalkeeper')
WHERE 'GK' = ANY(positions);

UPDATE athletes 
SET positions = array_replace(positions, 'CB', 'Centre-back')
WHERE 'CB' = ANY(positions);

UPDATE athletes 
SET positions = array_replace(positions, 'LB', 'Left-back')
WHERE 'LB' = ANY(positions);

UPDATE athletes 
SET positions = array_replace(positions, 'RB', 'Right-back')
WHERE 'RB' = ANY(positions);

UPDATE athletes 
SET positions = array_replace(positions, 'CM', 'Central midfielder')
WHERE 'CM' = ANY(positions);

UPDATE athletes 
SET positions = array_replace(positions, 'CDM', 'Defensive midfielder')
WHERE 'CDM' = ANY(positions);

UPDATE athletes 
SET positions = array_replace(positions, 'CAM', 'Attacking midfielder')
WHERE 'CAM' = ANY(positions);

UPDATE athletes 
SET positions = array_replace(positions, 'LM', 'Left midfielder')
WHERE 'LM' = ANY(positions);

UPDATE athletes 
SET positions = array_replace(positions, 'RM', 'Right midfielder')
WHERE 'RM' = ANY(positions);

UPDATE athletes 
SET positions = array_replace(positions, 'LW', 'Left winger')
WHERE 'LW' = ANY(positions);

UPDATE athletes 
SET positions = array_replace(positions, 'RW', 'Right winger')
WHERE 'RW' = ANY(positions);

UPDATE athletes 
SET positions = array_replace(positions, 'CF', 'Centre-forward')
WHERE 'CF' = ANY(positions);

UPDATE athletes 
SET positions = array_replace(positions, 'ST', 'Striker')
WHERE 'ST' = ANY(positions);

-- Step 5: Standardize common position variations
UPDATE athletes 
SET positions = array_replace(positions, 'Center-back', 'Centre-back')
WHERE 'Center-back' = ANY(positions);

UPDATE athletes 
SET positions = array_replace(positions, 'Center-forward', 'Centre-forward')
WHERE 'Center-forward' = ANY(positions);

UPDATE athletes 
SET positions = array_replace(positions, 'Centerback', 'Centre-back')
WHERE 'Centerback' = ANY(positions);

UPDATE athletes 
SET positions = array_replace(positions, 'Centreforward', 'Centre-forward')
WHERE 'Centreforward' = ANY(positions);

UPDATE athletes 
SET positions = array_replace(positions, 'Attacking Mid', 'Attacking midfielder')
WHERE 'Attacking Mid' = ANY(positions);

UPDATE athletes 
SET positions = array_replace(positions, 'Defensive Mid', 'Defensive midfielder')
WHERE 'Defensive Mid' = ANY(positions);

UPDATE athletes 
SET positions = array_replace(positions, 'Central Mid', 'Central midfielder')
WHERE 'Central Mid' = ANY(positions);

-- Step 6: Remove duplicate positions within the same athlete
UPDATE athletes 
SET positions = (
  SELECT array_agg(DISTINCT pos ORDER BY pos)
  FROM unnest(positions) AS pos
)
WHERE positions IS NOT NULL AND array_length(positions, 1) > 1;

-- Step 7: Clean up profile picture URLs - remove invalid or placeholder URLs
UPDATE athletes 
SET profile_picture_url = NULL 
WHERE profile_picture_url IS NOT NULL 
  AND (
    profile_picture_url = '' 
    OR profile_picture_url = 'placeholder'
    OR profile_picture_url = 'N/A'
    OR profile_picture_url = 'null'
    OR profile_picture_url = 'undefined'
    OR LENGTH(profile_picture_url) < 10
    OR profile_picture_url NOT LIKE 'http%'
  );

-- Step 8: Update the updated_at timestamp for all modified records
UPDATE athletes 
SET updated_at = now() 
WHERE updated_at < now() - INTERVAL '1 minute';

-- Step 9: Show cleanup summary
SELECT 
  'Cleanup Summary' as action,
  COUNT(*) as total_athletes,
  COUNT(*) FILTER (WHERE nationality IS NULL) as athletes_without_nationality,
  COUNT(*) FILTER (WHERE country_of_origin IS NULL) as athletes_without_country,
  COUNT(*) FILTER (WHERE positions IS NULL OR array_length(positions, 1) IS NULL) as athletes_without_positions,
  COUNT(*) FILTER (WHERE profile_picture_url IS NULL) as athletes_without_photos
FROM athletes;

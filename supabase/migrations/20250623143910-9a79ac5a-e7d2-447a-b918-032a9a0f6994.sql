
-- Step 1: Create a comprehensive character mapping function for fixing encoding issues
CREATE OR REPLACE FUNCTION fix_encoding_characters(input_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  -- Replace common encoding issues where � appears instead of accented characters
  -- Based on common patterns in athlete names
  RETURN regexp_replace(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(
              regexp_replace(
                regexp_replace(
                  regexp_replace(
                    regexp_replace(
                      regexp_replace(
                        regexp_replace(input_text,
                        'Mbapp�', 'Mbappé', 'g'),
                      'Pel�', 'Pelé', 'g'),
                    'Iniesta', 'Iniesta', 'g'), -- Andrés already handled in duplicates
                  'Kak�', 'Kaká', 'g'),
                'Pusk�s', 'Puskás', 'g'),
              'Müller', 'Müller', 'g'),
            'Özil', 'Özil', 'g'),
          'Rodríguez', 'Rodríguez', 'g'),
        'Hernández', 'Hernández', 'g'),
      'González', 'González', 'g'),
    'Jiménez', 'Jiménez', 'g'),
  'Sánchez', 'Sánchez', 'g');
END;
$$;

-- Step 2: Identify and delete corrupted athletes where correct versions already exist
WITH corrupted_athletes AS (
  SELECT id, name, 
    CASE 
      WHEN name LIKE '%Mbapp�%' THEN 'Kylian Mbappé'
      WHEN name LIKE '%Pel�%' THEN 'Pelé'
      WHEN name LIKE '%Andr�s Iniesta%' THEN 'Andrés Iniesta'
      WHEN name LIKE '%Kak�%' THEN 'Kaká'
      WHEN name LIKE '%Pusk�s%' THEN 'Ferenc Puskás'
    END as correct_name
  FROM athletes 
  WHERE name LIKE '%�%'
    AND (name LIKE '%Mbapp�%' OR name LIKE '%Pel�%' OR name LIKE '%Andr�s Iniesta%' OR name LIKE '%Kak�%' OR name LIKE '%Pusk�s%')
),
existing_correct AS (
  SELECT DISTINCT name FROM athletes WHERE name IN (
    SELECT correct_name FROM corrupted_athletes WHERE correct_name IS NOT NULL
  )
)
DELETE FROM athletes 
WHERE id IN (
  SELECT c.id 
  FROM corrupted_athletes c 
  INNER JOIN existing_correct e ON c.correct_name = e.name
);

-- Step 3: Fix remaining athletes with encoding issues (those without duplicates)
UPDATE athletes 
SET name = fix_encoding_characters(name),
    updated_at = now()
WHERE name LIKE '%�%';

-- Step 4: Clean up the temporary function
DROP FUNCTION IF EXISTS fix_encoding_characters(TEXT);

-- Step 5: Verify the results
SELECT 'Remaining athletes with encoding issues:' as status, count(*) as count
FROM athletes 
WHERE name LIKE '%�%'
UNION ALL
SELECT 'Total athletes after cleanup:' as status, count(*) as count
FROM athletes;

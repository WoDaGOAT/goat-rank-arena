
-- Delete all remaining athletes with encoding issues
-- This will remove all athletes whose names contain the "�" character
DELETE FROM athletes 
WHERE name LIKE '%�%';

-- Verify the cleanup was successful
SELECT 'Athletes with encoding issues after cleanup:' as status, count(*) as count
FROM athletes 
WHERE name LIKE '%�%'
UNION ALL
SELECT 'Total athletes remaining:' as status, count(*) as count
FROM athletes;

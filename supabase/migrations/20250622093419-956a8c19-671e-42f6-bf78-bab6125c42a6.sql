
-- Remove athletes with numbered player names from the database
-- This will clean up placeholder entries like "Player 57", "Player 58", etc.

-- First, let's remove any ranking_athletes entries that reference these numbered players
DELETE FROM public.ranking_athletes 
WHERE athlete_id IN (
  SELECT id FROM (
    VALUES 
    -- Add common numbered player patterns that might exist
    ('player-1'), ('player-2'), ('player-3'), ('player-4'), ('player-5'),
    ('player-6'), ('player-7'), ('player-8'), ('player-9'), ('player-10'),
    ('player-11'), ('player-12'), ('player-13'), ('player-14'), ('player-15'),
    ('player-16'), ('player-17'), ('player-18'), ('player-19'), ('player-20'),
    ('player-21'), ('player-22'), ('player-23'), ('player-24'), ('player-25'),
    ('player-26'), ('player-27'), ('player-28'), ('player-29'), ('player-30'),
    ('player-31'), ('player-32'), ('player-33'), ('player-34'), ('player-35'),
    ('player-36'), ('player-37'), ('player-38'), ('player-39'), ('player-40'),
    ('player-41'), ('player-42'), ('player-43'), ('player-44'), ('player-45'),
    ('player-46'), ('player-47'), ('player-48'), ('player-49'), ('player-50'),
    ('player-51'), ('player-52'), ('player-53'), ('player-54'), ('player-55'),
    ('player-56'), ('player-57'), ('player-58'), ('player-59'), ('player-60'),
    ('player-61'), ('player-62'), ('player-63'), ('player-64'), ('player-65'),
    ('player-66'), ('player-67'), ('player-68'), ('player-69'), ('player-70'),
    ('player-71'), ('player-72'), ('player-73'), ('player-74'), ('player-75'),
    ('player-76'), ('player-77'), ('player-78'), ('player-79'), ('player-80'),
    ('player-81'), ('player-82'), ('player-83'), ('player-84'), ('player-85'),
    ('player-86'), ('player-87'), ('player-88'), ('player-89'), ('player-90'),
    ('player-91'), ('player-92'), ('player-93'), ('player-94'), ('player-95'),
    ('player-96'), ('player-97'), ('player-98'), ('player-99'), ('player-100')
  ) AS numbered_players(id)
);

-- Also remove any entries where athlete_id contains patterns like "Player "
DELETE FROM public.ranking_athletes 
WHERE athlete_id ~ '^player-\d+$' 
   OR athlete_id ~ 'Player \d+' 
   OR athlete_id ~ 'player\d+';

-- Clean up any user rankings that might now have no athletes
DELETE FROM public.user_rankings 
WHERE id NOT IN (
  SELECT DISTINCT ranking_id 
  FROM public.ranking_athletes
);

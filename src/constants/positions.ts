
export const FOOTBALL_POSITIONS = [
  'Goalkeeper',
  'Defender', 
  'Midfielder',
  'Attacking Midfielder',
  'Winger',
  'Forward',
  'Striker'
] as const;

export type FootballPosition = typeof FOOTBALL_POSITIONS[number];

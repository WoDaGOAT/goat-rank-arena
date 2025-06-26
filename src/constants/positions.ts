
export const FOOTBALL_POSITIONS = [
  'Goalkeeper',
  'Defender', 
  'Midfielder',
  'Attacking midfielder & Winger',
  'Forward/Striker'
] as const;

export type FootballPosition = typeof FOOTBALL_POSITIONS[number];

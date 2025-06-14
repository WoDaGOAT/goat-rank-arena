
import { Category, Athlete, AthleteMovement } from "@/types";

const soccerAthletes: Athlete[] = [
  { id: "messi", rank: 1, name: "Lionel Messi", imageUrl: "lionel-messi", points: 12500, movement: "neutral" as AthleteMovement },
  { id: "ronaldo", rank: 2, name: "Cristiano Ronaldo", imageUrl: "cristiano-ronaldo", points: 11800, movement: "up" as AthleteMovement },
  { id: "neymar", rank: 3, name: "Neymar Jr.", imageUrl: "neymar-jr", points: 10500, movement: "down" as AthleteMovement },
  { id: "mbappe", rank: 4, name: "Kylian Mbappé", imageUrl: "kylian-mbappe", points: 10200, movement: "up" as AthleteMovement },
  { id: "debruyne", rank: 5, name: "Kevin De Bruyne", imageUrl: "kevin-de-bruyne", points: 9800, movement: "neutral" as AthleteMovement },
  { id: "lewandowski", rank: 6, name: "Robert Lewandowski", imageUrl: "robert-lewandowski", points: 9500, movement: "down" as AthleteMovement },
  { id: "haaland", rank: 7, name: "Erling Haaland", imageUrl: "erling-haaland", points: 9300, movement: "up" as AthleteMovement },
  { id: "salah", rank: 8, name: "Mohamed Salah", imageUrl: "mohamed-salah", points: 8900, movement: "neutral" as AthleteMovement },
  { id: "vandijk", rank: 9, name: "Virgil van Dijk", imageUrl: "virgil-van-dijk", points: 8500, movement: "up" as AthleteMovement },
  { id: "mane", rank: 10, name: "Sadio Mané", imageUrl: "sadio-mane", points: 8200, movement: "down" as AthleteMovement },
];

const basketballAthletes: Athlete[] = [
  { id: "lebron", rank: 1, name: "LeBron James", imageUrl: "lebron-james", points: 15500, movement: "up" as AthleteMovement },
  { id: "curry", rank: 2, name: "Stephen Curry", imageUrl: "stephen-curry", points: 14800, movement: "neutral" as AthleteMovement },
  // Add 8 more basketball players if needed for a full top 10
];


export const mockCategories: Category[] = [
  {
    id: "soccer-goat-france",
    name: "GOAT of Soccer in France",
    description: "Who is the greatest soccer player to ever grace the fields of France?",
    imageUrl: "photo-1493962853295-0fd70327578a", // Example category image
    userRankingCount: 1234,
    leaderboard: soccerAthletes,
  },
  {
    id: "nba-goat-global",
    name: "Global NBA GOAT",
    description: "Debate the all-time greatest in the National Basketball Association.",
    imageUrl: "photo-1438565434616-3ef039228b15",
    userRankingCount: 5678,
    leaderboard: basketballAthletes, // Use a different set of athletes
  },
];

export const getCategoryById = (id: string): Category | undefined => {
  return mockCategories.find(cat => cat.id === id);
};

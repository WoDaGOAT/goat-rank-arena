
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
];

const tennisAthletes: Athlete[] = [
  { id: "federer", rank: 1, name: "Roger Federer", imageUrl: "photo-1493962853295-0fd70327578a", points: 13000, movement: "neutral" as AthleteMovement },
  { id: "nadal", rank: 2, name: "Rafael Nadal", imageUrl: "photo-1466721591366-2d5fba72006d", points: 12800, movement: "up" as AthleteMovement },
  { id: "djokovic", rank: 3, name: "Novak Djokovic", imageUrl: "photo-1452378174528-3090a4bba7b2", points: 12500, movement: "neutral" as AthleteMovement },
];

const f1Athletes: Athlete[] = [
  { id: "hamilton", rank: 1, name: "Lewis Hamilton", imageUrl: "photo-1469041797191-50ace28483c3", points: 14000, movement: "up" as AthleteMovement },
  { id: "schumacher", rank: 2, name: "Michael Schumacher", imageUrl: "photo-1438565434616-3ef039228b15", points: 13500, movement: "neutral" as AthleteMovement },
  { id: "senna", rank: 3, name: "Ayrton Senna", imageUrl: "photo-1441057206919-63d19fac2369", points: 13000, movement: "down" as AthleteMovement },
];


export const mockCategories: Category[] = [
  {
    id: "soccer-goat-france",
    name: "GOAT of Soccer in France",
    description: "Who is the greatest soccer player to ever grace the fields of France?",
    imageUrl: "photo-1487887235947-a955ef187fcc", // Stadium/drone - most sporty in your list
    userRankingCount: 1234,
    leaderboard: soccerAthletes,
  },
  {
    id: "nba-goat-global",
    name: "Global NBA GOAT",
    description: "Debate the all-time greatest in the National Basketball Association.",
    imageUrl: "photo-1518877593221-1f28583780b4", // Dynamic/fluid image to evoke energy, best available
    userRankingCount: 5678,
    leaderboard: basketballAthletes,
  },
  {
    id: "tennis-goat-male",
    name: "Men's Tennis GOAT",
    description: "Who stands above all in the history of men's professional tennis?",
    imageUrl: "photo-1493962853295-0fd70327578a", // Already tennis (Federer), so keep this
    userRankingCount: 3450,
    leaderboard: tennisAthletes,
  },
  {
    id: "f1-goat-alltime",
    name: "All-Time Formula 1 GOAT",
    description: "Determine the ultimate driver in Formula 1 history.",
    imageUrl: "photo-1469041797191-50ace28483c3", // Used before for Hamilton, fits F1 theme best in selection
    userRankingCount: 4110,
    leaderboard: f1Athletes,
  },
  {
    id: "mma-p4p-goat",
    name: "MMA Pound-for-Pound GOAT",
    description: "Discuss the greatest mixed martial artist, irrespective of weight class.",
    imageUrl: "octagon", // Special flag for rendering Octagon icon instead of an image
    userRankingCount: 2890,
    leaderboard: [], 
  },
];

export const getCategoryById = (id: string): Category | undefined => {
  return mockCategories.find(cat => cat.id === id);
};

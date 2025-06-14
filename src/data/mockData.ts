import { Category, Athlete, AthleteMovement } from "@/types";

// Comprehensive football players database from 1960s to present
const allFootballPlayers: Athlete[] = [
  // Legends (1960s-1980s)
  { id: "pele", rank: 1, name: "Pelé", imageUrl: "photo-1493962853295-0fd70327578a", points: 15000, movement: "neutral" as AthleteMovement },
  { id: "maradona", rank: 2, name: "Diego Maradona", imageUrl: "photo-1466721591366-2d5fba72006d", points: 14800, movement: "neutral" as AthleteMovement },
  { id: "cruyff", rank: 3, name: "Johan Cruyff", imageUrl: "photo-1452378174528-3090a4bba7b2", points: 14500, movement: "neutral" as AthleteMovement },
  { id: "beckenbauer", rank: 4, name: "Franz Beckenbauer", imageUrl: "photo-1469041797191-50ace28483c3", points: 14200, movement: "neutral" as AthleteMovement },
  { id: "best", rank: 5, name: "George Best", imageUrl: "photo-1438565434616-3ef039228b15", points: 13800, movement: "neutral" as AthleteMovement },
  { id: "platini", rank: 6, name: "Michel Platini", imageUrl: "photo-1441057206919-63d19fac2369", points: 13500, movement: "neutral" as AthleteMovement },
  { id: "garrincha", rank: 7, name: "Garrincha", imageUrl: "photo-1518877593221-1f28583780b4", points: 13200, movement: "neutral" as AthleteMovement },
  { id: "eusebio", rank: 8, name: "Eusébio", imageUrl: "photo-1487887235947-a955ef187fcc", points: 12900, movement: "neutral" as AthleteMovement },
  { id: "muller", rank: 9, name: "Gerd Müller", imageUrl: "photo-1493962853295-0fd70327578a", points: 12600, movement: "neutral" as AthleteMovement },
  { id: "charlton", rank: 10, name: "Bobby Charlton", imageUrl: "photo-1466721591366-2d5fba72006d", points: 12300, movement: "neutral" as AthleteMovement },

  // 1990s-2000s Icons
  { id: "zidane", rank: 11, name: "Zinedine Zidane", imageUrl: "photo-1452378174528-3090a4bba7b2", points: 12800, movement: "neutral" as AthleteMovement },
  { id: "ronaldo", rank: 12, name: "Ronaldo Nazário", imageUrl: "photo-1469041797191-50ace28483c3", points: 12500, movement: "neutral" as AthleteMovement },
  { id: "ronaldinho", rank: 13, name: "Ronaldinho", imageUrl: "photo-1438565434616-3ef039228b15", points: 12200, movement: "neutral" as AthleteMovement },
  { id: "kaka", rank: 14, name: "Kaká", imageUrl: "photo-1441057206919-63d19fac2369", points: 11900, movement: "neutral" as AthleteMovement },
  { id: "henry", rank: 15, name: "Thierry Henry", imageUrl: "photo-1518877593221-1f28583780b4", points: 11600, movement: "neutral" as AthleteMovement },
  { id: "totti", rank: 16, name: "Francesco Totti", imageUrl: "photo-1487887235947-a955ef187fcc", points: 11300, movement: "neutral" as AthleteMovement },
  { id: "pirlo", rank: 17, name: "Andrea Pirlo", imageUrl: "photo-1493962853295-0fd70327578a", points: 11000, movement: "neutral" as AthleteMovement },
  { id: "gerrard", rank: 18, name: "Steven Gerrard", imageUrl: "photo-1466721591366-2d5fba72006d", points: 10700, movement: "neutral" as AthleteMovement },
  { id: "lampard", rank: 19, name: "Frank Lampard", imageUrl: "photo-1452378174528-3090a4bba7b2", points: 10400, movement: "neutral" as AthleteMovement },
  { id: "scholes", rank: 20, name: "Paul Scholes", imageUrl: "photo-1469041797191-50ace28483c3", points: 10100, movement: "neutral" as AthleteMovement },

  // Modern Era (2010s-Present)
  { id: "messi", rank: 21, name: "Lionel Messi", imageUrl: "lionel-messi", points: 15500, movement: "neutral" as AthleteMovement },
  { id: "cristiano", rank: 22, name: "Cristiano Ronaldo", imageUrl: "cristiano-ronaldo", points: 15200, movement: "up" as AthleteMovement },
  { id: "neymar", rank: 23, name: "Neymar Jr.", imageUrl: "neymar-jr", points: 11800, movement: "down" as AthleteMovement },
  { id: "mbappe", rank: 24, name: "Kylian Mbappé", imageUrl: "kylian-mbappe", points: 11500, movement: "up" as AthleteMovement },
  { id: "debruyne", rank: 25, name: "Kevin De Bruyne", imageUrl: "kevin-de-bruyne", points: 10800, movement: "neutral" as AthleteMovement },
  { id: "lewandowski", rank: 26, name: "Robert Lewandowski", imageUrl: "robert-lewandowski", points: 10500, movement: "down" as AthleteMovement },
  { id: "haaland", rank: 27, name: "Erling Haaland", imageUrl: "erling-haaland", points: 10200, movement: "up" as AthleteMovement },
  { id: "salah", rank: 28, name: "Mohamed Salah", imageUrl: "mohamed-salah", points: 9900, movement: "neutral" as AthleteMovement },
  { id: "vandijk", rank: 29, name: "Virgil van Dijk", imageUrl: "virgil-van-dijk", points: 9600, movement: "up" as AthleteMovement },
  { id: "mane", rank: 30, name: "Sadio Mané", imageUrl: "sadio-mane", points: 9300, movement: "down" as AthleteMovement },

  // Additional Modern Stars
  { id: "modric", rank: 31, name: "Luka Modrić", imageUrl: "photo-1438565434616-3ef039228b15", points: 9800, movement: "neutral" as AthleteMovement },
  { id: "benzema", rank: 32, name: "Karim Benzema", imageUrl: "photo-1441057206919-63d19fac2369", points: 9500, movement: "up" as AthleteMovement },
  { id: "kante", rank: 33, name: "N'Golo Kanté", imageUrl: "photo-1518877593221-1f28583780b4", points: 9200, movement: "down" as AthleteMovement },
  { id: "bruno", rank: 34, name: "Bruno Fernandes", imageUrl: "photo-1487887235947-a955ef187fcc", points: 8900, movement: "up" as AthleteMovement },
  { id: "kane", rank: 35, name: "Harry Kane", imageUrl: "photo-1493962853295-0fd70327578a", points: 8600, movement: "neutral" as AthleteMovement },
  { id: "son", rank: 36, name: "Son Heung-min", imageUrl: "photo-1466721591366-2d5fba72006d", points: 8300, movement: "up" as AthleteMovement },
  { id: "pedri", rank: 37, name: "Pedri", imageUrl: "photo-1452378174528-3090a4bba7b2", points: 8000, movement: "up" as AthleteMovement },
  { id: "gavi", rank: 38, name: "Gavi", imageUrl: "photo-1469041797191-50ace28483c3", points: 7700, movement: "up" as AthleteMovement },
  { id: "vinicius", rank: 39, name: "Vinícius Jr.", imageUrl: "photo-1438565434616-3ef039228b15", points: 8500, movement: "up" as AthleteMovement },
  { id: "rodrygo", rank: 40, name: "Rodrygo", imageUrl: "photo-1441057206919-63d19fac2369", points: 7400, movement: "up" as AthleteMovement },

  // Defenders & Goalkeepers
  { id: "ramos", rank: 41, name: "Sergio Ramos", imageUrl: "photo-1518877593221-1f28583780b4", points: 9400, movement: "neutral" as AthleteMovement },
  { id: "pique", rank: 42, name: "Gerard Piqué", imageUrl: "photo-1487887235947-a955ef187fcc", points: 8800, movement: "down" as AthleteMovement },
  { id: "chiellini", rank: 43, name: "Giorgio Chiellini", imageUrl: "photo-1493962853295-0fd70327578a", points: 8700, movement: "neutral" as AthleteMovement },
  { id: "neuer", rank: 44, name: "Manuel Neuer", imageUrl: "photo-1466721591366-2d5fba72006d", points: 9100, movement: "neutral" as AthleteMovement },
  { id: "oblak", rank: 45, name: "Jan Oblak", imageUrl: "photo-1452378174528-3090a4bba7b2", points: 8400, movement: "neutral" as AthleteMovement },
  { id: "alisson", rank: 46, name: "Alisson Becker", imageUrl: "photo-1469041797191-50ace28483c3", points: 8100, movement: "up" as AthleteMovement },

  // More Classic Players
  { id: "baggio", rank: 47, name: "Roberto Baggio", imageUrl: "photo-1438565434616-3ef039228b15", points: 12100, movement: "neutral" as AthleteMovement },
  { id: "maldini", rank: 48, name: "Paolo Maldini", imageUrl: "photo-1441057206919-63d19fac2369", points: 11800, movement: "neutral" as AthleteMovement },
  { id: "baresi", rank: 49, name: "Franco Baresi", imageUrl: "photo-1518877593221-1f28583780b4", points: 11500, movement: "neutral" as AthleteMovement },
  { id: "carlos", rank: 50, name: "Roberto Carlos", imageUrl: "photo-1487887235947-a955ef187fcc", points: 10600, movement: "neutral" as AthleteMovement },

  // Premier League Legends
  { id: "cantona", rank: 51, name: "Eric Cantona", imageUrl: "photo-1493962853295-0fd70327578a", points: 10300, movement: "neutral" as AthleteMovement },
  { id: "keane", rank: 52, name: "Roy Keane", imageUrl: "photo-1466721591366-2d5fba72006d", points: 9700, movement: "neutral" as AthleteMovement },
  { id: "vieira", rank: 53, name: "Patrick Vieira", imageUrl: "photo-1452378174528-3090a4bba7b2", points: 9400, movement: "neutral" as AthleteMovement },
  { id: "bergkamp", rank: 54, name: "Dennis Bergkamp", imageUrl: "photo-1469041797191-50ace28483c3", points: 10000, movement: "neutral" as AthleteMovement },
  { id: "shearer", rank: 55, name: "Alan Shearer", imageUrl: "photo-1438565434616-3ef039228b15", points: 9800, movement: "neutral" as AthleteMovement },

  // La Liga Icons
  { id: "raul", rank: 56, name: "Raúl González", imageUrl: "photo-1441057206919-63d19fac2369", points: 10500, movement: "neutral" as AthleteMovement },
  { id: "xavi", rank: 57, name: "Xavi Hernández", imageUrl: "photo-1518877593221-1f28583780b4", points: 11400, movement: "neutral" as AthleteMovement },
  { id: "iniesta", rank: 58, name: "Andrés Iniesta", imageUrl: "photo-1487887235947-a955ef187fcc", points: 11100, movement: "neutral" as AthleteMovement },
  { id: "busquets", rank: 59, name: "Sergio Busquets", imageUrl: "photo-1493962853295-0fd70327578a", points: 9000, movement: "neutral" as AthleteMovement },
  { id: "villa", rank: 60, name: "David Villa", imageUrl: "photo-1466721591366-2d5fba72006d", points: 9300, movement: "neutral" as AthleteMovement },
];

// Category-specific selections
const soccerGoatFrance: Athlete[] = [
  { id: "messi", rank: 1, name: "Lionel Messi", imageUrl: "lionel-messi", points: 12500, movement: "neutral" as AthleteMovement },
  { id: "cristiano", rank: 2, name: "Cristiano Ronaldo", imageUrl: "cristiano-ronaldo", points: 11800, movement: "up" as AthleteMovement },
  { id: "neymar", rank: 3, name: "Neymar Jr.", imageUrl: "neymar-jr", points: 10500, movement: "down" as AthleteMovement },
  { id: "mbappe", rank: 4, name: "Kylian Mbappé", imageUrl: "kylian-mbappe", points: 10200, movement: "up" as AthleteMovement },
  { id: "debruyne", rank: 5, name: "Kevin De Bruyne", imageUrl: "kevin-de-bruyne", points: 9800, movement: "neutral" as AthleteMovement },
  { id: "lewandowski", rank: 6, name: "Robert Lewandowski", imageUrl: "robert-lewandowski", points: 9500, movement: "down" as AthleteMovement },
  { id: "haaland", rank: 7, name: "Erling Haaland", imageUrl: "erling-haaland", points: 9300, movement: "up" as AthleteMovement },
  { id: "salah", rank: 8, name: "Mohamed Salah", imageUrl: "mohamed-salah", points: 8900, movement: "neutral" as AthleteMovement },
  { id: "vandijk", rank: 9, name: "Virgil van Dijk", imageUrl: "virgil-van-dijk", points: 8500, movement: "up" as AthleteMovement },
  { id: "mane", rank: 10, name: "Sadio Mané", imageUrl: "sadio-mane", points: 8200, movement: "down" as AthleteMovement },
];

const allTimeGreats: Athlete[] = [
  { id: "pele", rank: 1, name: "Pelé", imageUrl: "photo-1493962853295-0fd70327578a", points: 15000, movement: "neutral" as AthleteMovement },
  { id: "maradona", rank: 2, name: "Diego Maradona", imageUrl: "photo-1466721591366-2d5fba72006d", points: 14800, movement: "neutral" as AthleteMovement },
  { id: "messi", rank: 3, name: "Lionel Messi", imageUrl: "lionel-messi", points: 14600, movement: "up" as AthleteMovement },
  { id: "cristiano", rank: 4, name: "Cristiano Ronaldo", imageUrl: "cristiano-ronaldo", points: 14400, movement: "up" as AthleteMovement },
  { id: "cruyff", rank: 5, name: "Johan Cruyff", imageUrl: "photo-1452378174528-3090a4bba7b2", points: 14200, movement: "neutral" as AthleteMovement },
  { id: "beckenbauer", rank: 6, name: "Franz Beckenbauer", imageUrl: "photo-1469041797191-50ace28483c3", points: 14000, movement: "neutral" as AthleteMovement },
  { id: "zidane", rank: 7, name: "Zinedine Zidane", imageUrl: "photo-1438565434616-3ef039228b15", points: 13800, movement: "neutral" as AthleteMovement },
  { id: "ronaldo", rank: 8, name: "Ronaldo Nazário", imageUrl: "photo-1441057206919-63d19fac2369", points: 13600, movement: "neutral" as AthleteMovement },
  { id: "best", rank: 9, name: "George Best", imageUrl: "photo-1518877593221-1f28583780b4", points: 13400, movement: "neutral" as AthleteMovement },
  { id: "platini", rank: 10, name: "Michel Platini", imageUrl: "photo-1487887235947-a955ef187fcc", points: 13200, movement: "neutral" as AthleteMovement },
];

const modernStars: Athlete[] = [
  { id: "mbappe", rank: 1, name: "Kylian Mbappé", imageUrl: "kylian-mbappe", points: 11500, movement: "up" as AthleteMovement },
  { id: "haaland", rank: 2, name: "Erling Haaland", imageUrl: "erling-haaland", points: 11200, movement: "up" as AthleteMovement },
  { id: "vinicius", rank: 3, name: "Vinícius Jr.", imageUrl: "photo-1438565434616-3ef039228b15", points: 10800, movement: "up" as AthleteMovement },
  { id: "pedri", rank: 4, name: "Pedri", imageUrl: "photo-1452378174528-3090a4bba7b2", points: 10400, movement: "up" as AthleteMovement },
  { id: "gavi", rank: 5, name: "Gavi", imageUrl: "photo-1469041797191-50ace28483c3", points: 10000, movement: "up" as AthleteMovement },
  { id: "bellingham", rank: 6, name: "Jude Bellingham", imageUrl: "photo-1441057206919-63d19fac2369", points: 9800, movement: "up" as AthleteMovement },
  { id: "rice", rank: 7, name: "Declan Rice", imageUrl: "photo-1518877593221-1f28583780b4", points: 9400, movement: "up" as AthleteMovement },
  { id: "mount", rank: 8, name: "Mason Mount", imageUrl: "photo-1487887235947-a955ef187fcc", points: 9000, movement: "neutral" as AthleteMovement },
];

// Keep existing basketball, tennis, and F1 data
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
    imageUrl: "photo-1487887235947-a955ef187fcc",
    userRankingCount: 1234,
    leaderboard: soccerGoatFrance,
  },
  {
    id: "all-time-football-goat",
    name: "All-Time Football GOAT",
    description: "The ultimate debate: Who is the greatest footballer of all time across all eras?",
    imageUrl: "photo-1518877593221-1f28583780b4",
    userRankingCount: 8950,
    leaderboard: allTimeGreats,
  },
  {
    id: "modern-football-stars",
    name: "Rising Modern Stars",
    description: "The next generation of football superstars making their mark on the world stage.",
    imageUrl: "photo-1469041797191-50ace28483c3",
    userRankingCount: 3420,
    leaderboard: modernStars,
  },
  {
    id: "nba-goat-global",
    name: "Global NBA GOAT",
    description: "Debate the all-time greatest in the National Basketball Association.",
    imageUrl: "photo-1518877593221-1f28583780b4",
    userRankingCount: 5678,
    leaderboard: basketballAthletes,
  },
  {
    id: "tennis-goat-male",
    name: "Men's Tennis GOAT",
    description: "Who stands above all in the history of men's professional tennis?",
    imageUrl: "photo-1493962853295-0fd70327578a",
    userRankingCount: 3450,
    leaderboard: tennisAthletes,
  },
  {
    id: "f1-goat-alltime",
    name: "All-Time Formula 1 GOAT",
    description: "Determine the ultimate driver in Formula 1 history.",
    imageUrl: "photo-1469041797191-50ace28483c3",
    userRankingCount: 4110,
    leaderboard: f1Athletes,
  },
  {
    id: "mma-p4p-goat",
    name: "MMA Pound-for-Pound GOAT",
    description: "Discuss the greatest mixed martial artist, irrespective of weight class.",
    imageUrl: "octagon",
    userRankingCount: 2890,
    leaderboard: [], 
  },
];

// Export the comprehensive player database for use in CreateRankingPage
export const allAthletes = allFootballPlayers;

export const getCategoryById = (id: string): Category | undefined => {
  return mockCategories.find(cat => cat.id === id);
};

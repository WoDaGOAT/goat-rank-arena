import allFootballPlayers from "./footballPlayers";
import { Category, Athlete, AthleteMovement } from "@/types";

// Use the imported football players array
const soccerGoatFrance: Athlete[] = allFootballPlayers.slice(0, 10);
const allTimeGreats: Athlete[] = allFootballPlayers.slice(0, 10);
const modernStars: Athlete[] = allFootballPlayers.filter(player => player.isActive).slice(0, 8);

// Keep existing basketball, tennis, and F1 data but update structure
const basketballAthletes: Athlete[] = [
  {
    id: "lebron",
    rank: 1,
    name: "LeBron James",
    imageUrl: "lebron-james",
    points: 15500,
    movement: "up" as AthleteMovement,
    dateOfBirth: "1984-12-30",
    isActive: true,
    countryOfOrigin: "USA",
    nationality: "American",
    clubs: [
      { name: "Cleveland Cavaliers", country: "USA", league: "NBA", yearsActive: "2003-2010" },
      { name: "Miami Heat", country: "USA", league: "NBA", yearsActive: "2010-2014" },
      { name: "Cleveland Cavaliers", country: "USA", league: "NBA", yearsActive: "2014-2018" },
      { name: "Los Angeles Lakers", country: "USA", league: "NBA", yearsActive: "2018-present" }
    ],
    competitions: [
      { name: "NBA", type: "domestic" },
      { name: "Olympics", type: "international" }
    ],
    positions: ["Small Forward", "Power Forward", "Point Guard"]
  }
];

const tennisAthletes: Athlete[] = [
  {
    id: "federer",
    rank: 1,
    name: "Roger Federer",
    imageUrl: "photo-1493962853295-0fd70327578a",
    points: 13000,
    movement: "neutral" as AthleteMovement,
    dateOfBirth: "1981-08-08",
    isActive: false,
    countryOfOrigin: "Switzerland",
    nationality: "Swiss",
    clubs: [],
    competitions: [
      { name: "Wimbledon", type: "international" },
      { name: "US Open", type: "international" },
      { name: "French Open", type: "international" },
      { name: "Australian Open", type: "international" }
    ],
    positions: ["Tennis Player"]
  }
];

const f1Athletes: Athlete[] = [
  {
    id: "hamilton",
    rank: 1,
    name: "Lewis Hamilton",
    imageUrl: "photo-1469041797191-50ace28483c3",
    points: 14000,
    movement: "up" as AthleteMovement,
    dateOfBirth: "1985-01-07",
    isActive: true,
    countryOfOrigin: "United Kingdom",
    nationality: "British",
    clubs: [
      { name: "McLaren", country: "UK", league: "Formula 1", yearsActive: "2007-2012" },
      { name: "Mercedes", country: "Germany", league: "Formula 1", yearsActive: "2013-present" }
    ],
    competitions: [
      { name: "Formula 1 World Championship", type: "international" }
    ],
    positions: ["Racing Driver"]
  }
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

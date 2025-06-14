import { Category, Athlete, AthleteMovement } from "@/types";

// Comprehensive football players database with detailed information
const allFootballPlayers: Athlete[] = [
  // Legends (1960s-1980s)
  {
    id: "pele",
    rank: 1,
    name: "Pelé",
    imageUrl: "photo-1493962853295-0fd70327578a",
    points: 15000,
    movement: "neutral" as AthleteMovement,
    dateOfBirth: "1940-10-23",
    dateOfDeath: "2022-12-29",
    isActive: false,
    countryOfOrigin: "Brazil",
    nationality: "Brazilian",
    clubs: [
      { name: "Santos", country: "Brazil", league: "Campeonato Paulista", yearsActive: "1956-1974" },
      { name: "New York Cosmos", country: "USA", league: "NASL", yearsActive: "1975-1977" }
    ],
    competitions: [
      { name: "FIFA World Cup", type: "international" },
      { name: "Copa Libertadores", type: "continental" },
      { name: "Campeonato Brasileiro", type: "domestic" }
    ],
    positions: ["Forward", "Attacking Midfielder"]
  },
  {
    id: "maradona",
    rank: 2,
    name: "Diego Maradona",
    imageUrl: "photo-1466721591366-2d5fba72006d",
    points: 14800,
    movement: "neutral" as AthleteMovement,
    dateOfBirth: "1960-10-30",
    dateOfDeath: "2020-11-25",
    isActive: false,
    countryOfOrigin: "Argentina",
    nationality: "Argentine",
    clubs: [
      { name: "Argentinos Juniors", country: "Argentina", league: "Primera División", yearsActive: "1976-1981" },
      { name: "Boca Juniors", country: "Argentina", league: "Primera División", yearsActive: "1981-1982" },
      { name: "Barcelona", country: "Spain", league: "La Liga", yearsActive: "1982-1984" },
      { name: "Napoli", country: "Italy", league: "Serie A", yearsActive: "1984-1991" }
    ],
    competitions: [
      { name: "FIFA World Cup", type: "international" },
      { name: "UEFA Cup", type: "continental" },
      { name: "Serie A", type: "domestic" }
    ],
    positions: ["Attacking Midfielder", "Forward"]
  },
  {
    id: "cruyff",
    rank: 3,
    name: "Johan Cruyff",
    imageUrl: "photo-1452378174528-3090a4bba7b2",
    points: 14500,
    movement: "neutral" as AthleteMovement,
    dateOfBirth: "1947-04-25",
    dateOfDeath: "2016-03-24",
    isActive: false,
    countryOfOrigin: "Netherlands",
    nationality: "Dutch",
    clubs: [
      { name: "Ajax", country: "Netherlands", league: "Eredivisie", yearsActive: "1964-1973" },
      { name: "Barcelona", country: "Spain", league: "La Liga", yearsActive: "1973-1978" },
      { name: "Los Angeles Aztecs", country: "USA", league: "NASL", yearsActive: "1979-1980" }
    ],
    competitions: [
      { name: "European Cup", type: "continental" },
      { name: "La Liga", type: "domestic" },
      { name: "Eredivisie", type: "domestic" }
    ],
    positions: ["Forward", "Attacking Midfielder", "Midfielder"]
  },

  // Modern Era (2000s-Present)
  {
    id: "messi",
    rank: 4,
    name: "Lionel Messi",
    imageUrl: "lionel-messi",
    points: 15500,
    movement: "neutral" as AthleteMovement,
    dateOfBirth: "1987-06-24",
    isActive: true,
    countryOfOrigin: "Argentina",
    nationality: "Argentine",
    clubs: [
      { name: "Barcelona", country: "Spain", league: "La Liga", yearsActive: "2004-2021" },
      { name: "Paris Saint-Germain", country: "France", league: "Ligue 1", yearsActive: "2021-2023" },
      { name: "Inter Miami", country: "USA", league: "MLS", yearsActive: "2023-present" }
    ],
    competitions: [
      { name: "FIFA World Cup", type: "international" },
      { name: "UEFA Champions League", type: "continental" },
      { name: "La Liga", type: "domestic" },
      { name: "Copa America", type: "international" }
    ],
    positions: ["Right Winger", "Attacking Midfielder", "Forward"]
  },
  {
    id: "cristiano",
    rank: 5,
    name: "Cristiano Ronaldo",
    imageUrl: "cristiano-ronaldo",
    points: 15200,
    movement: "up" as AthleteMovement,
    dateOfBirth: "1985-02-05",
    isActive: true,
    countryOfOrigin: "Portugal",
    nationality: "Portuguese",
    clubs: [
      { name: "Sporting CP", country: "Portugal", league: "Primeira Liga", yearsActive: "2002-2003" },
      { name: "Manchester United", country: "England", league: "Premier League", yearsActive: "2003-2009" },
      { name: "Real Madrid", country: "Spain", league: "La Liga", yearsActive: "2009-2018" },
      { name: "Juventus", country: "Italy", league: "Serie A", yearsActive: "2018-2021" },
      { name: "Manchester United", country: "England", league: "Premier League", yearsActive: "2021-2022" },
      { name: "Al Nassr", country: "Saudi Arabia", league: "Saudi Pro League", yearsActive: "2023-present" }
    ],
    competitions: [
      { name: "UEFA Champions League", type: "continental" },
      { name: "UEFA European Championship", type: "international" },
      { name: "Premier League", type: "domestic" },
      { name: "La Liga", type: "domestic" }
    ],
    positions: ["Right Winger", "Left Winger", "Forward", "Striker"]
  },
  {
    id: "mbappe",
    rank: 6,
    name: "Kylian Mbappé",
    imageUrl: "kylian-mbappe",
    points: 11500,
    movement: "up" as AthleteMovement,
    dateOfBirth: "1998-12-20",
    isActive: true,
    countryOfOrigin: "France",
    nationality: "French",
    clubs: [
      { name: "AS Monaco", country: "France", league: "Ligue 1", yearsActive: "2015-2017" },
      { name: "Paris Saint-Germain", country: "France", league: "Ligue 1", yearsActive: "2017-2024" },
      { name: "Real Madrid", country: "Spain", league: "La Liga", yearsActive: "2024-present" }
    ],
    competitions: [
      { name: "FIFA World Cup", type: "international" },
      { name: "UEFA Champions League", type: "continental" },
      { name: "Ligue 1", type: "domestic" },
      { name: "UEFA Nations League", type: "international" }
    ],
    positions: ["Left Winger", "Right Winger", "Striker", "Forward"]
  },
  {
    id: "haaland",
    rank: 7,
    name: "Erling Haaland",
    imageUrl: "erling-haaland",
    points: 10200,
    movement: "up" as AthleteMovement,
    dateOfBirth: "2000-07-21",
    isActive: true,
    countryOfOrigin: "Norway",
    nationality: "Norwegian",
    clubs: [
      { name: "Bryne FK", country: "Norway", league: "Norwegian First Division", yearsActive: "2016-2017" },
      { name: "Molde FK", country: "Norway", league: "Eliteserien", yearsActive: "2017-2019" },
      { name: "Red Bull Salzburg", country: "Austria", league: "Austrian Bundesliga", yearsActive: "2019-2020" },
      { name: "Borussia Dortmund", country: "Germany", league: "Bundesliga", yearsActive: "2020-2022" },
      { name: "Manchester City", country: "England", league: "Premier League", yearsActive: "2022-present" }
    ],
    competitions: [
      { name: "UEFA Champions League", type: "continental" },
      { name: "Premier League", type: "domestic" },
      { name: "Bundesliga", type: "domestic" }
    ],
    positions: ["Striker", "Forward"]
  },
  {
    id: "neymar",
    rank: 8,
    name: "Neymar Jr.",
    imageUrl: "neymar-jr",
    points: 11800,
    movement: "down" as AthleteMovement,
    dateOfBirth: "1992-02-05",
    isActive: true,
    countryOfOrigin: "Brazil",
    nationality: "Brazilian",
    clubs: [
      { name: "Santos", country: "Brazil", league: "Campeonato Brasileiro", yearsActive: "2009-2013" },
      { name: "Barcelona", country: "Spain", league: "La Liga", yearsActive: "2013-2017" },
      { name: "Paris Saint-Germain", country: "France", league: "Ligue 1", yearsActive: "2017-2023" },
      { name: "Al Hilal", country: "Saudi Arabia", league: "Saudi Pro League", yearsActive: "2023-present" }
    ],
    competitions: [
      { name: "FIFA World Cup", type: "international" },
      { name: "UEFA Champions League", type: "continental" },
      { name: "Copa America", type: "international" },
      { name: "Olympics", type: "international" }
    ],
    positions: ["Left Winger", "Right Winger", "Attacking Midfielder", "Forward"]
  },

  // Add more players with similar detailed structure...
  {
    id: "debruyne",
    rank: 9,
    name: "Kevin De Bruyne",
    imageUrl: "kevin-de-bruyne",
    points: 10800,
    movement: "neutral" as AthleteMovement,
    dateOfBirth: "1991-06-28",
    isActive: true,
    countryOfOrigin: "Belgium",
    nationality: "Belgian",
    clubs: [
      { name: "KRC Genk", country: "Belgium", league: "Belgian Pro League", yearsActive: "2008-2012" },
      { name: "Chelsea", country: "England", league: "Premier League", yearsActive: "2012-2014" },
      { name: "VfL Wolfsburg", country: "Germany", league: "Bundesliga", yearsActive: "2014-2015" },
      { name: "Manchester City", country: "England", league: "Premier League", yearsActive: "2015-present" }
    ],
    competitions: [
      { name: "UEFA Champions League", type: "continental" },
      { name: "Premier League", type: "domestic" },
      { name: "UEFA European Championship", type: "international" }
    ],
    positions: ["Central Midfielder", "Attacking Midfielder", "Right Midfielder"]
  },
  {
    id: "lewandowski",
    rank: 10,
    name: "Robert Lewandowski",
    imageUrl: "robert-lewandowski",
    points: 10500,
    movement: "down" as AthleteMovement,
    dateOfBirth: "1988-08-21",
    isActive: true,
    countryOfOrigin: "Poland",
    nationality: "Polish",
    clubs: [
      { name: "Znicz Pruszków", country: "Poland", league: "Polish Third League", yearsActive: "2006-2008" },
      { name: "Lech Poznań", country: "Poland", league: "Ekstraklasa", yearsActive: "2008-2010" },
      { name: "Borussia Dortmund", country: "Germany", league: "Bundesliga", yearsActive: "2010-2014" },
      { name: "Bayern Munich", country: "Germany", league: "Bundesliga", yearsActive: "2014-2022" },
      { name: "Barcelona", country: "Spain", league: "La Liga", yearsActive: "2022-present" }
    ],
    competitions: [
      { name: "UEFA Champions League", type: "continental" },
      { name: "Bundesliga", type: "domestic" },
      { name: "La Liga", type: "domestic" },
      { name: "UEFA European Championship", type: "international" }
    ],
    positions: ["Striker", "Forward"]
  }
];

// Update category leaderboards to use the new structure
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

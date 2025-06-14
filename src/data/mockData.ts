import { Category, Athlete, AthleteMovement } from "@/types";

// Comprehensive football players database with detailed information
const allFootballPlayers: Athlete[] = [
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
  {
    id: "beckenbauer",
    rank: 4,
    name: "Franz Beckenbauer",
    imageUrl: "photo-1441057206919-63d19fac2369",
    points: 14200,
    movement: "neutral" as AthleteMovement,
    dateOfBirth: "1945-09-11",
    dateOfDeath: "2024-01-07",
    isActive: false,
    countryOfOrigin: "Germany",
    nationality: "German",
    clubs: [
      { name: "Bayern Munich", country: "Germany", league: "Bundesliga", yearsActive: "1964-1977" },
      { name: "New York Cosmos", country: "USA", league: "NASL", yearsActive: "1977-1980" }
    ],
    competitions: [
      { name: "FIFA World Cup", type: "international" },
      { name: "European Cup", type: "continental" },
      { name: "Bundesliga", type: "domestic" }
    ],
    positions: ["Sweeper", "Centre-Back", "Defensive Midfielder"]
  },
  {
    id: "zico",
    rank: 5,
    name: "Zico",
    imageUrl: "photo-1493962853295-0fd70327578a",
    points: 13800,
    movement: "neutral" as AthleteMovement,
    dateOfBirth: "1953-03-03",
    isActive: false,
    countryOfOrigin: "Brazil",
    nationality: "Brazilian",
    clubs: [
      { name: "Flamengo", country: "Brazil", league: "Campeonato Brasileiro", yearsActive: "1971-1983" },
      { name: "Udinese", country: "Italy", league: "Serie A", yearsActive: "1983-1985" },
      { name: "Kashima Antlers", country: "Japan", league: "J-League", yearsActive: "1991-1994" }
    ],
    competitions: [
      { name: "FIFA World Cup", type: "international" },
      { name: "Copa Libertadores", type: "continental" },
      { name: "Campeonato Brasileiro", type: "domestic" }
    ],
    positions: ["Attacking Midfielder", "Forward"]
  },
  {
    id: "messi",
    rank: 6,
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
    rank: 7,
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
    rank: 8,
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
    rank: 9,
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
    rank: 10,
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
  {
    id: "debruyne",
    rank: 11,
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
    rank: 12,
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
  },
  {
    id: "zidane",
    rank: 13,
    name: "Zinedine Zidane",
    imageUrl: "photo-1493962853295-0fd70327578a",
    points: 14000,
    movement: "neutral" as AthleteMovement,
    dateOfBirth: "1972-06-23",
    isActive: false,
    countryOfOrigin: "France",
    nationality: "French",
    clubs: [
      { name: "Cannes", country: "France", league: "Ligue 1", yearsActive: "1989-1992" },
      { name: "Bordeaux", country: "France", league: "Ligue 1", yearsActive: "1992-1996" },
      { name: "Juventus", country: "Italy", league: "Serie A", yearsActive: "1996-2001" },
      { name: "Real Madrid", country: "Spain", league: "La Liga", yearsActive: "2001-2006" }
    ],
    competitions: [
      { name: "FIFA World Cup", type: "international" },
      { name: "UEFA Champions League", type: "continental" }
    ],
    positions: ["Attacking Midfielder"]
  },
  {
    id: "ronaldinho",
    rank: 14,
    name: "Ronaldinho",
    imageUrl: "photo-1466721591366-2d5fba72006d",
    points: 13900,
    movement: "neutral" as AthleteMovement,
    dateOfBirth: "1980-03-21",
    isActive: false,
    countryOfOrigin: "Brazil",
    nationality: "Brazilian",
    clubs: [
      { name: "Grêmio", country: "Brazil", league: "Campeonato Brasileiro", yearsActive: "1998-2001" },
      { name: "Paris Saint-Germain", country: "France", league: "Ligue 1", yearsActive: "2001-2003" },
      { name: "Barcelona", country: "Spain", league: "La Liga", yearsActive: "2003-2008" },
      { name: "AC Milan", country: "Italy", league: "Serie A", yearsActive: "2008-2011" }
    ],
    competitions: [
      { name: "FIFA World Cup", type: "international" },
      { name: "UEFA Champions League", type: "continental" }
    ],
    positions: ["Attacking Midfielder", "Forward"]
  },
  {
    id: "ronaldo-nazario",
    rank: 15,
    name: "Ronaldo Nazário",
    imageUrl: "photo-1452378174528-3090a4bba7b2",
    points: 14400,
    movement: "neutral" as AthleteMovement,
    dateOfBirth: "1976-09-22",
    isActive: false,
    countryOfOrigin: "Brazil",
    nationality: "Brazilian",
    clubs: [
      { name: "Cruzeiro", country: "Brazil", league: "Campeonato Brasileiro", yearsActive: "1993-1994" },
      { name: "PSV", country: "Netherlands", league: "Eredivisie", yearsActive: "1994-1996" },
      { name: "Barcelona", country: "Spain", league: "La Liga", yearsActive: "1996-1997" },
      { name: "Inter Milan", country: "Italy", league: "Serie A", yearsActive: "1997-2002" },
      { name: "Real Madrid", country: "Spain", league: "La Liga", yearsActive: "2002-2007" }
    ],
    competitions: [{ name: "FIFA World Cup", type: "international" }],
    positions: ["Striker"]
  },
  {
    id: "thierry-henry",
    rank: 16,
    name: "Thierry Henry",
    imageUrl: "photo-1441057206919-63d19fac2369",
    points: 13500,
    movement: "neutral" as AthleteMovement,
    dateOfBirth: "1977-08-17",
    isActive: false,
    countryOfOrigin: "France",
    nationality: "French",
    clubs: [
        { name: "AS Monaco", country: "France", league: "Ligue 1", yearsActive: "1994-1999" },
        { name: "Juventus", country: "Italy", league: "Serie A", yearsActive: "1999" },
        { name: "Arsenal", country: "England", league: "Premier League", yearsActive: "1999-2007" },
        { name: "Barcelona", country: "Spain", league: "La Liga", yearsActive: "2007-2010" }
    ],
    competitions: [
        { name: "FIFA World Cup", type: "international" },
        { name: "UEFA Champions League", type: "continental" }
    ],
    positions: ["Striker", "Left Winger"]
  },
  {
    id: "xavi",
    rank: 17,
    name: "Xavi Hernández",
    imageUrl: "photo-1518877593221-1f28583780b4",
    points: 13400,
    movement: "neutral" as AthleteMovement,
    dateOfBirth: "1980-01-25",
    isActive: false,
    countryOfOrigin: "Spain",
    nationality: "Spanish",
    clubs: [
        { name: "Barcelona", country: "Spain", league: "La Liga", yearsActive: "1998-2015" },
        { name: "Al Sadd", country: "Qatar", league: "Qatar Stars League", yearsActive: "2015-2019" }
    ],
    competitions: [
        { name: "FIFA World Cup", type: "international" },
        { name: "UEFA Champions League", type: "continental" }
    ],
    positions: ["Central Midfielder"]
  },
  {
    id: "iniesta",
    rank: 18,
    name: "Andrés Iniesta",
    imageUrl: "photo-1469041797191-50ace28483c3",
    points: 13450,
    movement: "neutral" as AthleteMovement,
    dateOfBirth: "1984-05-11",
    isActive: false,
    countryOfOrigin: "Spain",
    nationality: "Spanish",
    clubs: [
        { name: "Barcelona", country: "Spain", league: "La Liga", yearsActive: "2002-2018" },
        { name: "Vissel Kobe", country: "Japan", league: "J1 League", yearsActive: "2018-2023" }
    ],
    competitions: [
        { name: "FIFA World Cup", type: "international" },
        { name: "UEFA Champions League", type: "continental" }
    ],
    positions: ["Central Midfielder", "Attacking Midfielder"]
  },
  {
    id: "modric",
    rank: 19,
    name: "Luka Modrić",
    imageUrl: "photo-1493962853295-0fd70327578a",
    points: 11200,
    movement: "neutral" as AthleteMovement,
    dateOfBirth: "1985-09-09",
    isActive: true,
    countryOfOrigin: "Croatia",
    nationality: "Croatian",
    clubs: [
      { name: "Dinamo Zagreb", country: "Croatia", league: "Prva HNL", yearsActive: "2003-2008" },
      { name: "Tottenham Hotspur", country: "England", league: "Premier League", yearsActive: "2008-2012" },
      { name: "Real Madrid", country: "Spain", league: "La Liga", yearsActive: "2012-present" }
    ],
    competitions: [
      { name: "UEFA Champions League", type: "continental" },
      { name: "FIFA World Cup", type: "international" }
    ],
    positions: ["Central Midfielder"]
  },
  {
    id: "salah",
    rank: 20,
    name: "Mohamed Salah",
    imageUrl: "mohamed-salah",
    points: 10700,
    movement: "neutral" as AthleteMovement,
    dateOfBirth: "1992-06-15",
    isActive: true,
    countryOfOrigin: "Egypt",
    nationality: "Egyptian",
    clubs: [
      { name: "FC Basel", country: "Switzerland", league: "Swiss Super League", yearsActive: "2012-2014" },
      { name: "Chelsea", country: "England", league: "Premier League", yearsActive: "2014-2016" },
      { name: "AS Roma", country: "Italy", league: "Serie A", yearsActive: "2016-2017" },
      { name: "Liverpool", country: "England", league: "Premier League", yearsActive: "2017-present" }
    ],
    competitions: [
      { name: "UEFA Champions League", type: "continental" },
      { name: "Premier League", type: "domestic" }
    ],
    positions: ["Right Winger", "Forward"]
  },
  {
    id: "van-dijk",
    rank: 21,
    name: "Virgil van Dijk",
    imageUrl: "virgil-van-dijk",
    points: 9800,
    movement: "neutral" as AthleteMovement,
    dateOfBirth: "1991-07-08",
    isActive: true,
    countryOfOrigin: "Netherlands",
    nationality: "Dutch",
    clubs: [
      { name: "Groningen", country: "Netherlands", league: "Eredivisie", yearsActive: "2011-2013" },
      { name: "Celtic", country: "Scotland", league: "Scottish Premiership", yearsActive: "2013-2015" },
      { name: "Southampton", country: "England", league: "Premier League", yearsActive: "2015-2018" },
      { name: "Liverpool", country: "England", league: "Premier League", yearsActive: "2018-present" }
    ],
    competitions: [
      { name: "UEFA Champions League", type: "continental" },
      { name: "Premier League", type: "domestic" }
    ],
    positions: ["Centre-Back"]
  },
  {
    id: "ramos",
    rank: 22,
    name: "Sergio Ramos",
    imageUrl: "photo-1466721591366-2d5fba72006d",
    points: 10900,
    movement: "down" as AthleteMovement,
    dateOfBirth: "1986-03-30",
    isActive: true,
    countryOfOrigin: "Spain",
    nationality: "Spanish",
    clubs: [
      { name: "Sevilla", country: "Spain", league: "La Liga", yearsActive: "2004-2005" },
      { name: "Real Madrid", country: "Spain", league: "La Liga", yearsActive: "2005-2021" },
      { name: "Paris Saint-Germain", country: "France", league: "Ligue 1", yearsActive: "2021-2023" },
      { name: "Sevilla", country: "Spain", league: "La Liga", yearsActive: "2023-present" }
    ],
    competitions: [
      { name: "FIFA World Cup", type: "international" },
      { name: "UEFA Champions League", type: "continental" }
    ],
    positions: ["Centre-Back", "Right-Back"]
  },
  {
    id: "kane",
    rank: 23,
    name: "Harry Kane",
    imageUrl: "photo-1452378174528-3090a4bba7b2",
    points: 10600,
    movement: "up" as AthleteMovement,
    dateOfBirth: "1993-07-28",
    isActive: true,
    countryOfOrigin: "England",
    nationality: "English",
    clubs: [
      { name: "Tottenham Hotspur", country: "England", league: "Premier League", yearsActive: "2009-2023" },
      { name: "Bayern Munich", country: "Germany", league: "Bundesliga", yearsActive: "2023-present" }
    ],
    competitions: [
      { name: "Premier League", type: "domestic" },
      { name: "Bundesliga", type: "domestic" },
      { name: "UEFA Champions League", type: "continental" }
    ],
    positions: ["Striker"]
  },
  {
    id: "griezmann",
    rank: 24,
    name: "Antoine Griezmann",
    imageUrl: "photo-1441057206919-63d19fac2369",
    points: 10300,
    movement: "neutral" as AthleteMovement,
    dateOfBirth: "1991-03-21",
    isActive: true,
    countryOfOrigin: "France",
    nationality: "French",
    clubs: [
        { name: "Real Sociedad", country: "Spain", league: "La Liga", yearsActive: "2009-2014" },
        { name: "Atlético Madrid", country: "Spain", league: "La Liga", yearsActive: "2014-2019" },
        { name: "Barcelona", country: "Spain", league: "La Liga", yearsActive: "2019-2022" },
        { name: "Atlético Madrid", country: "Spain", league: "La Liga", yearsActive: "2022-present" }
    ],
    competitions: [
        { name: "FIFA World Cup", type: "international" },
        { name: "UEFA Europa League", type: "continental" }
    ],
    positions: ["Forward", "Attacking Midfielder"]
  },
  {
    id: "suarez",
    rank: 25,
    name: "Luis Suárez",
    imageUrl: "photo-1518877593221-1f28583780b4",
    points: 11000,
    movement: "down" as AthleteMovement,
    dateOfBirth: "1987-01-24",
    isActive: true,
    countryOfOrigin: "Uruguay",
    nationality: "Uruguayan",
    clubs: [
        { name: "Ajax", country: "Netherlands", league: "Eredivisie", yearsActive: "2007-2011" },
        { name: "Liverpool", country: "England", league: "Premier League", yearsActive: "2011-2014" },
        { name: "Barcelona", country: "Spain", league: "La Liga", yearsActive: "2014-2020" },
        { name: "Atlético Madrid", country: "Spain", league: "La Liga", yearsActive: "2020-2022" },
        { name: "Inter Miami", country: "USA", league: "MLS", yearsActive: "2024-present" }
    ],
    competitions: [
        { name: "UEFA Champions League", type: "continental" },
        { name: "Copa America", type: "international" }
    ],
    positions: ["Striker"]
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

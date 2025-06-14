
import { Athlete, AthleteMovement } from "@/types";

// Expanded database to exactly 200 soccer players.
// Player IDs after #55 are generic for demonstration. Add more real players' details for production!
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
  },
  {
    id: 'maldini',
    rank: 26,
    name: 'Paolo Maldini',
    imageUrl: 'photo-1493962853295-0fd70327578a',
    points: 13000,
    movement: 'neutral',
    dateOfBirth: '1968-06-26',
    isActive: false,
    countryOfOrigin: 'Italy',
    nationality: 'Italian',
    clubs: [
      { name: 'AC Milan', country: 'Italy', league: 'Serie A', yearsActive: '1985-2009' }
    ],
    competitions: [
      { name: 'UEFA Champions League', type: 'continental' },
      { name: 'Serie A', type: 'domestic' }
    ],
    positions: ['Left-Back', 'Centre-Back']
  },
  {
    id: 'kaka',
    rank: 27,
    name: 'Kaká',
    imageUrl: 'photo-1466721591366-2d5fba72006d',
    points: 12800,
    movement: 'neutral',
    dateOfBirth: '1982-04-22',
    isActive: false,
    countryOfOrigin: 'Brazil',
    nationality: 'Brazilian',
    clubs: [
      { name: 'São Paulo', country: 'Brazil', league: 'Campeonato Brasileiro', yearsActive: '2001-2003' },
      { name: 'AC Milan', country: 'Italy', league: 'Serie A', yearsActive: '2003-2009' },
      { name: 'Real Madrid', country: 'Spain', league: 'La Liga', yearsActive: '2009-2013' }
    ],
    competitions: [
      { name: 'FIFA World Cup', type: 'international' },
      { name: 'UEFA Champions League', type: 'continental' }
    ],
    positions: ['Attacking Midfielder']
  },
  {
    id: 'pirlo',
    rank: 28,
    name: 'Andrea Pirlo',
    imageUrl: 'photo-1452378174528-3090a4bba7b2',
    points: 12900,
    movement: 'neutral',
    dateOfBirth: '1979-05-19',
    isActive: false,
    countryOfOrigin: 'Italy',
    nationality: 'Italian',
    clubs: [
      { name: 'AC Milan', country: 'Italy', league: 'Serie A', yearsActive: '2001-2011' },
      { name: 'Juventus', country: 'Italy', league: 'Serie A', yearsActive: '2011-2015' },
    ],
    competitions: [
      { name: 'FIFA World Cup', type: 'international' },
      { name: 'UEFA Champions League', type: 'continental' }
    ],
    positions: ['Deep-Lying Playmaker', 'Central Midfielder']
  },
  {
    id: 'gerrard',
    rank: 29,
    name: 'Steven Gerrard',
    imageUrl: 'photo-1441057206919-63d19fac2369',
    points: 12700,
    movement: 'neutral',
    dateOfBirth: '1980-05-30',
    isActive: false,
    countryOfOrigin: 'England',
    nationality: 'English',
    clubs: [
      { name: 'Liverpool', country: 'England', league: 'Premier League', yearsActive: '1998-2015' },
    ],
    competitions: [
      { name: 'UEFA Champions League', type: 'continental' },
      { name: 'Premier League', type: 'domestic' }
    ],
    positions: ['Central Midfielder', 'Attacking Midfielder']
  },
  {
    id: 'lampard',
    rank: 30,
    name: 'Frank Lampard',
    imageUrl: 'photo-1493962853295-0fd70327578a',
    points: 12600,
    movement: 'neutral',
    dateOfBirth: '1978-06-20',
    isActive: false,
    countryOfOrigin: 'England',
    nationality: 'English',
    clubs: [
      { name: 'Chelsea', country: 'England', league: 'Premier League', yearsActive: '2001-2014' },
    ],
    competitions: [
      { name: 'UEFA Champions League', type: 'continental' },
      { name: 'Premier League', type: 'domestic' }
    ],
    positions: ['Central Midfielder', 'Attacking Midfielder']
  },
  {
    id: 'drogba',
    rank: 31,
    name: 'Didier Drogba',
    imageUrl: 'photo-1466721591366-2d5fba72006d',
    points: 12500,
    movement: 'neutral',
    dateOfBirth: '1978-03-11',
    isActive: false,
    countryOfOrigin: 'Ivory Coast',
    nationality: 'Ivorian',
    clubs: [
      { name: 'Marseille', country: 'France', league: 'Ligue 1', yearsActive: '2003-2004' },
      { name: 'Chelsea', country: 'England', league: 'Premier League', yearsActive: '2004-2012' },
    ],
    competitions: [
      { name: 'UEFA Champions League', type: 'continental' },
      { name: 'Premier League', type: 'domestic' }
    ],
    positions: ['Striker']
  },
  {
    id: 'etoo',
    rank: 32,
    name: "Samuel Eto'o",
    imageUrl: 'photo-1452378174528-3090a4bba7b2',
    points: 12850,
    movement: 'neutral',
    dateOfBirth: '1981-03-10',
    isActive: false,
    countryOfOrigin: 'Cameroon',
    nationality: 'Cameroonian',
    clubs: [
      { name: 'Barcelona', country: 'Spain', league: 'La Liga', yearsActive: '2004-2009' },
      { name: 'Inter Milan', country: 'Italy', league: 'Serie A', yearsActive: '2009-2011' },
    ],
    competitions: [
      { name: 'UEFA Champions League', type: 'continental' },
      { name: 'Africa Cup of Nations', type: 'international' }
    ],
    positions: ['Striker']
  },
  {
    id: 'puyol',
    rank: 33,
    name: 'Carles Puyol',
    imageUrl: 'photo-1441057206919-63d19fac2369',
    points: 12950,
    movement: 'neutral',
    dateOfBirth: '1978-04-13',
    isActive: false,
    countryOfOrigin: 'Spain',
    nationality: 'Spanish',
    clubs: [
      { name: 'Barcelona', country: 'Spain', league: 'La Liga', yearsActive: '1999-2014' },
    ],
    competitions: [
      { name: 'FIFA World Cup', type: 'international' },
      { name: 'UEFA Champions League', type: 'continental' }
    ],
    positions: ['Centre-Back', 'Right-Back']
  },
  {
    id: 'casillas',
    rank: 34,
    name: 'Iker Casillas',
    imageUrl: 'photo-1518877593221-1f28583780b4',
    points: 13100,
    movement: 'neutral',
    dateOfBirth: '1981-05-20',
    isActive: false,
    countryOfOrigin: 'Spain',
    nationality: 'Spanish',
    clubs: [
      { name: 'Real Madrid', country: 'Spain', league: 'La Liga', yearsActive: '1999-2015' },
    ],
    competitions: [
      { name: 'FIFA World Cup', type: 'international' },
      { name: 'UEFA Champions League', type: 'continental' }
    ],
    positions: ['Goalkeeper']
  },
  {
    id: 'buffon',
    rank: 35,
    name: 'Gianluigi Buffon',
    imageUrl: 'photo-1493962853295-0fd70327578a',
    points: 13200,
    movement: 'neutral',
    dateOfBirth: '1978-01-28',
    isActive: false,
    countryOfOrigin: 'Italy',
    nationality: 'Italian',
    clubs: [
      { name: 'Parma', country: 'Italy', league: 'Serie A', yearsActive: '1995-2001' },
      { name: 'Juventus', country: 'Italy', league: 'Serie A', yearsActive: '2001-2018' },
    ],
    competitions: [
      { name: 'FIFA World Cup', type: 'international' },
      { name: 'Serie A', type: 'domestic' }
    ],
    positions: ['Goalkeeper']
  },
  {
    id: 'neuer',
    rank: 36,
    name: 'Manuel Neuer',
    imageUrl: 'photo-1466721591366-2d5fba72006d',
    points: 11500,
    movement: 'neutral',
    dateOfBirth: '1986-03-27',
    isActive: true,
    countryOfOrigin: 'Germany',
    nationality: 'German',
    clubs: [
      { name: 'Schalke 04', country: 'Germany', league: 'Bundesliga', yearsActive: '2006-2011' },
      { name: 'Bayern Munich', country: 'Germany', league: 'Bundesliga', yearsActive: '2011-present' }
    ],
    competitions: [
      { name: 'FIFA World Cup', type: 'international' },
      { name: 'UEFA Champions League', type: 'continental' }
    ],
    positions: ['Goalkeeper']
  },
  {
    id: 'kroos',
    rank: 37,
    name: 'Toni Kroos',
    imageUrl: 'photo-1452378174528-3090a4bba7b2',
    points: 11300,
    movement: 'neutral',
    dateOfBirth: '1990-01-04',
    isActive: true,
    countryOfOrigin: 'Germany',
    nationality: 'German',
    clubs: [
      { name: 'Bayern Munich', country: 'Germany', league: 'Bundesliga', yearsActive: '2007-2014' },
      { name: 'Real Madrid', country: 'Spain', league: 'La Liga', yearsActive: '2014-present' }
    ],
    competitions: [
      { name: 'FIFA World Cup', type: 'international' },
      { name: 'UEFA Champions League', type: 'continental' }
    ],
    positions: ['Central Midfielder']
  },
  {
    id: 'busquets',
    rank: 38,
    name: 'Sergio Busquets',
    imageUrl: 'photo-1441057206919-63d19fac2369',
    points: 11400,
    movement: 'neutral',
    dateOfBirth: '1988-07-16',
    isActive: true,
    countryOfOrigin: 'Spain',
    nationality: 'Spanish',
    clubs: [
      { name: 'Barcelona', country: 'Spain', league: 'La Liga', yearsActive: '2008-2023' },
      { name: 'Inter Miami', country: 'USA', league: 'MLS', yearsActive: '2023-present' }
    ],
    competitions: [
      { name: 'FIFA World Cup', type: 'international' },
      { name: 'UEFA Champions League', type: 'continental' }
    ],
    positions: ['Defensive Midfielder']
  },
  {
    id: 'ibrahimovic',
    rank: 39,
    name: 'Zlatan Ibrahimović',
    imageUrl: 'photo-1518877593221-1f28583780b4',
    points: 12200,
    movement: 'neutral',
    dateOfBirth: '1981-10-03',
    isActive: false,
    countryOfOrigin: 'Sweden',
    nationality: 'Swedish',
    clubs: [
      { name: 'Ajax', country: 'Netherlands', league: 'Eredivisie', yearsActive: '2001-2004' },
      { name: 'Juventus', country: 'Italy', league: 'Serie A', yearsActive: '2004-2006' },
      { name: 'Inter Milan', country: 'Italy', league: 'Serie A', yearsActive: '2006-2009' },
      { name: 'Barcelona', country: 'Spain', league: 'La Liga', yearsActive: '2009-2010' },
      { name: 'AC Milan', country: 'Italy', league: 'Serie A', yearsActive: '2010-2012' },
      { name: 'Paris Saint-Germain', country: 'France', league: 'Ligue 1', yearsActive: '2012-2016' },
    ],
    competitions: [
      { name: 'UEFA Champions League', type: 'continental' },
      { name: 'Ligue 1', type: 'domestic' },
      { name: 'Serie A', type: 'domestic' },
    ],
    positions: ['Striker']
  },
  {
    id: 'bale',
    rank: 40,
    name: 'Gareth Bale',
    imageUrl: 'photo-1493962853295-0fd70327578a',
    points: 11900,
    movement: 'neutral',
    dateOfBirth: '1989-07-16',
    isActive: false,
    countryOfOrigin: 'Wales',
    nationality: 'Welsh',
    clubs: [
      { name: 'Tottenham Hotspur', country: 'England', league: 'Premier League', yearsActive: '2007-2013' },
      { name: 'Real Madrid', country: 'Spain', league: 'La Liga', yearsActive: '2013-2022' },
    ],
    competitions: [
      { name: 'UEFA Champions League', type: 'continental' },
    ],
    positions: ['Right Winger', 'Forward']
  },
  {
    id: 'robben',
    rank: 41,
    name: 'Arjen Robben',
    imageUrl: 'photo-1466721591366-2d5fba72006d',
    points: 12100,
    movement: 'neutral',
    dateOfBirth: '1984-01-23',
    isActive: false,
    countryOfOrigin: 'Netherlands',
    nationality: 'Dutch',
    clubs: [
      { name: 'Chelsea', country: 'England', league: 'Premier League', yearsActive: '2004-2007' },
      { name: 'Real Madrid', country: 'Spain', league: 'La Liga', yearsActive: '2007-2009' },
      { name: 'Bayern Munich', country: 'Germany', league: 'Bundesliga', yearsActive: '2009-2019' },
    ],
    competitions: [
      { name: 'UEFA Champions League', type: 'continental' },
    ],
    positions: ['Right Winger']
  },
  {
    id: 'ribery',
    rank: 42,
    name: 'Franck Ribéry',
    imageUrl: 'photo-1452378174528-3090a4bba7b2',
    points: 12000,
    movement: 'neutral',
    dateOfBirth: '1983-04-07',
    isActive: false,
    countryOfOrigin: 'France',
    nationality: 'French',
    clubs: [
      { name: 'Marseille', country: 'France', league: 'Ligue 1', yearsActive: '2005-2007' },
      { name: 'Bayern Munich', country: 'Germany', league: 'Bundesliga', yearsActive: '2007-2019' },
    ],
    competitions: [
      { name: 'UEFA Champions League', type: 'continental' },
    ],
    positions: ['Left Winger']
  },
  {
    id: 'figo',
    rank: 43,
    name: 'Luís Figo',
    imageUrl: 'photo-1441057206919-63d19fac2369',
    points: 13300,
    movement: 'neutral',
    dateOfBirth: '1972-11-04',
    isActive: false,
    countryOfOrigin: 'Portugal',
    nationality: 'Portuguese',
    clubs: [
      { name: 'Barcelona', country: 'Spain', league: 'La Liga', yearsActive: '1995-2000' },
      { name: 'Real Madrid', country: 'Spain', league: 'La Liga', yearsActive: '2000-2005' },
      { name: 'Inter Milan', country: 'Italy', league: 'Serie A', yearsActive: '2005-2009' }
    ],
    competitions: [
      { name: 'UEFA Champions League', type: 'continental' },
    ],
    positions: ['Right Winger', 'Attacking Midfielder']
  },
  {
    id: 'raul',
    rank: 44,
    name: 'Raúl',
    imageUrl: 'photo-1518877593221-1f28583780b4',
    points: 13400,
    movement: 'neutral',
    dateOfBirth: '1977-06-27',
    isActive: false,
    countryOfOrigin: 'Spain',
    nationality: 'Spanish',
    clubs: [
      { name: 'Real Madrid', country: 'Spain', league: 'La Liga', yearsActive: '1994-2010' },
    ],
    competitions: [
      { name: 'UEFA Champions League', type: 'continental' },
    ],
    positions: ['Striker', 'Second Striker']
  },
  {
    id: 'roberto-carlos',
    rank: 45,
    name: 'Roberto Carlos',
    imageUrl: 'photo-1493962853295-0fd70327578a',
    points: 13150,
    movement: 'neutral',
    dateOfBirth: '1973-04-10',
    isActive: false,
    countryOfOrigin: 'Brazil',
    nationality: 'Brazilian',
    clubs: [
      { name: 'Real Madrid', country: 'Spain', league: 'La Liga', yearsActive: '1996-2007' },
    ],
    competitions: [
      { name: 'FIFA World Cup', type: 'international' },
      { name: 'UEFA Champions League', type: 'continental' }
    ],
    positions: ['Left-Back']
  },
  {
    id: 'cafu',
    rank: 46,
    name: 'Cafu',
    imageUrl: 'photo-1466721591366-2d5fba72006d',
    points: 13100,
    movement: 'neutral',
    dateOfBirth: '1970-06-07',
    isActive: false,
    countryOfOrigin: 'Brazil',
    nationality: 'Brazilian',
    clubs: [
      { name: 'AS Roma', country: 'Italy', league: 'Serie A', yearsActive: '1997-2003' },
      { name: 'AC Milan', country: 'Italy', league: 'Serie A', yearsActive: '2003-2008' },
    ],
    competitions: [
      { name: 'FIFA World Cup', type: 'international' },
      { name: 'UEFA Champions League', type: 'continental' }
    ],
    positions: ['Right-Back']
  },
  {
    id: 'shevchenko',
    rank: 47,
    name: 'Andriy Shevchenko',
    imageUrl: 'photo-1452378174528-3090a4bba7b2',
    points: 13250,
    movement: 'neutral',
    dateOfBirth: '1976-09-29',
    isActive: false,
    countryOfOrigin: 'Ukraine',
    nationality: 'Ukrainian',
    clubs: [
      { name: 'Dynamo Kyiv', country: 'Ukraine', league: 'Ukrainian Premier League', yearsActive: '1994-1999' },
      { name: 'AC Milan', country: 'Italy', league: 'Serie A', yearsActive: '1999-2006' },
    ],
    competitions: [
      { name: 'UEFA Champions League', type: 'continental' },
    ],
    positions: ['Striker']
  },
  {
    id: 'nedved',
    rank: 48,
    name: 'Pavel Nedvěd',
    imageUrl: 'photo-1441057206919-63d19fac2369',
    points: 13050,
    movement: 'neutral',
    dateOfBirth: '1972-08-30',
    isActive: false,
    countryOfOrigin: 'Czech Republic',
    nationality: 'Czech',
    clubs: [
      { name: 'Lazio', country: 'Italy', league: 'Serie A', yearsActive: '1996-2001' },
      { name: 'Juventus', country: 'Italy', league: 'Serie A', yearsActive: '2001-2009' },
    ],
    competitions: [
      { name: 'UEFA European Championship', type: 'international' },
    ],
    positions: ['Attacking Midfielder', 'Left Winger']
  },
  {
    id: 'bergkamp',
    rank: 49,
    name: 'Dennis Bergkamp',
    imageUrl: 'photo-1518877593221-1f28583780b4',
    points: 13350,
    movement: 'neutral',
    dateOfBirth: '1969-05-10',
    isActive: false,
    countryOfOrigin: 'Netherlands',
    nationality: 'Dutch',
    clubs: [
      { name: 'Arsenal', country: 'England', league: 'Premier League', yearsActive: '1995-2006' },
    ],
    competitions: [
      { name: 'Premier League', type: 'domestic' },
    ],
    positions: ['Second Striker', 'Attacking Midfielder']
  },
  {
    id: 'cantona',
    rank: 50,
    name: 'Eric Cantona',
    imageUrl: 'photo-1493962853295-0fd70327578a',
    points: 13250,
    movement: 'neutral',
    dateOfBirth: '1966-05-24',
    isActive: false,
    countryOfOrigin: 'France',
    nationality: 'French',
    clubs: [
      { name: 'Manchester United', country: 'England', league: 'Premier League', yearsActive: '1992-1997' },
    ],
    competitions: [
      { name: 'Premier League', type: 'domestic' },
    ],
    positions: ['Forward', 'Attacking Midfielder']
  },
  {
    id: 'scholes',
    rank: 51,
    name: 'Paul Scholes',
    imageUrl: 'photo-1466721591366-2d5fba72006d',
    points: 12800,
    movement: 'neutral',
    dateOfBirth: '1974-11-16',
    isActive: false,
    countryOfOrigin: 'England',
    nationality: 'English',
    clubs: [
      { name: 'Manchester United', country: 'England', league: 'Premier League', yearsActive: '1993-2013' },
    ],
    competitions: [
      { name: 'UEFA Champions League', type: 'continental' },
      { name: 'Premier League', type: 'domestic' }
    ],
    positions: ['Central Midfielder']
  },
  {
    id: 'giggs',
    rank: 52,
    name: 'Ryan Giggs',
    imageUrl: 'photo-1452378174528-3090a4bba7b2',
    points: 12750,
    movement: 'neutral',
    dateOfBirth: '1973-11-29',
    isActive: false,
    countryOfOrigin: 'Wales',
    nationality: 'Welsh',
    clubs: [
      { name: 'Manchester United', country: 'England', league: 'Premier League', yearsActive: '1990-2014' },
    ],
    competitions: [
      { name: 'UEFA Champions League', type: 'continental' },
      { name: 'Premier League', type: 'domestic' }
    ],
    positions: ['Left Winger']
  },
  {
    id: 'beckham',
    rank: 53,
    name: 'David Beckham',
    imageUrl: 'photo-1441057206919-63d19fac2369',
    points: 12650,
    movement: 'neutral',
    dateOfBirth: '1975-05-02',
    isActive: false,
    countryOfOrigin: 'England',
    nationality: 'English',
    clubs: [
      { name: 'Manchester United', country: 'England', league: 'Premier League', yearsActive: '1992-2003' },
      { name: 'Real Madrid', country: 'Spain', league: 'La Liga', yearsActive: '2003-2007' },
    ],
    competitions: [
      { name: 'UEFA Champions League', type: 'continental' },
    ],
    positions: ['Right Midfielder', 'Central Midfielder']
  },
  {
    id: 'totti',
    rank: 54,
    name: 'Francesco Totti',
    imageUrl: 'photo-1518877593221-1f28583780b4',
    points: 12950,
    movement: 'neutral',
    dateOfBirth: '1976-09-27',
    isActive: false,
    countryOfOrigin: 'Italy',
    nationality: 'Italian',
    clubs: [
      { name: 'AS Roma', country: 'Italy', league: 'Serie A', yearsActive: '1993-2017' },
    ],
    competitions: [
      { name: 'FIFA World Cup', type: 'international' },
      { name: 'Serie A', type: 'domestic' }
    ],
    positions: ['Attacking Midfielder', 'Forward']
  },
  {
    id: 'del-piero',
    rank: 55,
    name: 'Alessandro Del Piero',
    imageUrl: 'photo-1493962853295-0fd70327578a',
    points: 12900,
    movement: 'neutral',
    dateOfBirth: '1974-11-09',
    isActive: false,
    countryOfOrigin: 'Italy',
    nationality: 'Italian',
    clubs: [
      { name: 'Juventus', country: 'Italy', league: 'Serie A', yearsActive: '1993-2012' },
    ],
    competitions: [
      { name: 'FIFA World Cup', type: 'international' },
      { name: 'UEFA Champions League', type: 'continental' }
    ],
    positions: ['Second Striker', 'Attacking Midfielder']
  },

  // Add athlete objects with placeholder (minimal) info for ranks 56-200
  ...Array.from({ length: 145 }, (_, i) => {
    const idx = i + 56;
    return {
      id: `player-${idx}`,
      rank: idx,
      name: `Player ${idx}`,
      imageUrl: "photo-1493962853295-0fd70327578a",
      points: 10000 - Math.floor(Math.random() * 5000) + idx, // Varied points
      movement: (idx % 3 === 0 ? "up" : idx % 3 === 1 ? "down" : "neutral") as AthleteMovement,
      dateOfBirth: `1980-01-${(idx % 28 + 1).toString().padStart(2, '0')}`,
      isActive: idx % 2 === 0,
      countryOfOrigin: "Country",
      nationality: "Nationality",
      clubs: [
        { name: `Club ${idx}`, country: "Country", league: "League", yearsActive: "2000-2010" }
      ],
      competitions: [
        { name: "League", type: "domestic" }
      ],
      positions: ["Position"]
    } as Athlete;
  }),
];

export default allFootballPlayers;

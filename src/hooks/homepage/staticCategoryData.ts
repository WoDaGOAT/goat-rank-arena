
import { Category } from "@/types";
import { HomepageCategoriesData } from "./fallbackData";
import { allAthletes } from "@/data/mockAthletes";

// Static category data for immediate homepage loading
const createStaticCategory = (
  id: string, 
  name: string, 
  description: string, 
  leaderboard: any[] = [],
  imageUrl?: string
): Category => ({
  id,
  name,
  description,
  userRankingCount: 0, // Will be updated progressively if needed
  leaderboard,
  imageUrl
});

// Featured categories with their actual database IDs for navigation
export const getStaticHomepageData = (): HomepageCategoriesData => {
  console.log("🏠 Generating static homepage data");
  
  try {
    // Use top 10 footballers from mock data for the GOAT Footballer leaderboard preview
    const topFootballers = allAthletes.slice(0, 10).map((athlete, index) => ({
      ...athlete,
      rank: index + 1,
      points: athlete.points || (3000 - index * 50),
      movement: athlete.movement || "neutral"
    }));

    console.log("⚽ Generated footballer leaderboard:", {
      count: topFootballers.length,
      topThree: topFootballers.slice(0, 3).map(a => a.name)
    });

    const goatFootballer = createStaticCategory(
      'goat-footballer-static',
      'GOAT Footballer',
      'Vote for the greatest footballer of all time. Compare legends across eras and decide who truly deserves the title.',
      topFootballers,
      undefined
    );

    const otherCategories = [
      createStaticCategory(
        'goat-goalkeeper-static',
        'GOAT Goalkeeper',
        'The greatest shot-stoppers in football history. From Yashin to Neuer, who stands between the posts as the ultimate GOAT?'
      ),
      createStaticCategory(
        'goat-defender-static',
        'GOAT Defender',
        'Masters of defense who defined generations. Vote for the defender who best combined skill, leadership, and tactical brilliance.'
      ),
      createStaticCategory(
        'goat-midfielder-static',
        'GOAT Midfielder',
        'The engines of their teams. From playmakers to destroyers, who controlled the game better than anyone else?'
      ),
      createStaticCategory(
        'goat-attacker-static',
        'GOAT Attacker',
        'Goal scorers, creators, and game changers. Which forward terrorized defenses and delivered when it mattered most?'
      ),
      createStaticCategory(
        'goat-free-kick-taker-static',
        'GOAT Free-Kick Taker',
        'Masters of the dead ball. Precision, power, and technique - who could bend it like no other?'
      ),
      createStaticCategory(
        'current-goat-footballer-static',
        'Current GOAT Footballer',
        'Among today\'s active players, who has the strongest claim to greatness? Vote for the current generation\'s finest.'
      )
    ];

    console.log("📊 Generated static categories:", {
      goatFootballer: !!goatFootballer,
      otherCategoriesCount: otherCategories.length,
      leaderboardCount: goatFootballer.leaderboard?.length || 0
    });

    return {
      goatFootballer,
      otherCategories
    };
  } catch (error) {
    console.error("❌ Error generating static homepage data:", error);
    
    // Return minimal fallback data
    return {
      goatFootballer: createStaticCategory(
        'fallback-goat-footballer',
        'GOAT Footballer',
        'Greatest footballer of all time',
        [],
        undefined
      ),
      otherCategories: []
    };
  }
};

// Map static IDs to real category names for navigation
export const getCategoryNavigationPath = (staticId: string): string => {
  const categoryMap: Record<string, string> = {
    'goat-footballer-static': 'GOAT Footballer',
    'goat-goalkeeper-static': 'GOAT Goalkeeper', 
    'goat-defender-static': 'GOAT Defender',
    'goat-midfielder-static': 'GOAT Midfielder',
    'goat-attacker-static': 'GOAT Attacker',
    'goat-free-kick-taker-static': 'GOAT Free-Kick Taker',
    'current-goat-footballer-static': 'Current GOAT Footballer'
  };
  
  return categoryMap[staticId] || staticId;
};

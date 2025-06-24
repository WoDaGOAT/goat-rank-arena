import CategoryCard from "@/components/CategoryCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Category, Athlete } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { useAthletes } from "@/hooks/useAthletes";
import { mapDatabaseAthleteToUIAthlete } from "@/utils/athleteDataMapper";

const Index = () => {
  const { data: athletes = [] } = useAthletes();

  const { data: categories, isLoading, isError } = useQuery<Category[]>({
    queryKey: ["featuredSubcategories"],
    queryFn: async () => {
      // First, get the ID of the 'GOAT' parent category
      const { data: parentCategory, error: parentError } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "GOAT")
        .is("parent_id", null)
        .single();

      if (parentError || !parentCategory) {
        toast.error("Failed to load featured categories.");
        console.error("Error fetching parent category for homepage:", parentError);
        throw new Error(parentError?.message || "Parent category not found");
      }

      const featuredCategories = [
        "GOAT Footballer",
        "GOAT Goalkeeper",
        "GOAT Defender",
        "GOAT Midfielder",
        "GOAT Attacker",
        "GOAT Free-Kick Taker",
      ];

      // Now, fetch up to 9 subcategories of 'GOAT' that are in our featured list
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("parent_id", parentCategory.id)
        .in("name", featuredCategories)
        .order("name")
        .limit(9);

      if (error) {
        toast.error("Failed to load categories.");
        console.error("Error fetching categories:", error);
        throw new Error(error.message);
      }

      // For each category, fetch top 3 athletes from user rankings
      const categoriesWithLeaderboards = await Promise.all(
        data.map(async (c) => {
          // Fetch athlete scores for this category by joining user_rankings with ranking_athletes
          const { data: athleteRankings, error: rankingsError } = await supabase
            .from("user_rankings")
            .select(`
              ranking_athletes(
                athlete_id,
                position,
                points
              )
            `)
            .eq("category_id", c.id);

          let leaderboard: Athlete[] = [];

          if (!rankingsError && athleteRankings && athleteRankings.length > 0) {
            // Calculate athlete scores from all rankings
            const athleteScores: Record<string, { totalScore: number; appearances: number }> = {};
            
            athleteRankings.forEach((ranking) => {
              if (ranking.ranking_athletes && Array.isArray(ranking.ranking_athletes)) {
                ranking.ranking_athletes.forEach((athleteRanking: any) => {
                  const athleteId = athleteRanking.athlete_id;
                  const points = athleteRanking.points;
                  
                  if (athleteId && points) {
                    if (!athleteScores[athleteId]) {
                      athleteScores[athleteId] = {
                        totalScore: 0,
                        appearances: 0
                      };
                    }
                    
                    athleteScores[athleteId].totalScore += points;
                    athleteScores[athleteId].appearances += 1;
                  }
                });
              }
            });

            // Convert to leaderboard format and sort by total score
            const athleteObjects = Object.entries(athleteScores)
              .map(([athleteId, { totalScore }]) => {
                // Find athlete data from database
                const athleteData = athletes.find(athlete => athlete.id === athleteId);
                
                if (!athleteData) {
                  console.warn(`Athlete data not found for ID: ${athleteId}`);
                  return null;
                }

                const athlete = mapDatabaseAthleteToUIAthlete(athleteData, 0, totalScore);
                return athlete;
              })
              .filter((athlete): athlete is Athlete => athlete !== null);

            leaderboard = athleteObjects
              .sort((a, b) => b.points - a.points)
              .slice(0, 3) // Only top 3 for podium
              .map((athlete, index) => ({
                ...athlete,
                rank: index + 1
              }));
          }

          return {
            id: c.id,
            name: c.name,
            description: c.description || "No description provided.",
            imageUrl: c.image_url || undefined,
            userRankingCount: Math.floor(Math.random() * 5000) + 1000,
            leaderboard: leaderboard
          };
        })
      );

      return categoriesWithLeaderboards;
    },
    retry: 1,
  });

  return (
    <>
      <Helmet>
        <title>Wodagoat - Rank the GOATs of Sports</title>
        <meta name="description" content="The ultimate platform for sports fans to rank their favorite athletes, debate the GOATs, and see global leaderboards for sports like Football, Cricket, Tennis, and more." />
      </Helmet>
      <div
        className="flex flex-col flex-grow"
        style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}
      >
        <div className="container mx-auto px-4 py-12 flex-grow">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-10">
                Explore GOAT Debates
            </h2>
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-[420px] w-full rounded-lg bg-white/5" />
                ))}
                </div>
            )}
            {isError && (
                <p className="text-center text-red-400 text-lg">
                Could not load categories. Please try again later.
                </p>
            )}
            {!isLoading && !isError && categories && categories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
                </div>
            ) : (
                !isLoading &&
                !isError && (
                <p className="text-center text-muted-foreground text-lg">
                    No categories available at the moment. Check back soon!
                </p>
                )
            )}
        </div>
      </div>
    </>
  );
};

export default Index;

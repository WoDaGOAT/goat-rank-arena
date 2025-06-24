
import CategoryCard from "@/components/CategoryCard";
import GlobalLeaderboard from "@/components/GlobalLeaderboard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Category, Athlete } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { mapDatabaseAthleteToUIAthlete } from "@/utils/athleteDataMapper";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const Index = () => {
  const { data: categoriesData, isLoading, isError } = useQuery<{
    goatFootballer: Category | null;
    otherCategories: Category[];
  }>({
    queryKey: ["homepageCategories", "v3"], // Updated cache key for fresh data
    queryFn: async () => {
      console.log("Starting homepage categories query...");
      
      // First, fetch all athletes data directly
      const { data: athletesData, error: athletesError } = await supabase
        .from("athletes")
        .select("*")
        .order("name");

      if (athletesError) {
        console.error("Error fetching athletes:", athletesError);
        toast.error("Failed to load athlete data.");
        throw new Error(athletesError.message);
      }

      console.log("Athletes fetched:", athletesData?.length || 0);

      // Then, get the ID of the 'GOAT' parent category
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

      // Fetch all featured categories
      const { data: categoriesRaw, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .eq("parent_id", parentCategory.id)
        .in("name", featuredCategories)
        .order("name")
        .limit(9);

      if (categoriesError) {
        toast.error("Failed to load categories.");
        console.error("Error fetching categories:", categoriesError);
        throw new Error(categoriesError.message);
      }

      // Process categories and calculate leaderboards
      const categoriesWithLeaderboards = await Promise.all(
        categoriesRaw.map(async (c) => {
          // Get the actual count of user rankings for this category
          const { count: rankingCount, error: countError } = await supabase
            .from("user_rankings")
            .select("*", { count: "exact", head: true })
            .eq("category_id", c.id);

          if (countError) {
            console.error("Error fetching ranking count for category:", c.name, countError);
          }

          // Fetch athlete scores for this category
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

          if (!rankingsError && athleteRankings && athleteRankings.length > 0 && athletesData) {
            console.log(`Processing leaderboard for ${c.name}, found ${athleteRankings.length} rankings`);
            
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

            console.log(`Found ${Object.keys(athleteScores).length} athletes with scores for ${c.name}`);

            // Convert to leaderboard format and sort by total score
            const athleteObjects = Object.entries(athleteScores)
              .map(([athleteId, { totalScore }]) => {
                const athleteData = athletesData.find(athlete => athlete.id === athleteId);
                
                if (!athleteData) {
                  console.warn(`Athlete data not found for ID: ${athleteId}`);
                  return null;
                }

                const athlete = mapDatabaseAthleteToUIAthlete(athleteData, 0, totalScore);
                return athlete;
              })
              .filter((athlete): athlete is Athlete => athlete !== null);

            const maxAthletes = c.name === "GOAT Footballer" ? 10 : 3; // Top 10 for featured, top 3 for others
            leaderboard = athleteObjects
              .sort((a, b) => b.points - a.points)
              .slice(0, maxAthletes)
              .map((athlete, index) => ({
                ...athlete,
                rank: index + 1
              }));

            console.log(`Final leaderboard for ${c.name}:`, leaderboard.length, "athletes");
          } else {
            console.log(`No rankings found for ${c.name}`);
          }

          return {
            id: c.id,
            name: c.name,
            description: c.description || "No description provided.",
            imageUrl: c.image_url || undefined,
            userRankingCount: rankingCount || 0,
            leaderboard: leaderboard
          };
        })
      );

      // Separate GOAT Footballer from other categories
      const goatFootballer = categoriesWithLeaderboards.find(c => c.name === "GOAT Footballer") || null;
      const otherCategories = categoriesWithLeaderboards.filter(c => c.name !== "GOAT Footballer");

      console.log("GOAT Footballer leaderboard:", goatFootballer?.leaderboard?.length || 0, "athletes");

      return {
        goatFootballer,
        otherCategories
      };
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const CreateRankingButton = ({ categoryId }: { categoryId: string }) => (
    <Link to={`/category/${categoryId}/rank`}>
      <Button variant="cta" size="lg" className="w-full">
        <Plus className="w-5 h-5 mr-2" />
        Create Your GOAT Footballer Ranking
      </Button>
    </Link>
  );

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
          {isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Featured leaderboard skeleton */}
              <div className="lg:col-span-2">
                <Skeleton className="h-[600px] w-full rounded-lg bg-white/5" />
              </div>
              {/* Other categories skeleton */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-[420px] w-full rounded-lg bg-white/5" />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {isError && (
            <div className="text-center text-red-400 text-lg space-y-2">
              <p>Could not load categories. Please try again later.</p>
              <p className="text-sm text-red-300">Check the console for more details.</p>
            </div>
          )}
          
          {!isLoading && !isError && categoriesData && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left side - Featured GOAT Footballer Leaderboard */}
              <div className="lg:col-span-2 space-y-6">
                {categoriesData.goatFootballer ? (
                  <>
                    <GlobalLeaderboard
                      athletes={categoriesData.goatFootballer.leaderboard}
                      categoryName={categoriesData.goatFootballer.name}
                    />
                    <CreateRankingButton categoryId={categoriesData.goatFootballer.id} />
                  </>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p>GOAT Footballer category not found.</p>
                  </div>
                )}
              </div>

              {/* Right side - Other Category Cards */}
              <div className="lg:col-span-3">
                <h3 className="text-xl font-semibold text-primary mb-6 text-center lg:text-left">
                  More GOAT Categories
                </h3>
                {categoriesData.otherCategories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categoriesData.otherCategories.map((category) => (
                      <CategoryCard key={category.id} category={category} />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">
                    No other categories available at the moment.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Index;

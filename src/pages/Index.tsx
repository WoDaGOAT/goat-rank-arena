
import Navbar from "@/components/Navbar";
import CategoryCard from "@/components/CategoryCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Category } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const Index = () => {
  const { data: categories, isLoading, isError } = useQuery<Category[]>({
    queryKey: ["rootCategories"],
    queryFn: async () => {
      // Fetch only parent categories (those without a parent_id)
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .is("parent_id", null)
        .order("name");

      if (error) {
        toast.error("Failed to load categories.");
        console.error("Error fetching categories:", error);
        throw new Error(error.message);
      }

      // Map the database response to our frontend Category type
      return data.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description || "No description provided.",
        imageUrl: c.image_url || undefined,
        // userRankingCount will be properly implemented later
        userRankingCount: Math.floor(Math.random() * 5000) + 1000,
        leaderboard: [], // Not needed for the category card display
      }));
    },
    retry: 1,
  });

  return (
    <>
      <Navbar />
      {/* Apply category-page background gradient */}
      <div
        className="min-h-screen"
        style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}
      >
        {/* HERO HEADER - reduced height, transparent to show gradient */}
        <header className="bg-transparent text-primary-foreground py-8 px-4 text-center shadow-md">
          <div className="container mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
              Welcome to wodagoat!
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-8 max-w-3xl mx-auto text-primary-foreground/80 font-medium">
              The ultimate platform for sports fans to rank their favorite athletes and contribute to the global GOAT debate.
            </p>
            {/* You can add a primary CTA here if needed */}
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-10">
            Choose a Category & Join the Debate
          </h2>
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
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
        </main>

        <footer className="py-8 text-center text-muted-foreground border-t border-border mt-12">
          <p>&copy; {new Date().getFullYear()} wodagoat. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default Index;

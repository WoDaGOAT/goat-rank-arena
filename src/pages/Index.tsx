
import Navbar from "@/components/Navbar";
import CategoryCard from "@/components/CategoryCard";
import { mockCategories } from "@/data/mockData"; // Using mock data

const Index = () => {
  return (
    <>
      <Navbar />
      {/* Apply category-page background gradient */}
      <div
        className="min-h-screen"
        style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}
      >
        {/* HERO HEADER - now styled to match Navbar */}
        <header className="bg-black text-primary-foreground py-16 px-4 text-center shadow-md">
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
          {mockCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground text-lg">
              No categories available at the moment. Check back soon!
            </p>
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

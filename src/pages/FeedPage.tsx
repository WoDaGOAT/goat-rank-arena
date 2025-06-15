
import Navbar from "@/components/Navbar";
import FeedList from "@/components/feed/FeedList";

const FeedPage = () => {
  return (
    <>
      <Navbar />
      <div
        className="min-h-screen"
        style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}
      >
        <header className="bg-transparent text-primary-foreground py-8 px-4 text-center shadow-md">
          <div className="container mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
              Activity Feed
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-8 max-w-3xl mx-auto text-primary-foreground/80 font-medium">
              See what's happening across the platform.
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <FeedList />
          </div>
        </main>

        <footer className="py-8 text-center text-muted-foreground border-t border-border mt-12">
          <p>&copy; {new Date().getFullYear()} wodagoat. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default FeedPage;

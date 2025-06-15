
import Navbar from "@/components/Navbar";
import FeedList from "@/components/feed/FeedList";
import Footer from "@/components/Footer";

const FeedPage = () => {
  return (
    <>
      <Navbar />
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}
      >
        <header className="bg-transparent text-primary-foreground py-8 px-4 text-center shadow-md">
          <div className="container mx-auto pt-8">
            <p className="text-base sm:text-lg md:text-xl mb-8 max-w-3xl mx-auto text-primary-foreground/80 font-medium">
              See what's happening across the platform.
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 flex-grow">
          <div className="max-w-3xl mx-auto">
            <FeedList />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FeedPage;

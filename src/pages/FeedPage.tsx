
import FeedList from "@/components/feed/FeedList";

const FeedPage = () => {
  return (
    <div
      className="flex flex-col flex-grow"
      style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}
    >
      <header className="bg-transparent text-primary-foreground py-4 px-4 text-center shadow-md">
        <div className="container mx-auto pt-4">
          <p className="text-base sm:text-lg md:text-xl mb-4 max-w-3xl mx-auto text-primary-foreground/80 font-medium">
            Latest GOAT moves. Fresh from the field.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex-grow">
        <div className="max-w-3xl mx-auto">
          <FeedList />
        </div>
      </div>
    </div>
  );
};

export default FeedPage;

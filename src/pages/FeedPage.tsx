
import OptimizedFeedList from "@/components/feed/OptimizedFeedList";

const FeedPage = () => {
  return (
    <div
      className="flex flex-col flex-grow min-h-screen"
      style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}
    >
      <header className="bg-transparent text-primary-foreground py-6 px-4 text-center shadow-md">
        <div className="container mx-auto pt-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 max-w-4xl mx-auto text-white font-poppins">
            Latest GOAT moves.
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl font-semibold max-w-4xl mx-auto text-blue-300 font-poppins">
            Fresh from the field.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex-grow">
        <div className="max-w-3xl mx-auto">
          <OptimizedFeedList />
        </div>
      </div>
    </div>
  );
};

export default FeedPage;

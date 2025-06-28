
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Footer from "@/components/Footer";

interface RankingNotFoundProps {
  isValidUUID: boolean;
  error?: Error | null;
  rankingId?: string;
  originalRankingId?: any;
}

const RankingNotFound = ({ isValidUUID, error, rankingId, originalRankingId }: RankingNotFoundProps) => {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
      <main className="container mx-auto px-4 py-8 text-center text-white flex-grow flex flex-col items-center justify-center">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-4">Ranking Not Available</h1>
          <p className="text-gray-300">We couldn't find the details for this specific ranking.</p>
          {!isValidUUID && (
            <p className="text-gray-400 mt-2">The ranking ID in the URL appears to be invalid.</p>
          )}
          {isValidUUID && (
            <p className="text-gray-400 mt-2">This might be because the ranking was deleted or there was an error loading it.</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Attempted to load ID: {rankingId || 'Invalid ID'}
          </p>
          {error && (
            <p className="text-xs text-red-400 mt-2">Error: {error.toString()}</p>
          )}
          <Button asChild variant="outline" className="mt-6 border-white text-white hover:bg-white hover:text-indigo-900">
            <Link to={`/feed`}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Feed
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RankingNotFound;

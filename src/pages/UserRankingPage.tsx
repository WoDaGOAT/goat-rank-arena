
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useUserRanking } from "@/hooks/useUserRanking";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const UserRankingPage = () => {
  const { rankingId } = useParams<{ rankingId: string }>();
  const { data: ranking, isLoading, error } = useUserRanking(rankingId);

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center text-white">
          <p>Loading ranking...</p>
        </div>
      </div>
    );
  }

  if (error || !ranking) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
          <div className="container mx-auto px-4 py-8 text-center text-white">
            <h1 className="text-3xl font-bold text-yellow-400 mb-4">Ranking Not Available</h1>
            <p className="text-gray-300">We couldn't find the details for this specific ranking.</p>
            <p className="text-gray-400 mt-2">This might be because the ranking was deleted or the link is incorrect.</p>
            <p className="text-sm text-gray-500 mt-1">Attempted to load ID: {rankingId}</p>
            <Button asChild variant="outline" className="mt-6 border-white text-white hover:bg-white hover:text-indigo-900">
              <Link to={`/feed`}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Feed
              </Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen text-white" style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}>
        <main className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold">{ranking.title}</h1>
            <p className="mt-4 text-gray-400">If you see this, the page is loading correctly.</p>
            <pre className="mt-4 bg-gray-800 p-4 rounded-md overflow-x-auto">
                <code>{JSON.stringify(ranking, null, 2)}</code>
            </pre>
        </main>
      </div>
    </>
  );
};

export default UserRankingPage;

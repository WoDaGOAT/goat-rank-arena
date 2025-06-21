import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useUserRanking } from "@/hooks/useUserRanking";
import { Button } from "@/components/ui/button";
import { ChevronLeft, BarChart3 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import RankedAthleteRow from "@/components/feed/items/RankedAthleteRow";
import UserHoverCard from "@/components/profile/UserHoverCard";
import Footer from "@/components/Footer";

const UserRankingPage = () => {
  const { rankingId } = useParams<{ rankingId: string }>();
  const { data: ranking, isLoading, error } = useUserRanking(rankingId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
        <Navbar />
        <main className="container mx-auto px-4 py-8 text-center text-white flex-grow flex items-center justify-center">
          <p>Loading ranking...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !ranking) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
          <main className="container mx-auto px-4 py-8 text-center text-white flex-grow flex flex-col items-center justify-center">
            <div>
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
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen text-white flex flex-col" style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}>
        <main className="container mx-auto px-4 py-8 flex-grow">
           <div className="mb-6">
            <Button asChild variant="outline" className="border-white/10 bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white">
              <Link to={`/feed`}>
                <ChevronLeft /> Back to Feed
              </Link>
            </Button>
          </div>

          <header className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl flex items-center gap-3">
              <BarChart3 className="h-10 w-10 text-blue-400" />
              {ranking.title}
            </h1>
            <p className="mt-2 text-lg text-gray-400">
              Created on {format(new Date(ranking.created_at), "MMMM d, yyyy")}
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-white/5 border-white/10 text-white">
                <CardHeader>
                  <h2 className="text-2xl font-semibold leading-none tracking-tight">Ranked Athletes</h2>
                  <CardDescription className="text-gray-400">
                    See who made the cut in this ranking.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-col">
                    {ranking.athletes.length > 0 ? (
                      ranking.athletes.map((athlete) => (
                        <RankedAthleteRow key={athlete.id} athlete={athlete} />
                      ))
                    ) : (
                      <p className="p-6 text-gray-400">No athletes have been ranked yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <aside className="space-y-8">
              <Card className="bg-white/5 border-white/10 text-white">
                <CardHeader>
                  <h2 className="text-2xl font-semibold leading-none tracking-tight">About this Ranking</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ranking.description ? (
                    <p className="text-gray-300">{ranking.description}</p>
                  ) : (
                    <p className="text-gray-400 italic">No description provided.</p>
                  )}

                  {ranking.profiles && (
                    <div className="flex items-center gap-4 pt-2">
                        <UserHoverCard user={{ id: ranking.user_id, full_name: ranking.profiles.full_name, avatar_url: ranking.profiles.avatar_url }}>
                            <Avatar>
                                <AvatarImage src={ranking.profiles.avatar_url || undefined} />
                                <AvatarFallback>{ranking.profiles.full_name?.charAt(0) || 'A'}</AvatarFallback>
                            </Avatar>
                        </UserHoverCard>
                      <div>
                        <p className="text-sm text-gray-400">Created by</p>
                        <UserHoverCard user={{ id: ranking.user_id, full_name: ranking.profiles.full_name, avatar_url: ranking.profiles.avatar_url }}>
                            <Link to={`/users/${ranking.user_id}`} className="font-semibold text-white hover:underline">
                                {ranking.profiles.full_name || 'Anonymous User'}
                            </Link>
                        </UserHoverCard>
                      </div>
                    </div>
                  )}
                  
                  {ranking.categories && (
                    <div className="!mt-6">
                      <p className="text-sm text-gray-400 mb-2">Category</p>
                      <Link to={`/category/${ranking.category_id}`} className="inline-block px-3 py-1 text-sm font-medium bg-blue-500/20 text-blue-300 rounded-full hover:bg-blue-500/40 transition-colors">
                        {ranking.categories.name || 'Uncategorized'}
                      </Link>
                    </div>
                  )}

                </CardContent>
              </Card>
            </aside>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default UserRankingPage;

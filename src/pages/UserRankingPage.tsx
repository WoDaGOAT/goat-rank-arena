
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useUserRanking } from "@/hooks/useUserRanking";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import RankedAthleteRow from "@/components/feed/items/RankedAthleteRow";
import { BarChart3, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserHoverCard from "@/components/profile/UserHoverCard";

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
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center text-white">
          <h1 className="text-2xl font-bold">Ranking not found</h1>
          <p className="text-gray-400 mt-2">Could not load the requested ranking.</p>
           <Button asChild variant="outline" className="mt-4 border-white text-white hover:bg-white hover:text-indigo-900">
            <Link to={`/`}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Go Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const user = {
    id: ranking.user_id,
    full_name: ranking.profiles?.full_name || "A User",
    avatar_url: ranking.profiles?.avatar_url || null,
  };

  const userInitial = user?.full_name?.charAt(0) || '?';

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}>
        <main className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto">
                <Button asChild variant="link" className="text-gray-300 hover:text-white px-0 mb-4">
                    <Link to={`/category/${ranking.category_id}`}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back to {ranking.categories?.name}
                    </Link>
                </Button>
                <Card className="bg-white/5 border-gray-700 text-white shadow-lg overflow-hidden">
                    <CardHeader className="p-4 border-b border-gray-700/50">
                        <div className="flex items-start gap-4">
                        <BarChart3 className="h-8 w-8 text-indigo-400 mt-1 flex-shrink-0" />
                        <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={user.avatar_url || undefined} />
                                    <AvatarFallback className="bg-gray-700 text-xs">{userInitial.toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <p className="text-sm text-gray-200">
                                <UserHoverCard user={user}>
                                    <Link to={`/user/${user.id}`} className="font-semibold hover:underline">
                                        {user.full_name}
                                    </Link>
                                </UserHoverCard>
                                </p>
                            </div>
                            
                            <div className="pl-1">
                                <h3 className="text-2xl font-bold text-white">{ranking.title}</h3>
                                <p className="text-sm text-gray-300 mb-2">
                                    in <Link to={`/category/${ranking.category_id}`} className="font-semibold text-blue-400 hover:underline">{ranking.categories?.name}</Link>
                                    <span className="text-gray-500 mx-2">&bull;</span>
                                    <span className="text-gray-400">{format(new Date(ranking.created_at), 'MMM d, yyyy')}</span>
                                </p>
                                {ranking.description && (
                                <blockquote className="mt-2 pl-3 border-l-2 border-gray-600/80">
                                    <p className="text-sm text-gray-400 italic">{ranking.description}</p>
                                </blockquote>
                                )}
                            </div>
                        </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-2 space-y-1">
                        {ranking.athletes && ranking.athletes.length > 0 ? (
                        ranking.athletes.map((athlete) => (
                            <RankedAthleteRow key={athlete.id} athlete={athlete} />
                        ))
                        ) : (
                        <p className="text-gray-400 text-center py-4">This ranking has no athletes.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
      </div>
    </>
  );
};

export default UserRankingPage;

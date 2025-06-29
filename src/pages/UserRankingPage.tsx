import { useState, useEffect } from "react";
import { useUserRanking } from "@/hooks/useUserRanking";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import RankedAthleteRow from "@/components/feed/items/RankedAthleteRow";
import { ShareDialog } from "@/components/category/ShareDialog";
import RankingSEO from "@/components/seo/RankingSEO";
import SocialPreviewDebug from "@/components/seo/SocialPreviewDebug";
import RankingNotFound from "@/components/ranking/RankingNotFound";
import RankingHeader from "@/components/ranking/RankingHeader";
import RankingMetadata from "@/components/ranking/RankingMetadata";
import RankingPageActions from "@/components/ranking/RankingPageActions";
import { SocialActions } from "@/components/category/SocialActions";
import { useRankingIdExtraction } from "@/hooks/useRankingIdExtraction";
import { useParams } from "react-router-dom";

const UserRankingPage = () => {
  const params = useParams();
  console.log('🔍 UserRankingPage: ========================== COMPONENT START ==========================');
  console.log('🔍 UserRankingPage: Component is rendering at:', new Date().toISOString());
  console.log('🔍 UserRankingPage: Current window.location:', {
    href: window.location.href,
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash
  });
  console.log('🔍 UserRankingPage: useParams result:', params);
  
  const { rankingId, isValidUUID, originalParams } = useRankingIdExtraction();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  console.log('🔍 UserRankingPage: Extracted ranking data:', {
    rankingId,
    isValidUUID,
    originalParams,
    currentUrl: window.location.href
  });
  
  // Only proceed with the query if we have a valid ranking ID
  const { data: ranking, isLoading, error } = useUserRanking(isValidUUID ? rankingId : undefined);

  console.log('🔍 UserRankingPage: Query results:', { 
    ranking: ranking ? {
      id: ranking.id,
      title: ranking.title,
      athleteCount: ranking.athletes?.length,
      hasAthletes: !!ranking.athletes,
      firstAthlete: ranking.athletes?.[0]?.name
    } : null,
    isLoading, 
    error: error?.message
  });

  // Force scroll to top when component mounts
  useEffect(() => {
    console.log('🔍 UserRankingPage: useEffect - FORCING scroll to top on mount');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Prevent browser's automatic scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // Additional scroll when ranking data loads
  useEffect(() => {
    if (ranking) {
      console.log('🔍 UserRankingPage: useEffect - Ranking data loaded, ensuring scroll to top');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [ranking]);

  if (isLoading) {
    console.log('🔍 UserRankingPage: SHOWING LOADING STATE');
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
        <main className="container mx-auto px-4 py-8 text-center text-white flex-grow flex items-center justify-center">
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading your ranking...</p>
            <p className="text-sm text-gray-400 mt-2">Ranking ID: {rankingId}</p>
          </div>
        </main>
      </div>
    );
  }

  if (!isValidUUID || error || !ranking) {
    console.error('🔍 UserRankingPage: ERROR STATE DETECTED:', { 
      isValidUUID, 
      error: error?.message, 
      ranking: !!ranking, 
      originalId: originalParams.id,
      extractedRankingId: rankingId 
    });
    
    return (
      <RankingNotFound 
        isValidUUID={isValidUUID}
        error={error}
        rankingId={rankingId}
        originalRankingId={originalParams.id}
      />
    );
  }

  console.log('🔍 UserRankingPage: SUCCESS - Rendering ranking page for:', ranking.title);
  console.log('🔍 UserRankingPage: SUCCESS - Athletes in ranking:', ranking.athletes.map(a => `${a.position}. ${a.name}`));

  const shareUrl = window.location.href;
  const shareTitle = `${ranking.title} - WoDaGOAT Ranking`;
  const shareDescription = ranking.description || `Check out this ${ranking.categories?.name || 'sports'} GOAT ranking on WoDaGOAT!`;
  const topAthletes = ranking.athletes.slice(0, 5).map(athlete => athlete.name);
  const categoryHashtags = ranking.categories?.name ? [`#${ranking.categories.name.replace(/\s+/g, '')}`] : [];

  // Generate OG image URL for debugging
  const debugOGImageUrl = (() => {
    const pageTitle = ranking.categories?.name && ranking.profiles?.full_name 
      ? `TOP 10 ranking of ${ranking.categories.name} by ${ranking.profiles.full_name}`
      : `${ranking.title} - WoDaGOAT`;
    
    const baseTitle = encodeURIComponent(pageTitle);
    const subtitle = topAthletes.length > 0 
      ? encodeURIComponent(`Top picks: ${topAthletes.slice(0, 3).join(', ')}`)
      : encodeURIComponent(`Created by ${ranking.profiles?.full_name || 'WoDaGOAT User'}`);
    
    const cacheBust = new Date().getTime();
    return `https://og.png/api/og?title=${baseTitle}&subtitle=${subtitle}&theme=dark&width=1200&height=630&cache=${cacheBust}`;
  })();

  return (
    <>
      <RankingSEO
        title={ranking.title}
        description={shareDescription}
        categoryName={ranking.categories?.name || undefined}
        creatorName={ranking.profiles?.full_name || undefined}
        topAthletes={topAthletes}
        url={shareUrl}
      />
      
      <div className="min-h-screen text-white flex flex-col" style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}>
        <main className="container mx-auto px-4 py-8 flex-grow">
          <RankingPageActions onShareClick={() => setShareDialogOpen(true)} />
          <RankingHeader title={ranking.title} createdAt={ranking.created_at} />

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

              <div className="mt-6">
                <SocialActions rankingId={ranking.id} />
              </div>
            </div>

            <aside className="space-y-8">
              <RankingMetadata
                description={ranking.description}
                profiles={ranking.profiles}
                userId={ranking.user_id}
                categories={ranking.categories}
                categoryId={ranking.category_id}
              />
            </aside>
          </div>
        </main>
      </div>

      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        url={shareUrl}
        text={shareDescription}
        title={shareTitle}
        description={shareDescription}
        hashtags={categoryHashtags}
        isRanking={true}
        topAthletes={topAthletes}
        categoryName={ranking.categories?.name || undefined}
      />

      <SocialPreviewDebug
        url={shareUrl}
        title={ranking.categories?.name && ranking.profiles?.full_name 
          ? `TOP 10 ranking of ${ranking.categories.name} by ${ranking.profiles.full_name}`
          : `${ranking.title} - WoDaGOAT`}
        description={shareDescription}
        imageUrl={debugOGImageUrl}
      />
    </>
  );
};

console.log('🔍 UserRankingPage: Component definition complete');

export default UserRankingPage;


import { useState, useEffect } from "react";
import { useUserRanking } from "@/hooks/useUserRanking";
import RankingSEO from "@/components/seo/RankingSEO";
import SocialPreviewDebug from "@/components/seo/SocialPreviewDebug";
import RankingNotFound from "@/components/ranking/RankingNotFound";
import UserRankingPageHeader from "@/components/ranking/UserRankingPageHeader";
import UserRankingContent from "@/components/ranking/UserRankingContent";
import UserRankingPageLayout from "@/components/ranking/UserRankingPageLayout";
import UserRankingLoadingState from "@/components/ranking/UserRankingLoadingState";
import UserRankingShareDialog from "@/components/ranking/UserRankingShareDialog";
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
    return <UserRankingLoadingState rankingId={rankingId} />;
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
      
      <UserRankingPageLayout>
        <UserRankingPageHeader
          title={ranking.title}
          createdAt={ranking.created_at}
          onShareClick={() => setShareDialogOpen(true)}
        />
        <UserRankingContent ranking={ranking} />
      </UserRankingPageLayout>

      <UserRankingShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        shareUrl={shareUrl}
        shareTitle={shareTitle}
        shareDescription={shareDescription}
        categoryHashtags={categoryHashtags}
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

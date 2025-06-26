
import { Helmet } from "react-helmet-async";

interface RankingSEOProps {
  title: string;
  description?: string;
  categoryName?: string;
  creatorName?: string;
  topAthletes?: string[];
  url: string;
}

const RankingSEO = ({ 
  title, 
  description, 
  categoryName, 
  creatorName, 
  topAthletes = [], 
  url 
}: RankingSEOProps) => {
  // Create the new title format: "TOP 10 ranking of [category] by [username]"
  const pageTitle = categoryName && creatorName 
    ? `TOP 10 ranking of ${categoryName} by ${creatorName}`
    : `${title} - WoDaGOAT`;
  
  const pageDescription = description || 
    `${creatorName ? `${creatorName}'s ` : ''}${categoryName || 'Sports'} GOAT ranking on WoDaGOAT. ${
      topAthletes.length > 0 ? `Featuring ${topAthletes.slice(0, 3).join(', ')} and more.` : ''
    } Join the sports debate!`;
  
  const keywords = [
    'sports ranking',
    'GOAT debate',
    'athletes ranking',
    categoryName,
    ...topAthletes.slice(0, 5),
    'WoDaGOAT'
  ].filter(Boolean).join(', ');

  // Generate dynamic OG image URL for the ranking
  const generateOGImageUrl = () => {
    // Create a more robust OG image with fallback options
    const baseTitle = encodeURIComponent(pageTitle);
    const subtitle = topAthletes.length > 0 
      ? encodeURIComponent(`Top picks: ${topAthletes.slice(0, 3).join(', ')}`)
      : encodeURIComponent(`Created by ${creatorName || 'WoDaGOAT User'}`);
    
    // Add cache busting parameter
    const cacheBust = new Date().getTime();
    
    // Use og.png service for better reliability
    const ogImageUrl = `https://og.png/api/og?title=${baseTitle}&subtitle=${subtitle}&theme=dark&width=1200&height=630&cache=${cacheBust}`;
    
    return ogImageUrl;
  };

  const ogImageUrl = generateOGImageUrl();

  // Debug logging (will show in console)
  console.log('RankingSEO Debug Info:', {
    pageTitle,
    pageDescription,
    ogImageUrl,
    categoryName,
    creatorName,
    topAthletes: topAthletes.slice(0, 3),
    currentUrl: url
  });

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:site_name" content="WoDaGOAT" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={url} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content={`${pageTitle} - WoDaGOAT ranking preview`} />
        
        {/* Additional meta tags for better compatibility */}
        <meta name="author" content={creatorName || 'WoDaGOAT Community'} />
        <meta name="robots" content="index, follow" />
        <meta property="article:author" content={creatorName || 'WoDaGOAT User'} />
        <meta property="article:section" content="Sports" />
        <meta property="article:tag" content={categoryName || 'GOAT Rankings'} />
        <link rel="canonical" href={url} />
        
        {/* Cache control for better social media refresh */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        
        {/* Enhanced structured data for rankings */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": pageTitle,
            "description": pageDescription,
            "image": ogImageUrl,
            "author": {
              "@type": "Person",
              "name": creatorName || "WoDaGOAT User"
            },
            "publisher": {
              "@type": "Organization",
              "name": "WoDaGOAT",
              "logo": {
                "@type": "ImageObject",
                "url": ogImageUrl
              }
            },
            "url": url,
            "keywords": keywords,
            "genre": "Sports",
            "about": {
              "@type": "Thing",
              "name": categoryName || "Sports",
              "description": `GOAT ranking for ${categoryName || 'sports'}`
            },
            "mentions": topAthletes.slice(0, 5).map(athlete => ({
              "@type": "Person",
              "name": athlete
            })),
            "datePublished": new Date().toISOString(),
            "dateModified": new Date().toISOString()
          })}
        </script>
      </Helmet>
      
      {/* Debug section - only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          position: 'fixed', 
          bottom: '10px', 
          left: '10px', 
          background: 'rgba(0,0,0,0.8)', 
          color: 'white', 
          padding: '10px', 
          fontSize: '12px',
          zIndex: 9999,
          maxWidth: '300px'
        }}>
          <strong>SEO Debug:</strong><br/>
          Title: {pageTitle}<br/>
          OG Image: <a href={ogImageUrl} target="_blank" rel="noopener noreferrer" style={{color: 'yellow'}}>
            Test Image
          </a>
        </div>
      )}
    </>
  );
};

export default RankingSEO;

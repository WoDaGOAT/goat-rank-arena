
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
    const baseUrl = 'https://og-image.vercel.app';
    const encodedTitle = encodeURIComponent(pageTitle);
    const encodedTopAthletes = topAthletes.length > 0 
      ? encodeURIComponent(`Top picks: ${topAthletes.slice(0, 3).join(', ')}`)
      : '';
    
    return `${baseUrl}/${encodedTitle}.png?theme=dark&md=1&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fvercel-triangle-white.svg${encodedTopAthletes ? `&subtitle=${encodedTopAthletes}` : ''}`;
  };

  const ogImageUrl = generateOGImageUrl();

  return (
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
      <meta property="og:site_name" content="WoDaGOAT" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={pageDescription} />
      <meta property="twitter:image" content={ogImageUrl} />
      
      {/* Additional meta tags */}
      <meta name="author" content={creatorName || 'WoDaGOAT Community'} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
      
      {/* Enhanced structured data for rankings */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": pageTitle,
          "description": pageDescription,
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
          "image": ogImageUrl,
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
          }))
        })}
      </script>
    </Helmet>
  );
};

export default RankingSEO;

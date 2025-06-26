
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
  const pageTitle = `${title} - WoDaGOAT`;
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
      <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
      <meta property="og:site_name" content="WoDaGOAT" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={pageDescription} />
      <meta property="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
      
      {/* Additional meta tags */}
      <meta name="author" content={creatorName || 'WoDaGOAT Community'} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
      
      {/* Structured data */}
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
              "url": "https://lovable.dev/opengraph-image-p98pqg.png"
            }
          },
          "url": url,
          "image": "https://lovable.dev/opengraph-image-p98pqg.png",
          "keywords": keywords,
          "genre": "Sports"
        })}
      </script>
    </Helmet>
  );
};

export default RankingSEO;

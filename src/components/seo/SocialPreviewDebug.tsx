
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ExternalLink, RefreshCw } from "lucide-react";

interface SocialPreviewDebugProps {
  url: string;
  title: string;
  description: string;
  imageUrl: string;
}

const SocialPreviewDebug = ({ url, title, description, imageUrl }: SocialPreviewDebugProps) => {
  const [isVisible, setIsVisible] = useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const socialDebugTools = [
    {
      name: "Facebook Sharing Debugger",
      url: `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(url)}`
    },
    {
      name: "Twitter Card Validator",
      url: `https://cards-dev.twitter.com/validator`
    },
    {
      name: "LinkedIn Post Inspector",
      url: `https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(url)}`
    }
  ];

  const handleRefreshCache = () => {
    // Force a page reload to refresh meta tags
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={() => setIsVisible(!isVisible)}
        variant="outline"
        size="sm"
        className="mb-2"
      >
        {isVisible ? 'Hide' : 'Show'} SEO Debug
      </Button>
      
      {isVisible && (
        <Card className="w-96 max-h-96 overflow-y-auto bg-gray-900 text-white border-gray-700">
          <CardHeader>
            <CardTitle className="text-sm flex items-center justify-between">
              Social Media Preview Debug
              <Button 
                onClick={handleRefreshCache}
                variant="ghost" 
                size="sm"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs text-gray-400">Title:</label>
              <Input value={title} readOnly className="text-xs bg-gray-800 border-gray-600" />
            </div>
            
            <div>
              <label className="text-xs text-gray-400">Description:</label>
              <Input value={description} readOnly className="text-xs bg-gray-800 border-gray-600" />
            </div>
            
            <div>
              <label className="text-xs text-gray-400">OG Image:</label>
              <div className="flex gap-2">
                <Input value={imageUrl} readOnly className="text-xs bg-gray-800 border-gray-600 flex-1" />
                <Button 
                  asChild 
                  variant="outline" 
                  size="sm"
                >
                  <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-xs text-gray-400 block mb-2">Test with Social Media Tools:</label>
              <div className="space-y-1">
                {socialDebugTools.map((tool) => (
                  <Button
                    key={tool.name}
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full text-xs justify-start"
                  >
                    <a href={tool.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-2" />
                      {tool.name}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SocialPreviewDebug;


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Facebook, Mail, Share } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FaWhatsapp as Whatsapp, FaTelegram as Telegram, FaXTwitter as TwitterX } from "react-icons/fa6";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  text: string;
  title?: string;
  description?: string;
  hashtags?: string[];
  isRanking?: boolean;
  topAthletes?: string[];
  categoryName?: string;
}

const SocialButton = ({ children, onClick, 'aria-label': ariaLabel, className }: { children: React.ReactNode, onClick: () => void, 'aria-label': string, className?: string }) => (
    <Button 
        size="icon" 
        variant="outline" 
        onClick={onClick} 
        aria-label={ariaLabel} 
        className={cn("h-12 w-12 rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20", className)}
    >
        {children}
    </Button>
)

export const ShareDialog = ({ 
  open, 
  onOpenChange, 
  url, 
  text, 
  title,
  description,
  hashtags = [],
  isRanking = false,
  topAthletes = [],
  categoryName 
}: ShareDialogProps) => {

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const generateShareContent = (platform: string) => {
    let shareText = text;
    
    if (isRanking) {
      const topThree = topAthletes.slice(0, 3);
      const athleteList = topThree.length > 0 ? `\n\nTop 3: ${topThree.join(', ')}` : '';
      const categoryText = categoryName ? ` in ${categoryName}` : '';
      
      switch (platform) {
        case 'twitter':
          const twitterHashtags = ['#WoDaGOAT', '#GOAT', '#SportsDebate', ...(hashtags || [])].join(' ');
          shareText = `🏆 Check out my ${categoryName || 'sports'} GOAT ranking${athleteList}\n\n${twitterHashtags}`;
          break;
        case 'facebook':
          shareText = `🏆 I just created my ${categoryName || 'sports'} GOAT ranking on WoDaGOAT!${athleteList}\n\nWhat do you think? Join the debate and create your own ranking!`;
          break;
        case 'whatsapp':
          shareText = `🏆 Hey! Check out my ${categoryName || 'sports'} GOAT ranking${athleteList}\n\nThought you might find this interesting! 🔥`;
          break;
        case 'telegram':
          shareText = `🏆 My ${categoryName || 'sports'} GOAT ranking${athleteList}\n\nJoin the sports debate on WoDaGOAT! 🔥`;
          break;
        case 'email':
          shareText = `Check out my ${categoryName || 'sports'} GOAT ranking on WoDaGOAT${athleteList}\n\nI'd love to hear your thoughts on this ranking!`;
          break;
      }
    }
    
    return shareText;
  };

  const shareOptions = [
    { 
      name: 'Twitter/X', 
      icon: <TwitterX className="h-6 w-6" />, 
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(generateShareContent('twitter'))}&url=${encodeURIComponent(url)}`
    },
    { 
      name: 'WhatsApp', 
      icon: <Whatsapp className="h-6 w-6" />, 
      href: `whatsapp://send?text=${encodeURIComponent(`${generateShareContent('whatsapp')}\n${url}`)}`
    },
    { 
      name: 'Facebook', 
      icon: <Facebook className="h-6 w-6" />, 
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(generateShareContent('facebook'))}`
    },
    { 
      name: 'Telegram', 
      icon: <Telegram className="h-6 w-6" />, 
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(generateShareContent('telegram'))}`
    },
    { 
      name: 'Email', 
      icon: <Mail className="h-6 w-6" />, 
      href: `mailto:?subject=${encodeURIComponent(title || 'Check out this ranking!')}&body=${encodeURIComponent(`${generateShareContent('email')}\n\n${url}`)}`
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>
            {isRanking ? 'Share your ranking' : 'Share this leaderboard'}
          </DialogTitle>
          <DialogDescription>
            {isRanking 
              ? 'Show off your GOAT picks and get others to join the debate!'
              : 'Anyone with this link will be able to view this page.'
            }
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input id="link" defaultValue={url} readOnly className="bg-gray-700 border-gray-600"/>
          <Button type="button" size="sm" className="px-3" onClick={copyToClipboard}>
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-around pt-4">
            {shareOptions.map(opt => (
                <a key={opt.name} href={opt.href} target="_blank" rel="noopener noreferrer">
                    <SocialButton onClick={() => {}} aria-label={`Share on ${opt.name}`}>
                        {opt.icon}
                    </SocialButton>
                </a>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

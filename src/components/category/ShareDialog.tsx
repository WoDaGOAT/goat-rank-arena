import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Facebook, Twitter, Mail, Share } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// For brevity, I'm using Twitter icon for Telegram and Share icon for WhatsApp, as specific icons weren't available in the prompt's list
import { FaWhatsapp as Whatsapp, FaTelegram as Telegram } from "react-icons/fa";


interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  text: string;
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

export const ShareDialog = ({ open, onOpenChange, url, text }: ShareDialogProps) => {

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const shareOptions = [
    { name: 'WhatsApp', icon: <Whatsapp className="h-6 w-6" />, href: `whatsapp://send?text=${encodeURIComponent(`${text}\n${url}`)}` },
    { name: 'Facebook', icon: <Facebook className="h-6 w-6" />, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: 'Telegram', icon: <Telegram className="h-6 w-6" />, href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}` },
    { name: 'Email', icon: <Mail className="h-6 w-6" />, href: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}` },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Share this leaderboard</DialogTitle>
          <DialogDescription>
            Anyone with this link will be able to view this page.
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

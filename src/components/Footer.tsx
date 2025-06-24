
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, X } from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon';

const Footer = () => {
  return (
    <footer className="py-8 text-center text-muted-foreground border-t border-gray-700/50 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          {/* Social media icons - centered and more prominent */}
          <div className="flex gap-8">
            <a 
              href="https://www.instagram.com/wodagoatofficial/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors p-3 rounded-full hover:bg-primary/10 hover:scale-110 transform duration-200"
            >
              <Instagram className="h-10 w-10" />
            </a>
            <a 
              href="https://www.youtube.com/@WODAGOAT" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors p-3 rounded-full hover:bg-primary/10 hover:scale-110 transform duration-200"
            >
              <Youtube className="h-10 w-10" />
            </a>
            <a 
              href="https://www.tiktok.com/@wodagoatofficial" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors p-3 rounded-full hover:bg-primary/10 hover:scale-110 transform duration-200"
            >
              <TikTokIcon className="h-10 w-10" />
            </a>
            <a 
              href="https://www.facebook.com/profile.php?id=61570524337540" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors p-3 rounded-full hover:bg-primary/10 hover:scale-110 transform duration-200"
            >
              <Facebook className="h-10 w-10" />
            </a>
            <a 
              href="https://x.com/_WODAGOAT" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors p-3 rounded-full hover:bg-primary/10 hover:scale-110 transform duration-200"
            >
              <X className="h-10 w-10" />
            </a>
          </div>
          
          {/* Navigation links */}
          <div className="flex gap-6 items-center">
            <Link to="/contact" className="text-sm hover:text-primary transition-colors">Contact</Link>
            <Link to="/gdpr" className="text-sm hover:text-primary transition-colors">GDPR</Link>
            <Link to="/privacy-policy" className="text-sm hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
          
          {/* Copyright */}
          <p className="text-sm">&copy; {new Date().getFullYear()} wodagoat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

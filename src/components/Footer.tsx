
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, X } from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon';

const Footer = () => {
  return (
    <footer className="py-6 sm:py-8 text-center text-muted-foreground border-t border-gray-700/50 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          {/* Social media icons - responsive sizing */}
          <div className="flex gap-4 sm:gap-6 lg:gap-8">
            <a 
              href="https://www.instagram.com/wodagoatofficial/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-primary transition-colors p-2 sm:p-3 rounded-full hover:bg-primary/10 hover:scale-110 transform duration-200"
            >
              <Instagram className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
            </a>
            <a 
              href="https://www.youtube.com/@WODAGOAT" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-primary transition-colors p-2 sm:p-3 rounded-full hover:bg-primary/10 hover:scale-110 transform duration-200"
            >
              <Youtube className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
            </a>
            <a 
              href="https://www.tiktok.com/@wodagoatofficial" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-primary transition-colors p-2 sm:p-3 rounded-full hover:bg-primary/10 hover:scale-110 transform duration-200"
            >
              <TikTokIcon className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
            </a>
            <a 
              href="https://www.facebook.com/profile.php?id=61570524337540" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-primary transition-colors p-2 sm:p-3 rounded-full hover:bg-primary/10 hover:scale-110 transform duration-200"
            >
              <Facebook className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
            </a>
            <a 
              href="https://x.com/_WODAGOAT" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-primary transition-colors p-2 sm:p-3 rounded-full hover:bg-primary/10 hover:scale-110 transform duration-200"
            >
              <X className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
            </a>
          </div>
          
          {/* Navigation links - responsive spacing */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-center">
            <Link to="/contact" className="text-sm hover:text-primary transition-colors">Contact</Link>
            <Link to="/gdpr" className="text-sm hover:text-primary transition-colors">GDPR</Link>
            <Link to="/privacy-policy" className="text-sm hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
          
          {/* Copyright */}
          <p className="text-xs sm:text-sm">&copy; {new Date().getFullYear()} wodagoat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

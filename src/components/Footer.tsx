
import { Link } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-8 text-center text-muted-foreground border-t border-gray-700/50 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm">&copy; {new Date().getFullYear()} wodagoat. All rights reserved.</p>
          <div className="flex gap-6 items-center">
            <Link to="/gdpr" className="text-sm hover:text-primary-foreground transition-colors">GDPR</Link>
            <Link to="/privacy-policy" className="text-sm hover:text-primary-foreground transition-colors">Privacy Policy</Link>
          </div>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

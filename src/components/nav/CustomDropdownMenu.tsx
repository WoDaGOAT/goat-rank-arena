
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MenuItem {
  id: string;
  name: string;
  icon: string;
  children: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}

const CustomDropdownMenu = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isMobile = useIsMobile();

  // Static menu items with predefined categories
  const menuItems: MenuItem[] = [
    {
      id: "goat",
      name: "GOAT",
      icon: "🐐",
      children: [
        { id: "goat-footballer", name: "GOAT Footballer", description: "Greatest footballer of all time" },
        { id: "goat-goalkeeper", name: "GOAT Goalkeeper", description: "Greatest goalkeeper of all time" },
        { id: "goat-defender", name: "GOAT Defender", description: "Greatest defender of all time" },
        { id: "goat-midfielder", name: "GOAT Midfielder", description: "Greatest midfielder of all time" },
        { id: "goat-forward", name: "GOAT Forward", description: "Greatest forward of all time" },
        { id: "goat-free-kick", name: "GOAT Free-Kick Taker", description: "Greatest free-kick taker of all time" },
        { id: "goat-long-shot", name: "GOAT Long Shot", description: "Greatest long shot specialist of all time" },
        { id: "goat-header", name: "GOAT Header", description: "Greatest header specialist of all time" },
        { id: "goat-skills", name: "GOAT Skills", description: "Greatest skills specialist of all time" }
      ]
    },
    {
      id: "season",
      name: "Greatest of This Season",
      icon: "🏆",
      children: [
        { id: "season-footballer", name: "GOAT Footballer (Season)", description: "Best footballer this season" },
        { id: "season-goalkeeper", name: "GOAT Goalkeeper (Season)", description: "Best goalkeeper this season" },
        { id: "season-defender", name: "GOAT Defender (Season)", description: "Best defender this season" },
        { id: "season-midfielder", name: "GOAT Midfielder (Season)", description: "Best midfielder this season" },
        { id: "season-forward", name: "GOAT Forward (Season)", description: "Best forward this season" }
      ]
    },
    {
      id: "competitions",
      name: "Competitions",
      icon: "🌍",
      children: [
        { id: "serie-a", name: "GOAT Serie A (Italy)", description: "Greatest Serie A player" },
        { id: "ligue-1", name: "GOAT Ligue 1 (France)", description: "Greatest Ligue 1 player" },
        { id: "premier-league", name: "GOAT Premier League (UK)", description: "Greatest Premier League player" },
        { id: "bundesliga", name: "GOAT Bundesliga (Germany)", description: "Greatest Bundesliga player" },
        { id: "laliga", name: "GOAT LaLiga (Spain)", description: "Greatest LaLiga player" }
      ]
    }
  ];

  // Close dropdown when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickInsideAnyDropdown = Object.values(dropdownRefs.current).some(ref => 
        ref?.contains(event.target as Node)
      );
      
      if (!isClickInsideAnyDropdown) {
        setOpenDropdown(null);
      }
    };

    const handleScroll = () => {
      setOpenDropdown(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleDropdownToggle = (itemId: string) => {
    if (isMobile) {
      setMobileMenuOpen(true);
      return;
    }
    setOpenDropdown(openDropdown === itemId ? null : itemId);
  };

  // Mobile menu overlay
  const MobileMenu = () => (
    <div className={`fixed inset-0 z-[9999] bg-black/50 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`fixed right-0 top-0 h-full w-80 max-w-[90vw] bg-gray-900 border-l border-gray-700 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Categories</h2>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto h-full pb-20">
          {menuItems.map((item) => (
            <div key={item.id} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide flex items-center gap-2">
                <span>{item.icon}</span>
                {item.name}
              </h3>
              <div className="space-y-1">
                {item.children.map((subItem) => (
                  <Link
                    key={subItem.id}
                    to={`/category/${subItem.id}`}
                    className="block p-3 rounded-lg hover:bg-gray-800 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="text-sm font-medium text-white">
                      {subItem.name}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {subItem.description || "No description"}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="w-full flex justify-center">
        {/* Mobile hamburger button */}
        <div className="block lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5" />
            <span className="text-sm font-medium">Categories</span>
          </button>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center justify-center gap-2 xl:gap-6">
          {menuItems.map((item) => {
            const isOpen = openDropdown === item.id;
            
            return (
              <div 
                key={item.id} 
                className="relative"
                ref={el => dropdownRefs.current[item.id] = el}
              >
                <button
                  onClick={() => handleDropdownToggle(item.id)}
                  className={`
                    flex items-center gap-2 px-3 xl:px-6 py-2 xl:py-3
                    text-sm xl:text-lg font-semibold text-white 
                    transition-all duration-200 rounded-lg
                    hover:bg-white/10
                    ${isOpen ? 'bg-white/20' : ''}
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="whitespace-nowrap">{item.name}</span>
                  <ChevronDown 
                    className={`w-4 h-4 xl:w-5 xl:h-5 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {isOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 z-[9999] mt-2 min-w-[600px] xl:min-w-[800px]">
                    <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                      <div className="grid grid-cols-2 xl:grid-cols-3 gap-0 p-2">
                        {item.children.map((subItem) => (
                          <Link
                            key={subItem.id}
                            to={`/category/${subItem.id}`}
                            className="block p-3 hover:bg-gray-800 transition-colors duration-200 rounded-md m-1"
                            onClick={() => setOpenDropdown(null)}
                          >
                            <div className="text-sm font-medium text-white leading-none mb-1">
                              {subItem.name}
                            </div>
                            <p className="text-xs text-gray-400 leading-snug line-clamp-2">
                              {subItem.description || "No description"}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Mobile menu */}
      <MobileMenu />
    </>
  );
};

export default CustomDropdownMenu;

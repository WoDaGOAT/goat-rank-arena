
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import React from "react";
import { Athlete, getPlaceholderImageUrl } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AthleteSearchProps {
  allAthletes: Athlete[];
  filteredAthletes: Athlete[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedLetter: string;
  setSelectedLetter: (letter: string) => void;
  addAthlete: (athlete: Athlete) => void;
  numSelectedAthletes: number;
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const AthleteSearch: React.FC<AthleteSearchProps> = ({
  allAthletes,
  filteredAthletes,
  searchTerm,
  setSearchTerm,
  selectedLetter,
  setSelectedLetter,
  addAthlete,
  numSelectedAthletes,
}) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-3 sm:p-4 md:p-6">
    <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
      Search Athletes ({allAthletes.length} available)
    </h2>

    {/* Search Input */}
    <div className="relative mb-3 sm:mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for athletes..."
        className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-gray-400 text-sm sm:text-base"
      />
    </div>

    {/* Alphabetical Filter */}
    <div className="mb-3 sm:mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-white text-xs sm:text-sm font-medium">Filter by letter:</span>
        <Button
          onClick={() => setSelectedLetter("")}
          size="sm"
          variant="outline"
          className={
            selectedLetter === ""
              ? "bg-white/20 border-white text-white hover:bg-white/30 h-7 sm:h-8 px-2 text-xs sm:text-sm"
              : "bg-transparent border-white text-white hover:bg-white/10 h-7 sm:h-8 px-2 text-xs sm:text-sm"
          }
        >
          All
        </Button>
      </div>
      <div className="grid grid-cols-9 sm:grid-cols-13 gap-1">
        {alphabet.map((letter) => (
          <Button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            size="sm"
            variant="outline"
            className={
              selectedLetter === letter
                ? "bg-white/20 border-white text-white hover:bg-white/30 h-7 sm:h-8 w-full p-0 text-xs min-w-[28px] sm:min-w-[32px]"
                : "bg-transparent border-white text-white hover:bg-white/10 h-7 sm:h-8 w-full p-0 text-xs min-w-[28px] sm:min-w-[32px]"
            }
          >
            {letter}
          </Button>
        ))}
      </div>
    </div>

    {/* Search Results */}
    <div className="space-y-2 max-h-80 sm:max-h-96 overflow-y-auto">
      {filteredAthletes.map((athlete) => (
        <div
          key={athlete.id}
          className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-white/30">
              <AvatarImage src={getPlaceholderImageUrl(athlete.imageUrl)} alt={athlete.name} />
              <AvatarFallback className="bg-white/20 text-white text-xs sm:text-sm">
                {athlete.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-white text-sm sm:text-base truncate">{athlete.name}</div>
            </div>
          </div>
          <Button
            onClick={() => addAthlete(athlete)}
            size="sm"
            variant="cta"
            className="ml-2 shrink-0 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
            disabled={numSelectedAthletes >= 10}
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> 
            <span className="hidden sm:inline">Add</span>
            <span className="sm:hidden">+</span>
          </Button>
        </div>
      ))}
      {searchTerm && filteredAthletes.length === 0 && (
        <div className="text-center py-6 sm:py-8 text-gray-400 text-sm sm:text-base">
          No athletes found matching "{searchTerm}"
        </div>
      )}
      {selectedLetter && !searchTerm && filteredAthletes.length === 0 && (
        <div className="text-center py-6 sm:py-8 text-gray-400 text-sm sm:text-base">
          No athletes found starting with "{selectedLetter}"
        </div>
      )}
    </div>
  </div>
);

export default AthleteSearch;

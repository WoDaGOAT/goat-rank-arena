
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import React from "react";
import { Athlete } from "@/types";

interface AthleteSearchProps {
  allAthletes: Athlete[];
  filteredAthletes: Athlete[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedLetter: string;
  setSelectedLetter: (letter: string) => void;
  addAthlete: (athlete: Athlete) => void;
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
}) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6">
    <h2 className="text-xl font-semibold text-white mb-4">
      Search Athletes ({allAthletes.length} available)
    </h2>

    {/* Search Input */}
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for athletes..."
        className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-gray-400"
      />
    </div>

    {/* Alphabetical Filter */}
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-white text-sm font-medium">Filter by letter:</span>
        <Button
          onClick={() => setSelectedLetter("")}
          size="sm"
          variant="outline"
          className={
            selectedLetter === ""
              ? "bg-white/20 border-white text-white hover:bg-white/30 h-8 px-2"
              : "bg-transparent border-white text-white hover:bg-white/10 h-8 px-2"
          }
        >
          All
        </Button>
      </div>
      <div className="flex flex-wrap gap-1">
        {alphabet.map((letter) => (
          <Button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            size="sm"
            variant="outline"
            className={
              selectedLetter === letter
                ? "bg-white/20 border-white text-white hover:bg-white/30 h-8 w-8 p-0 text-xs"
                : "bg-transparent border-white text-white hover:bg-white/10 h-8 w-8 p-0 text-xs"
            }
          >
            {letter}
          </Button>
        ))}
      </div>
    </div>

    {/* Search Results */}
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {filteredAthletes.map((athlete) => (
        <div
          key={athlete.id}
          className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <img
              src={`https://images.unsplash.com/${athlete.imageUrl}?w=400&h=225&fit=crop&q=80`}
              alt={athlete.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
            />
            <div>
              <div className="font-semibold text-white">{athlete.name}</div>
              <div className="text-sm text-gray-300">
                Original: {athlete.points} pts
              </div>
            </div>
          </div>
          <Button
            onClick={() => addAthlete(athlete)}
            size="sm"
            variant="cta"
            className="min-w-[80px]"
          >
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      ))}
      {searchTerm && filteredAthletes.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No athletes found matching "{searchTerm}"
        </div>
      )}
      {selectedLetter && !searchTerm && filteredAthletes.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No athletes found starting with "{selectedLetter}"
        </div>
      )}
    </div>
  </div>
);

export default AthleteSearch;

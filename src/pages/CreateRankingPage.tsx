import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCategoryById, allAthletes } from "@/data/mockData";
import { useEffect, useState } from "react";
import { Category, Athlete } from "@/types";
import { ChevronLeft, Save, Search, Plus, X, GripVertical } from "lucide-react";
import Navbar from "@/components/Navbar";

interface SelectedAthlete extends Athlete {
  userPoints: number;
}

const CreateRankingPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [rankingTitle, setRankingTitle] = useState("");
  const [rankingDescription, setRankingDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAthletes, setSelectedAthletes] = useState<SelectedAthlete[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string>("");

  useEffect(() => {
    if (categoryId) {
      const foundCategory = getCategoryById(categoryId);
      setCategory(foundCategory);
    }
  }, [categoryId]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const filteredAthletes = allAthletes.filter(athlete => {
    const matchesSearch = athlete.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLetter = selectedLetter === "" || athlete.name.charAt(0).toUpperCase() === selectedLetter;
    const notSelected = !selectedAthletes.some(selected => selected.id === athlete.id);
    
    return matchesSearch && matchesLetter && notSelected;
  });

  const addAthlete = (athlete: Athlete) => {
    const newPosition = selectedAthletes.length + 1;
    const userPoints = Math.max(0, 100 - (newPosition - 1) * 5); // Points decrease by 5 for each position
    
    setSelectedAthletes(prev => [...prev, {
      ...athlete,
      userPoints
    }]);
    setSearchTerm(""); // Clear search after adding
  };

  const removeAthlete = (athleteId: string) => {
    setSelectedAthletes(prev => {
      const updated = prev.filter(athlete => athlete.id !== athleteId);
      // Recalculate points based on new positions
      return updated.map((athlete, index) => ({
        ...athlete,
        userPoints: Math.max(0, 100 - index * 5)
      }));
    });
  };

  const updateAthletePoints = (athleteId: string, points: number) => {
    setSelectedAthletes(prev =>
      prev.map(athlete =>
        athlete.id === athleteId ? { ...athlete, userPoints: Math.max(0, Math.min(100, points)) } : athlete
      )
    );
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedAthletes = [...selectedAthletes];
    const draggedItem = updatedAthletes[draggedIndex];
    updatedAthletes.splice(draggedIndex, 1);
    updatedAthletes.splice(index, 0, draggedItem);

    // Recalculate points based on new positions
    const reorderedWithPoints = updatedAthletes.map((athlete, idx) => ({
      ...athlete,
      userPoints: Math.max(0, 100 - idx * 5)
    }));

    setSelectedAthletes(reorderedWithPoints);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (!category) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Category Not Found</h1>
          <p className="text-gray-300 mb-6">The category you're looking for doesn't exist or couldn't be loaded.</p>
          <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-900">
            <Link to="/">
              <ChevronLeft className="mr-2 h-4 w-4" /> Go Back to Categories
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            asChild 
            size="lg"
            className="bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white hover:bg-white/30 hover:border-white/60 shadow-lg transition-all duration-200 font-semibold"
          >
            <Link to={`/category/${categoryId}`}>
              <ChevronLeft className="mr-2 h-5 w-5" /> Back to {category.name}
            </Link>
          </Button>
        </div>

        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2">Create Your Ranking</h1>
          <p className="text-lg text-gray-300">Search from over 60 football legends and modern stars - from Pelé to Mbappé</p>
        </header>

        <div className="max-w-6xl mx-auto">
          {/* Ranking Details Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Ranking Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-white">Ranking Title</Label>
                <Input
                  id="title"
                  value={rankingTitle}
                  onChange={(e) => setRankingTitle(e.target.value)}
                  placeholder="Give your ranking a title..."
                  className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-white">Description (Optional)</Label>
                <Input
                  id="description"
                  value={rankingDescription}
                  onChange={(e) => setRankingDescription(e.target.value)}
                  placeholder="Explain your ranking criteria..."
                  className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column: Search & Add Athletes */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Search Athletes ({allAthletes.length} available)</h2>
              
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
                    className={selectedLetter === "" 
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
                      className={selectedLetter === letter 
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
                {filteredAthletes.slice(0, 10).map((athlete) => (
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
                        <div className="text-sm text-gray-300">Original: {athlete.points} pts</div>
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

            {/* Right Column: Selected Athletes Ranking */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Your Ranking ({selectedAthletes.length} athletes)
              </h2>

              {selectedAthletes.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Start by searching and adding athletes to your ranking</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedAthletes.map((athlete, index) => (
                    <div
                      key={athlete.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/20 cursor-move hover:bg-white/10 transition-colors group"
                    >
                      <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-white" />
                      
                      <div className="text-white font-bold text-lg w-8">
                        {index + 1}
                      </div>
                      
                      <img
                        src={`https://images.unsplash.com/${athlete.imageUrl}?w=400&h=225&fit=crop&q=80`}
                        alt={athlete.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                      />
                      
                      <div className="flex-1">
                        <div className="font-semibold text-white">{athlete.name}</div>
                        <div className="text-sm text-gray-300">Rank #{index + 1}</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={athlete.userPoints}
                          onChange={(e) => updateAthletePoints(athlete.id, parseInt(e.target.value) || 0)}
                          className="w-16 h-8 text-center bg-white/10 border-white/30 text-white text-sm"
                          min="0"
                          max="100"
                        />
                        <span className="text-xs text-gray-300">pts</span>
                      </div>
                      
                      <Button
                        onClick={() => removeAthlete(athlete.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Save Section */}
          <div className="flex justify-end gap-4 mt-8">
            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="border-white/40 text-white hover:bg-white/10"
            >
              <Link to={`/category/${categoryId}`}>
                Cancel
              </Link>
            </Button>
            <Button 
              size="lg"
              variant="cta"
              disabled={selectedAthletes.length < 10}
            >
              <Save className="mr-2 h-5 w-5" />
              Save Ranking ({selectedAthletes.length} athletes)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRankingPage;

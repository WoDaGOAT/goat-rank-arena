
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import allFootballPlayers from "@/data/footballPlayers";
import { useState } from "react";
import { Category, Athlete } from "@/types";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import RankingDetailsForm from "@/components/ranking/RankingDetailsForm";
import AthleteSearch from "@/components/ranking/AthleteSearch";
import RankingList from "@/components/ranking/RankingList";
import RankingActions from "@/components/ranking/RankingActions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useRankingManager } from "@/hooks/useRankingManager";
import { useAthleteSearch } from "@/hooks/useAthleteSearch";
import { useSaveRanking } from "@/hooks/useSaveRanking";

const CreateRankingPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  const { data: category, isLoading: isLoadingCategory } = useQuery<Category | null>({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId || "")
        .single();
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      if (!data) return null;
      return {
        id: data.id,
        name: data.name,
        description: data.description || "",
        userRankingCount: 0,
        leaderboard: [],
      };
    },
    enabled: !!categoryId,
  });

  const [rankingTitle, setRankingTitle] = useState("");
  const [rankingDescription, setRankingDescription] = useState("");

  const {
    selectedAthletes,
    addAthlete,
    removeAthlete,
    updateAthletePoints,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useRankingManager();
  
  const {
    searchTerm,
    setSearchTerm,
    selectedLetter,
    setSelectedLetter,
    filteredAthletes,
    resetSearch
  } = useAthleteSearch(selectedAthletes);

  const { onSave, isSaving } = useSaveRanking({ categoryId: categoryId! });

  const handleAddAthlete = (athlete: Athlete) => {
    if (addAthlete(athlete)) {
      resetSearch();
    }
  };

  const handleSave = () => {
    onSave({
      rankingTitle,
      rankingDescription,
      selectedAthletes,
    });
  };

  if (isLoadingCategory) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center text-white">
          <p>Loading category...</p>
        </div>
      </div>
    );
  }

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
          <p className="text-lg text-gray-300">Search from over 200 football legends and modern stars - from Pelé to Mbappé</p>
        </header>

        <div className="max-w-6xl mx-auto">
          <RankingDetailsForm
            rankingTitle={rankingTitle}
            setRankingTitle={setRankingTitle}
            rankingDescription={rankingDescription}
            setRankingDescription={setRankingDescription}
          />

          <div className="grid lg:grid-cols-2 gap-8">
            <AthleteSearch
              allAthletes={allFootballPlayers}
              filteredAthletes={filteredAthletes}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedLetter={selectedLetter}
              setSelectedLetter={setSelectedLetter}
              addAthlete={handleAddAthlete}
              numSelectedAthletes={selectedAthletes.length}
            />

            <RankingList
              selectedAthletes={selectedAthletes}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDragEnd={handleDragEnd}
              updateAthletePoints={updateAthletePoints}
              removeAthlete={removeAthlete}
            />
          </div>

          <RankingActions
            categoryId={categoryId!}
            disabled={selectedAthletes.length !== 10}
            saveLabel={isSaving ? "Saving..." : `Save Ranking (${selectedAthletes.length}/10)`}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateRankingPage;

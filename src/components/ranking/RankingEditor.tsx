
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import allFootballPlayers from "@/data/footballPlayers";
import { Category, Athlete } from "@/types";
import { ChevronLeft } from "lucide-react";
import RankingDetailsForm from "@/components/ranking/RankingDetailsForm";
import AthleteSearch from "@/components/ranking/AthleteSearch";
import RankingList from "@/components/ranking/RankingList";
import RankingActions from "@/components/ranking/RankingActions";
import { useRankingManager } from "@/hooks/useRankingManager";
import { useAthleteSearch } from "@/hooks/useAthleteSearch";
import { useSaveRanking } from "@/hooks/useSaveRanking";
import { useAuth } from "@/contexts/AuthContext";
import { useAthleteSelectionPersistence } from "@/hooks/useAthleteSelectionPersistence";
import { toast } from "sonner";

interface RankingEditorProps {
  category: Category;
}

const RankingEditor: React.FC<RankingEditorProps> = ({ category }) => {
  const [rankingTitle, setRankingTitle] = useState("");
  const [rankingDescription, setRankingDescription] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, openLoginDialog, savePreLoginUrl } = useAuth();
  const navigate = useNavigate();
  const { loadSelection, saveSelection, clearSelection, hasStoredSelection } = useAthleteSelectionPersistence();

  // Check for saved selection before initializing the ranking manager
  const savedSelection = loadSelection(category.id!);

  const {
    selectedAthletes,
    addAthlete,
    removeAthlete,
    updateAthletePoints,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useRankingManager(savedSelection || undefined);

  // Handle restoration of saved selection
  useEffect(() => {
    if (!isInitialized) {
      if (savedSelection && savedSelection.length > 0) {
        console.log('Restoring athlete selection on mount:', savedSelection.length, 'athletes');
        toast.success(`Your athlete selection has been restored! (${savedSelection.length} athletes)`);
        // Clear the saved selection after successful restoration
        setTimeout(() => {
          clearSelection();
        }, 500);
      }
      setIsInitialized(true);
    }
  }, [savedSelection, clearSelection, isInitialized]);

  const {
    searchTerm,
    setSearchTerm,
    selectedLetter,
    setSelectedLetter,
    filteredAthletes,
    resetSearch
  } = useAthleteSearch(selectedAthletes);

  const { onSave, isSaving } = useSaveRanking({ categoryId: category.id! });

  const handleAddAthlete = (athlete: Athlete) => {
    if (addAthlete(athlete)) {
      resetSearch();
    }
  };

  const handleSave = () => {
    if (!user) {
      // Save current selection and redirect to login
      if (selectedAthletes.length > 0) {
        console.log('Saving selection before login:', selectedAthletes.length, 'athletes');
        saveSelection(selectedAthletes, category.id!);
        toast.info("Your selection will be saved while you log in.");
      }
      savePreLoginUrl(window.location.pathname);
      openLoginDialog();
      return;
    }

    onSave({
      rankingTitle,
      rankingDescription,
      selectedAthletes,
    });
  };

  const hasErrors = selectedAthletes.some(a => !!a.error);

  return (
    <>
      <div className="mb-8">
        <Button 
          asChild 
          size="lg"
          className="bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white hover:bg-white/30 hover:border-white/60 shadow-lg transition-all duration-200 font-semibold"
        >
          <Link to={`/category/${category.id}`}>
            <ChevronLeft className="mr-2 h-5 w-5" /> Back to {category.name}
          </Link>
        </Button>
      </div>

      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-white mb-2">Create Your {category.name} Ranking</h1>
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
          categoryId={category.id!}
          disabled={selectedAthletes.length !== 10 || !rankingTitle.trim() || hasErrors}
          saveLabel={isSaving ? "Saving..." : `Save Ranking (${selectedAthletes.length}/10)`}
          onSave={handleSave}
          isSaving={isSaving}
          selectedAthleteCount={selectedAthletes.length}
        />
        {hasErrors && (
          <p className="text-right text-red-400 mt-2">
            Please fix the validation errors before saving.
          </p>
        )}
        {selectedAthletes.length === 10 && !rankingTitle.trim() && !hasErrors && (
          <p className="text-right text-yellow-400 mt-2">
            Please provide a title for your ranking to save it.
          </p>
        )}
      </div>
    </>
  );
};

export default RankingEditor;


import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { analytics } from "@/lib/analytics";
import { toast } from "sonner";

interface RankingEditorProps {
  category: Category;
}

const RankingEditor: React.FC<RankingEditorProps> = ({ category }) => {
  const [rankingTitle, setRankingTitle] = useState("");
  const [rankingDescription, setRankingDescription] = useState("");
  const [hasTrackedStart, setHasTrackedStart] = useState(false);
  const { user, openLoginDialog, savePreLoginUrl } = useAuth();
  const navigate = useNavigate();
  const { loadSelection, saveSelection, clearSelection } = useAthleteSelectionPersistence();

  // Load any saved selection first
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

  // Track ranking started event (only once per session)
  useEffect(() => {
    if (!hasTrackedStart) {
      analytics.trackStartedRanking(category.name!, category.id!);
      setHasTrackedStart(true);
    }
  }, [category.name, category.id, hasTrackedStart]);

  // Show restoration message and clear saved data if we restored a selection
  useEffect(() => {
    if (savedSelection && savedSelection.length > 0) {
      console.log('Restoring athlete selection:', savedSelection.length, 'athletes');
      toast.success(`Your athlete selection has been restored! (${savedSelection.length} athletes)`);
      // Clear the saved selection after successful restoration
      clearSelection();
    }
  }, []); // Only run once on mount

  // Auto-save selection whenever selectedAthletes changes
  useEffect(() => {
    if (selectedAthletes.length > 0) {
      console.log('Auto-saving athlete selection:', selectedAthletes.length, 'athletes');
      saveSelection(selectedAthletes, category.id!);
    } else if (selectedAthletes.length === 0) {
      // Clear saved selection if user removes all athletes
      clearSelection();
    }
  }, [selectedAthletes, saveSelection, clearSelection, category.id]);

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
      // Track athlete selection
      analytics.trackSelectedAthlete(
        athlete.name,
        athlete.id,
        selectedAthletes.length + 1, // Position will be current length + 1
        category.id!
      );
      resetSearch();
    }
  };

  const handleReorderAthletes = () => {
    // Track reordering event (debounced to avoid too many events)
    analytics.trackReorderedRanking(category.id!, selectedAthletes.length);
  };

  const handleSave = () => {
    if (!user) {
      // The selection is already auto-saved, just need to save URL and redirect to login
      console.log('Redirecting to login, selection already saved');
      savePreLoginUrl(window.location.pathname);
      openLoginDialog();
      return;
    }

    onSave({
      rankingTitle: rankingTitle.trim() || "My Ranking", // Use default title if empty
      rankingDescription,
      selectedAthletes,
    });
  };

  const hasErrors = selectedAthletes.some(a => !!a.error);

  return (
    <div className="min-h-screen flex flex-col px-3 sm:px-4 md:px-8 py-4 md:py-8">
      <div className="mb-6 md:mb-8">
        <Button 
          asChild 
          size="lg"
          className="bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white hover:bg-white/30 hover:border-white/60 shadow-lg transition-all duration-200 font-semibold text-sm sm:text-base px-3 sm:px-4 py-2"
        >
          <Link to={`/category/${category.id}`}>
            <ChevronLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Back to {category.name}
          </Link>
        </Button>
      </div>

      <header className="mb-6 md:mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2">Create Your {category.name} Ranking</h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-300">Search from over 200 football legends and modern stars - from Pelé to Mbappé</p>
      </header>

      <div className="max-w-6xl mx-auto w-full flex-1">
        <RankingDetailsForm
          rankingTitle={rankingTitle}
          setRankingTitle={setRankingTitle}
          rankingDescription={rankingDescription}
          setRankingDescription={setRankingDescription}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <div className="order-2 lg:order-1">
            <AthleteSearch
              allAthletes={filteredAthletes}
              filteredAthletes={filteredAthletes}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedLetter={selectedLetter}
              setSelectedLetter={setSelectedLetter}
              addAthlete={handleAddAthlete}
              numSelectedAthletes={selectedAthletes.length}
            />
          </div>

          <div className="order-1 lg:order-2">
            <RankingList
              selectedAthletes={selectedAthletes}
              handleDragStart={handleDragStart}
              handleDragOver={(e, index) => {
                handleDragOver(e, index);
                handleReorderAthletes();
              }}
              handleDragEnd={handleDragEnd}
              updateAthletePoints={updateAthletePoints}
              removeAthlete={removeAthlete}
            />
          </div>
        </div>

        <RankingActions
          categoryId={category.id!}
          disabled={selectedAthletes.length !== 10 || hasErrors}
          saveLabel={isSaving ? "Saving..." : `Save Ranking (${selectedAthletes.length}/10)`}
          onSave={handleSave}
          isSaving={isSaving}
          selectedAthleteCount={selectedAthletes.length}
        />
        {hasErrors && (
          <p className="text-center sm:text-right text-red-400 mt-2 text-sm">
            Please fix the validation errors before saving.
          </p>
        )}
      </div>
    </div>
  );
};

export default RankingEditor;

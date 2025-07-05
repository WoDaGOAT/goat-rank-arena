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
import { toast } from "sonner";

interface RankingEditorProps {
  category: Category;
}

const RankingEditor: React.FC<RankingEditorProps> = ({ category }) => {
  const [rankingTitle, setRankingTitle] = useState("");
  const [rankingDescription, setRankingDescription] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, openAuthDialog, savePreLoginUrl } = useAuth();
  const navigate = useNavigate();
  
  console.log('🔍 RankingEditor - Rendering with category:', category);

  // Initialize persistence hooks with error handling
  let loadSelection: (categoryId: string) => any = () => null;
  let saveSelection: (athletes: any[], categoryId: string) => void = () => {};
  let clearSelection: () => void = () => {};

  try {
    const persistence = useAthleteSelectionPersistence();
    loadSelection = persistence.loadSelection;
    saveSelection = persistence.saveSelection;
    clearSelection = persistence.clearSelection;
  } catch (error) {
    console.warn('🔍 RankingEditor - Failed to initialize persistence:', error);
  }

  // Load any saved selection first
  const savedSelection = category?.id ? loadSelection(category.id) : null;

  const {
    selectedAthletes,
    addAthlete,
    removeAthlete,
    updateAthletePoints,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useRankingManager(savedSelection || undefined);

  // Show restoration message and clear saved data if we restored a selection
  useEffect(() => {
    if (!isInitialized && savedSelection && savedSelection.length > 0) {
      console.log('🔍 RankingEditor - Restoring athlete selection:', savedSelection.length, 'athletes');
      toast.success(`Your athlete selection has been restored! (${savedSelection.length} athletes)`);
      clearSelection();
      setIsInitialized(true);
    } else if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [savedSelection, clearSelection, isInitialized]);

  // Auto-save selection whenever selectedAthletes changes
  useEffect(() => {
    if (!isInitialized || !category?.id) return;
    
    try {
      if (selectedAthletes.length > 0) {
        console.log('🔍 RankingEditor - Auto-saving athlete selection:', selectedAthletes.length, 'athletes');
        saveSelection(selectedAthletes, category.id);
      } else if (selectedAthletes.length === 0) {
        clearSelection();
      }
    } catch (error) {
      console.warn('🔍 RankingEditor - Failed to save selection:', error);
    }
  }, [selectedAthletes, saveSelection, clearSelection, category?.id, isInitialized]);

  // Initialize search hooks with error handling
  let searchProps;
  try {
    searchProps = useAthleteSearch({ 
      excludedAthletes: selectedAthletes,
      categoryId: category?.id,
      categoryName: category?.name
    });
  } catch (error) {
    console.error('🔍 RankingEditor - Failed to initialize athlete search:', error);
    searchProps = {
      searchTerm: "",
      setSearchTerm: () => {},
      selectedLetter: "",
      setSelectedLetter: () => {},
      filteredAthletes: [],
      resetSearch: () => {}
    };
  }

  const {
    searchTerm,
    setSearchTerm,
    selectedLetter,
    setSelectedLetter,
    filteredAthletes,
    resetSearch
  } = searchProps;

  // Initialize save ranking hook with error handling
  let saveRankingProps;
  try {
    saveRankingProps = useSaveRanking({ categoryId: category?.id });
  } catch (error) {
    console.error('🔍 RankingEditor - Failed to initialize save ranking:', error);
    saveRankingProps = {
      onSave: () => {},
      isSaving: false
    };
  }

  const { onSave, isSaving } = saveRankingProps;

  const handleAddAthlete = (athlete: Athlete) => {
    try {
      if (addAthlete(athlete)) {
        resetSearch();
        // Scroll to top so user can see their ranking update
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('🔍 RankingEditor - Failed to add athlete:', error);
      toast.error('Failed to add athlete. Please try again.');
    }
  };

  const handleSave = () => {
    try {
      if (!user) {
        console.log('🔍 RankingEditor - Redirecting to login, selection already saved');
        savePreLoginUrl(window.location.pathname);
        openAuthDialog('signup');
        return;
      }

      console.log('🔍 RankingEditor - Preparing to save ranking with athletes:', selectedAthletes);
      
      // Validate that we have exactly 10 athletes with valid points
      const validAthletes = selectedAthletes.filter(athlete => 
        athlete.userPoints > 0 && athlete.userPoints <= 100 && !athlete.error
      );
      
      if (validAthletes.length !== 10) {
        toast.error("Please select exactly 10 athletes with valid points (1-100)");
        return;
      }

      onSave({
        rankingTitle: rankingTitle.trim() || "My Ranking",
        rankingDescription,
        selectedAthletes: validAthletes,
      });
    } catch (error) {
      console.error('🔍 RankingEditor - Failed to save ranking:', error);
      toast.error('Failed to save ranking. Please try again.');
    }
  };

  const hasErrors = selectedAthletes.some(a => !!a.error);
  const hasInvalidPoints = selectedAthletes.some(a => a.userPoints <= 0 || a.userPoints > 100);

  // Safety check for category
  if (!category || !category.id) {
    console.error('🔍 RankingEditor - No valid category provided');
    return (
      <div className="min-h-screen flex flex-col px-3 sm:px-4 md:px-8 py-4 md:py-8">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Category Error</h1>
            <p className="text-gray-300 mb-6">Invalid category data. Please try again.</p>
            <Button asChild>
              <Link to="/">Go Back to Categories</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
              categoryName={category.name}
            />
          </div>

          <div className="order-1 lg:order-2">
            <RankingList
              selectedAthletes={selectedAthletes}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDragEnd={handleDragEnd}
              updateAthletePoints={updateAthletePoints}
              removeAthlete={removeAthlete}
            />
          </div>
        </div>

        <RankingActions
          categoryId={category.id}
          disabled={selectedAthletes.length !== 10 || hasErrors || hasInvalidPoints}
          saveLabel={isSaving ? "Saving..." : `Save Ranking (${selectedAthletes.length}/10)`}
          onSave={handleSave}
          isSaving={isSaving}
          selectedAthleteCount={selectedAthletes.length}
        />
        {(hasErrors || hasInvalidPoints) && (
          <p className="text-center sm:text-right text-red-400 mt-2 text-sm">
            Please fix the validation errors and ensure all points are between 1-100 before saving.
          </p>
        )}
      </div>
    </div>
  );
};

export default RankingEditor;

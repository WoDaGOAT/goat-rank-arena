import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import allFootballPlayers from "@/data/footballPlayers";
import { useState } from "react";
import { Category, Athlete } from "@/types";
import { ChevronLeft, Save, Search, Plus, X, GripVertical } from "lucide-react";
import Navbar from "@/components/Navbar";
import RankingDetailsForm from "@/components/ranking/RankingDetailsForm";
import AthleteSearch from "@/components/ranking/AthleteSearch";
import RankingList from "@/components/ranking/RankingList";
import RankingActions from "@/components/ranking/RankingActions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface SelectedAthlete extends Athlete {
  userPoints: number;
}

const CreateRankingPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { user, openLoginDialog } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAthletes, setSelectedAthletes] = useState<SelectedAthlete[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string>("");

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("User not authenticated");
      }
      if (selectedAthletes.length !== 10) {
        toast.error("You must have exactly 10 athletes in your ranking.");
        throw new Error("Incorrect number of athletes");
      }
      if (!rankingTitle.trim()) {
        toast.error("Ranking title is required.");
        throw new Error("Title required");
      }

      // 1. Create the ranking entry
      const { data: rankingData, error: rankingError } = await supabase
        .from('user_rankings')
        .insert({
          user_id: user.id,
          category_id: categoryId!,
          title: rankingTitle.trim(),
          description: rankingDescription.trim(),
        })
        .select('id')
        .single();

      if (rankingError) throw rankingError;
      const rankingId = rankingData.id;

      // 2. Create the athlete entries for the ranking
      const rankingAthletes = selectedAthletes.map((athlete, index) => ({
        ranking_id: rankingId,
        athlete_id: athlete.id,
        position: index + 1,
        points: athlete.userPoints,
      }));

      const { error: athletesError } = await supabase
        .from('ranking_athletes')
        .insert(rankingAthletes);

      if (athletesError) {
        // Attempt to clean up the created ranking if athlete insertion fails
        await supabase.from('user_rankings').delete().match({ id: rankingId });
        throw athletesError;
      }
      return rankingId;
    },
    onSuccess: (rankingId) => {
      toast.success("Ranking saved successfully!");
      queryClient.invalidateQueries({ queryKey: ['category', categoryId] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard', categoryId] });
      navigate(`/category/${categoryId}`);
    },
    onError: (error: Error) => {
      if (error.message !== "User not authenticated" && error.message !== "Incorrect number of athletes" && error.message !== "Title required") {
         toast.error(error.message || "Failed to save ranking. Please try again.");
      }
    }
  });

  const handleSaveRanking = () => {
    if (!user) {
      openLoginDialog();
      toast.info("Please log in or sign up to save your ranking.");
    } else {
      saveMutation.mutate();
    }
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const filteredAthletes = allFootballPlayers.filter(athlete => {
    const matchesSearch = athlete.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLetter = selectedLetter === "" || athlete.name.charAt(0).toUpperCase() === selectedLetter;
    const notSelected = !selectedAthletes.some(selected => selected.id === athlete.id);
    
    return matchesSearch && matchesLetter && notSelected;
  });

  const addAthlete = (athlete: Athlete) => {
    if (selectedAthletes.length >= 10) {
      toast.info("You can only rank up to 10 athletes.");
      return;
    }

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
              addAthlete={addAthlete}
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
            saveLabel={saveMutation.isPending ? "Saving..." : `Save Ranking (${selectedAthletes.length}/10)`}
            onSave={handleSaveRanking}
            isSaving={saveMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateRankingPage;

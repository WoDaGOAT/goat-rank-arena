
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCategoryById } from "@/data/mockData";
import { useEffect, useState } from "react";
import { Category } from "@/types";
import { ChevronLeft, Save } from "lucide-react";
import Navbar from "@/components/Navbar";

const CreateRankingPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [rankingTitle, setRankingTitle] = useState("");
  const [rankingDescription, setRankingDescription] = useState("");

  useEffect(() => {
    if (categoryId) {
      const foundCategory = getCategoryById(categoryId);
      setCategory(foundCategory);
    }
  }, [categoryId]);

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
          <p className="text-lg text-gray-300">Rank the athletes in "{category.name}" according to your opinion</p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Ranking Details</h2>
            <div className="space-y-4">
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

          <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Drag to Rank Athletes</h2>
            <p className="text-gray-300 mb-6">Drag athletes up and down to rank them in your preferred order</p>
            
            {/* Placeholder for draggable list - will be implemented next */}
            <div className="space-y-3">
              {category.leaderboard.map((athlete, index) => (
                <div 
                  key={athlete.id}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/20 cursor-move hover:bg-white/10 transition-colors"
                >
                  <div className="text-white font-bold text-lg w-8">
                    {index + 1}
                  </div>
                  <img
                    src={`https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=225&fit=crop&q=80`}
                    alt={athlete.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-white">{athlete.name}</div>
                    <div className="text-sm text-gray-300">Drag to reorder</div>
                  </div>
                  <div className="text-gray-400">
                    ⋮⋮
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
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
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="mr-2 h-5 w-5" />
              Save Ranking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRankingPage;

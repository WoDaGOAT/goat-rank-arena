
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface RankingDetailsFormProps {
  rankingTitle: string;
  setRankingTitle: (title: string) => void;
  rankingDescription: string;
  setRankingDescription: (desc: string) => void;
}

const RankingDetailsForm: React.FC<RankingDetailsFormProps> = ({
  rankingTitle,
  setRankingTitle,
  rankingDescription,
  setRankingDescription,
}) => (
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
);

export default RankingDetailsForm;

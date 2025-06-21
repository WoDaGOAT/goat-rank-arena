
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
  <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-3 sm:p-4 md:p-6 mb-6 sm:mb-8">
    <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Ranking Details</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      <div>
        <Label htmlFor="title" className="text-white text-sm sm:text-base">Ranking Title (Optional)</Label>
        <Input
          id="title"
          value={rankingTitle}
          onChange={(e) => setRankingTitle(e.target.value)}
          placeholder="Give your ranking a title..."
          className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 mt-1 text-sm sm:text-base"
        />
      </div>
      <div>
        <Label htmlFor="description" className="text-white text-sm sm:text-base">Description (Optional)</Label>
        <Input
          id="description"
          value={rankingDescription}
          onChange={(e) => setRankingDescription(e.target.value)}
          placeholder="Explain your ranking criteria..."
          className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 mt-1 text-sm sm:text-base"
        />
      </div>
    </div>
  </div>
);

export default RankingDetailsForm;

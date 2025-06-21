
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Save } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";

interface RankingActionsProps {
  categoryId?: string;
  disabled: boolean;
  saveLabel: string;
  onSave: () => void;
  isSaving: boolean;
  selectedAthleteCount: number;
}

const commonButtonStyle =
  "h-[44px] px-6 rounded-full font-semibold text-lg leading-[44px] flex items-center justify-center py-0";

const RankingActions: React.FC<RankingActionsProps> = ({
  categoryId,
  disabled,
  saveLabel,
  onSave,
  isSaving,
  selectedAthleteCount,
}) => {
  const needsMoreAthletes = selectedAthleteCount < 10;
  const showAthleteTooltip = needsMoreAthletes && !isSaving;

  return (
    <div className="flex justify-end gap-4 mt-8">
      <Button
        asChild
        className={`bg-[#FFD9DF] text-[#AD2637] hover:bg-[#FFD0DA] shadow ${commonButtonStyle}`}
        disabled={isSaving}
      >
        <Link to={categoryId ? `/category/${categoryId}` : "/"}>
          Cancel
        </Link>
      </Button>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="cta"
              disabled={disabled || isSaving}
              onClick={onSave}
              className={`${commonButtonStyle} ${
                disabled && !isSaving 
                  ? 'opacity-50 cursor-not-allowed grayscale' 
                  : ''
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale`}
            >
              <Save className="mr-2 h-5 w-5" />
              Submit to Leaderboard
            </Button>
          </TooltipTrigger>
          {showAthleteTooltip && (
            <TooltipContent>
              <p>Select 10 athletes to enable this button.</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default RankingActions;

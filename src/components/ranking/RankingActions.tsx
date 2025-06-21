
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check } from "lucide-react";
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
  "h-[36px] sm:h-[44px] px-4 sm:px-6 rounded-full font-semibold text-sm sm:text-lg leading-[36px] sm:leading-[44px] flex items-center justify-center py-0";

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
    <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 sm:gap-4 mt-6 sm:mt-8 px-3 sm:px-0">
      <Button
        asChild
        className={`bg-[#FFD9DF] text-[#AD2637] hover:bg-[#FFD0DA] shadow ${commonButtonStyle} order-2 sm:order-1`}
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
              className={`${commonButtonStyle} order-1 sm:order-2 ${
                disabled && !isSaving 
                  ? 'opacity-50 cursor-not-allowed grayscale' 
                  : ''
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale`}
            >
              Submit to Leaderboard
              <Check className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
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

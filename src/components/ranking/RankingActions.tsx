
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";

interface RankingActionsProps {
  categoryId?: string;
  disabled: boolean;
  saveLabel: string;
}

const commonButtonStyle =
  "h-[44px] px-6 rounded-full font-semibold text-lg leading-[44px] flex items-center justify-center py-0";

const RankingActions: React.FC<RankingActionsProps> = ({
  categoryId,
  disabled,
  saveLabel,
}) => (
  <div className="flex justify-end gap-4 mt-8">
    <Button
      asChild
      className={`bg-[#FFD9DF] text-[#AD2637] hover:bg-[#FFD0DA] shadow ${commonButtonStyle}`}
    >
      <Link to={categoryId ? `/category/${categoryId}` : "/"}>
        Cancel
      </Link>
    </Button>
    <Button
      variant="cta"
      disabled={disabled}
      className={`${commonButtonStyle} disabled:h-[44px] ${disabled ? "bg-white text-[#A2A2A2] shadow-none border-0" : ""}`}
    >
      <Save className="mr-2 h-5 w-5" />
      {saveLabel}
    </Button>
  </div>
);

export default RankingActions;

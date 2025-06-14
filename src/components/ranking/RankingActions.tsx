
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";

interface RankingActionsProps {
  categoryId?: string;
  disabled: boolean;
  saveLabel: string;
}

const RankingActions: React.FC<RankingActionsProps> = ({
  categoryId,
  disabled,
  saveLabel,
}) => (
  <div className="flex justify-end gap-4 mt-8">
    <Button
      asChild
      size="lg"
      className="bg-[#FFD6DA] text-[#AD2637] hover:bg-[#FFC1C9] border-none shadow-sm rounded-full"
    >
      <Link to={categoryId ? `/category/${categoryId}` : "/"}>
        Cancel
      </Link>
    </Button>
    <Button
      size="lg"
      variant="cta"
      disabled={disabled}
    >
      <Save className="mr-2 h-5 w-5" />
      {saveLabel}
    </Button>
  </div>
);

export default RankingActions;

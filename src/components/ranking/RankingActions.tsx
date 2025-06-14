
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
      className="bg-[#FFD9DF] text-[#AD2637] hover:bg-[#FFD0DA] rounded-full h-[44px] px-6 font-semibold text-lg shadow"
    >
      <Link to={categoryId ? `/category/${categoryId}` : "/"}>
        Cancel
      </Link>
    </Button>
    <Button
      size="lg"
      variant="cta"
      disabled={disabled}
      className="rounded-full"
    >
      <Save className="mr-2 h-5 w-5" />
      {saveLabel}
    </Button>
  </div>
);

export default RankingActions;



import { ShareDialog } from "@/components/category/ShareDialog";

interface UserRankingShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
  shareTitle: string;
  shareDescription: string;
  categoryHashtags: string[];
  topAthletes: string[];
  categoryName?: string;
}

const UserRankingShareDialog = ({
  open,
  onOpenChange,
  shareUrl,
  shareTitle,
  shareDescription,
  categoryHashtags,
  topAthletes,
  categoryName
}: UserRankingShareDialogProps) => {
  return (
    <ShareDialog
      open={open}
      onOpenChange={onOpenChange}
      url={shareUrl}
      text={shareDescription}
      title={shareTitle}
      description={shareDescription}
      hashtags={categoryHashtags}
      isRanking={true}
      topAthletes={topAthletes}
      categoryName={categoryName}
    />
  );
};

export default UserRankingShareDialog;


import { useEffect } from "react";
import RankingHeader from "./RankingHeader";
import RankingPageActions from "./RankingPageActions";

interface UserRankingPageHeaderProps {
  title: string;
  createdAt: string;
  onShareClick: () => void;
}

const UserRankingPageHeader = ({ title, createdAt, onShareClick }: UserRankingPageHeaderProps) => {
  // Force scroll to top when component mounts
  useEffect(() => {
    console.log('🔍 UserRankingPageHeader: useEffect - FORCING scroll to top on mount');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Prevent browser's automatic scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <>
      <RankingPageActions onShareClick={onShareClick} />
      <RankingHeader title={title} createdAt={createdAt} />
    </>
  );
};

export default UserRankingPageHeader;

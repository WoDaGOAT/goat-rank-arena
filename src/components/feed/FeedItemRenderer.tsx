
import { memo } from 'react';
import { NewUserFeedData } from './items/NewUserFeedItem';
import NewUserFeedItem from './items/NewUserFeedItem';
import { NewCommentFeedData } from './items/NewCommentFeedItem';
import NewCommentFeedItem from './items/NewCommentFeedItem';
import { AcceptedFriendshipFeedData } from './items/AcceptedFriendshipFeedItem';
import AcceptedFriendshipFeedItem from './items/AcceptedFriendshipFeedItem';
import { NewRankingFeedData } from './items/NewRankingFeedItem';
import NewRankingFeedItem from './items/NewRankingFeedItem';
import { QuizCompletedFeedData } from './items/QuizCompletedFeedItem';
import QuizCompletedFeedItem from './items/QuizCompletedFeedItem';
import { BadgeEarnedFeedData } from './items/BadgeEarnedFeedItem';
import BadgeEarnedFeedItem from './items/BadgeEarnedFeedItem';
import { RankingReactionFeedData } from './items/RankingReactionFeedItem';
import OptimizedRankingReactionFeedItem from './items/OptimizedRankingReactionFeedItem';

type FeedItemData = NewUserFeedData | NewCommentFeedData | AcceptedFriendshipFeedData | NewRankingFeedData | QuizCompletedFeedData | BadgeEarnedFeedData | RankingReactionFeedData;

export interface FeedItemType {
  id: string;
  created_at: string;
  type: 'new_user' | 'new_comment' | 'accepted_friendship' | 'new_ranking' | 'quiz_completed' | 'badge_earned' | 'ranking_reaction';
  data: FeedItemData;
}

// Type guard to ensure feed item has correct type
function isValidFeedItemType(type: string): type is 'new_user' | 'new_comment' | 'accepted_friendship' | 'new_ranking' | 'quiz_completed' | 'badge_earned' | 'ranking_reaction' {
  return ['new_user', 'new_comment', 'accepted_friendship', 'new_ranking', 'quiz_completed', 'badge_earned', 'ranking_reaction'].includes(type);
}

interface FeedItemRendererProps {
  item: {
    id: string;
    created_at: string;
    type: string;
    data: FeedItemData;
  };
}

const FeedItemRenderer = memo(({ item }: FeedItemRendererProps) => {
  console.log('FeedItemRenderer received item:', item);
  
  // Type guard to ensure we only render valid feed item types
  if (!isValidFeedItemType(item.type)) {
    console.warn(`Unknown feed item type: ${item.type}`);
    return null;
  }

  const typedItem: FeedItemType = {
    ...item,
    type: item.type
  };

  try {
    switch (typedItem.type) {
      case 'new_user':
        return <NewUserFeedItem data={typedItem.data as NewUserFeedData} createdAt={typedItem.created_at} />;
      case 'new_comment':
        return <NewCommentFeedItem data={typedItem.data as NewCommentFeedData} createdAt={typedItem.created_at} />;
      case 'accepted_friendship':
        return <AcceptedFriendshipFeedItem data={typedItem.data as AcceptedFriendshipFeedData} createdAt={typedItem.created_at} />;
      case 'new_ranking':
        console.log('Rendering new_ranking item with data:', typedItem.data);
        return <NewRankingFeedItem data={typedItem.data as NewRankingFeedData} createdAt={typedItem.created_at} />;
      case 'quiz_completed':
        return <QuizCompletedFeedItem data={typedItem.data as QuizCompletedFeedData} createdAt={typedItem.created_at} />;
      case 'badge_earned':
        return <BadgeEarnedFeedItem data={typedItem.data as BadgeEarnedFeedData} createdAt={typedItem.created_at} />;
      case 'ranking_reaction':
        console.log('Rendering ranking_reaction item with data:', typedItem.data);
        return <OptimizedRankingReactionFeedItem data={typedItem.data as RankingReactionFeedData} createdAt={typedItem.created_at} />;
      default:
        return null;
    }
  } catch (error) {
    console.error('Error rendering feed item:', error, typedItem);
    return null;
  }
});

FeedItemRenderer.displayName = 'FeedItemRenderer';

export default FeedItemRenderer;

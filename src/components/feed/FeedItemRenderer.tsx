
import { NewUserFeedData } from './items/NewUserFeedItem';
import NewUserFeedItem from './items/NewUserFeedItem';
import { NewCommentFeedData } from './items/NewCommentFeedItem';
import NewCommentFeedItem from './items/NewCommentFeedItem';
import { AcceptedFriendshipFeedData } from './items/AcceptedFriendshipFeedItem';
import AcceptedFriendshipFeedItem from './items/AcceptedFriendshipFeedItem';

type FeedItemData = NewUserFeedData | NewCommentFeedData | AcceptedFriendshipFeedData;

export interface FeedItemType {
  id: string;
  created_at: string;
  type: 'new_user' | 'new_comment' | 'accepted_friendship';
  data: FeedItemData;
}

interface FeedItemRendererProps {
  item: FeedItemType;
}

const FeedItemRenderer = ({ item }: FeedItemRendererProps) => {
  switch (item.type) {
    case 'new_user':
      return <NewUserFeedItem data={item.data as NewUserFeedData} createdAt={item.created_at} />;
    case 'new_comment':
      return <NewCommentFeedItem data={item.data as NewCommentFeedData} createdAt={item.created_at} />;
    case 'accepted_friendship':
      return <AcceptedFriendshipFeedItem data={item.data as AcceptedFriendshipFeedData} createdAt={item.created_at} />;
    default:
      return null;
  }
};

export default FeedItemRenderer;

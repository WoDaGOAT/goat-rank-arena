
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { Users } from "lucide-react";

export interface ProfileInfo {
  id?: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface AcceptedFriendshipFeedData {
  requester: ProfileInfo;
  receiver: ProfileInfo;
}

interface AcceptedFriendshipFeedItemProps {
  data: AcceptedFriendshipFeedData;
  createdAt: string;
}

const AcceptedFriendshipFeedItem = ({ data, createdAt }: AcceptedFriendshipFeedItemProps) => {
  const { requester, receiver } = data;
  
  // Don't render if we don't have valid user data for both users
  if (!requester?.full_name || requester.full_name.trim() === '' || 
      !receiver?.full_name || receiver.full_name.trim() === '') {
    return null;
  }
  
  return (
    <Card className="bg-white/5 text-white border-gray-700">
      <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={requester.avatar_url || undefined} alt={requester.full_name}/>
            <AvatarFallback>{requester.full_name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Users className="w-5 h-5 text-green-400" />
          <Avatar>
            <AvatarImage src={receiver.avatar_url || undefined} alt={receiver.full_name}/>
            <AvatarFallback>{receiver.full_name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <p>
            <span className="font-bold">{requester.full_name}</span>
            {' '} and {' '}
            <span className="font-bold">{receiver.full_name}</span>
            {' '} are now friends.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AcceptedFriendshipFeedItem;

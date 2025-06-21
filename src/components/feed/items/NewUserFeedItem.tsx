
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import UserHoverCard from "../../profile/UserHoverCard";
import { Link } from "react-router-dom";

export interface NewUserFeedData {
    user_id: string;
    user_name: string | null;
    avatar_url: string | null;
}

interface NewUserFeedItemProps {
  data: NewUserFeedData;
  createdAt: string;
}

const NewUserFeedItem = ({ data, createdAt }: NewUserFeedItemProps) => {
    const user = {
        id: data.user_id,
        full_name: data.user_name,
        avatar_url: data.avatar_url,
    };
    return (
        <Card className="bg-white/5 text-white border-gray-700">
            <CardContent className="p-4 flex items-center gap-4">
                <Link to={`/users/${user.id}`}>
                    <Avatar>
                        <AvatarImage src={data.avatar_url || undefined} alt={data.user_name || 'User'}/>
                        <AvatarFallback>{data.user_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                </Link>
                <div className="flex-1">
                    <p>
                        <UserHoverCard user={user}>
                            <Link to={`/users/${user.id}`} className="font-bold hover:underline">
                                {data.user_name || 'A new user'}
                            </Link>
                        </UserHoverCard>
                        {' '} has joined wodagoat!
                    </p>
                    <p className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default NewUserFeedItem;


export interface NotificationQueryData {
  id: string;
  user_id: string;
  type: string;
  data: any;
  is_read: boolean;
  created_at: string;
}

export interface FriendshipStatusData {
  id: string;
  status: string;
}

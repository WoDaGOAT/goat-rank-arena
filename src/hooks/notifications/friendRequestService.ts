
import { supabase } from "@/integrations/supabase/client";

export const friendRequestService = {
  async acceptFriendRequest(friendshipId: string): Promise<string> {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', friendshipId);

    if (error) throw error;
    return friendshipId;
  },

  async declineFriendRequest(friendshipId: string): Promise<string> {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'declined' })
      .eq('id', friendshipId);

    if (error) throw error;
    return friendshipId;
  }
};

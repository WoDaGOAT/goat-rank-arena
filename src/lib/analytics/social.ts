
// Social Engagement Events
// Tracks comments, likes, follows, and social interactions

import { AnalyticsCore } from './core';

export class SocialAnalytics extends AnalyticsCore {
  // 👥 Social Engagement Events
  trackViewedComments(contentType: 'ranking' | 'category', contentId: string) {
    this.track('viewed_comments', {
      event_category: 'social',
      event_label: contentType,
      custom_parameters: {
        content_type: contentType,
        content_id: contentId
      }
    });
  }

  trackAddedComment(contentType: 'ranking' | 'category', contentId: string, commentLength: number) {
    this.track('added_comment', {
      event_category: 'social',
      event_label: contentType,
      value: commentLength,
      custom_parameters: {
        content_type: contentType,
        content_id: contentId,
        comment_length: commentLength
      }
    });
  }

  trackRepliedComment(parentCommentId: string, replyLength: number) {
    this.track('replied_comment', {
      event_category: 'social',
      value: replyLength,
      custom_parameters: {
        parent_comment_id: parentCommentId,
        reply_length: replyLength
      }
    });
  }

  trackLikedComment(commentId: string) {
    this.track('liked_comment', {
      event_category: 'social',
      custom_parameters: {
        comment_id: commentId
      }
    });
  }

  trackFollowedUser(followedUserId: string) {
    this.track('followed_user', {
      event_category: 'social',
      custom_parameters: {
        followed_user_id: followedUserId
      }
    });
  }
}

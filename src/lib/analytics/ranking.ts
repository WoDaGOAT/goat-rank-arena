
// Ranking Flow Events
// Tracks all ranking-related user interactions and flow completion

import { AnalyticsCore } from './core';

export class RankingAnalytics extends AnalyticsCore {
  // 🏆 Ranking Flow Events
  trackStartedRanking(categoryName: string, categoryId: string) {
    this.track('started_ranking', {
      event_category: 'ranking',
      event_label: categoryName,
      custom_parameters: {
        category_id: categoryId,
        category_name: categoryName
      }
    });
  }

  trackSelectedAthlete(athleteName: string, athleteId: string, position: number, categoryId: string) {
    this.track('selected_athlete', {
      event_category: 'ranking',
      event_label: athleteName,
      value: position,
      custom_parameters: {
        athlete_id: athleteId,
        athlete_name: athleteName,
        position: position,
        category_id: categoryId
      }
    });
  }

  trackReorderedRanking(categoryId: string, totalAthletes: number) {
    this.track('reordered_ranking', {
      event_category: 'ranking',
      value: totalAthletes,
      custom_parameters: {
        category_id: categoryId,
        total_athletes: totalAthletes
      }
    });
  }

  trackSubmittedRanking(categoryId: string, categoryName: string, athleteCount: number, timeTaken?: number) {
    this.track('submitted_ranking', {
      event_category: 'ranking',
      event_label: categoryName,
      value: athleteCount,
      custom_parameters: {
        category_id: categoryId,
        category_name: categoryName,
        athlete_count: athleteCount,
        time_taken_seconds: timeTaken
      }
    });
  }

  trackEditedRanking(rankingId: string, categoryId: string) {
    this.track('edited_ranking', {
      event_category: 'ranking',
      custom_parameters: {
        ranking_id: rankingId,
        category_id: categoryId
      }
    });
  }

  trackSharedRankingLink(rankingId: string, categoryId: string, shareMethod?: string) {
    this.track('shared_ranking_link', {
      event_category: 'social',
      event_label: shareMethod,
      custom_parameters: {
        ranking_id: rankingId,
        category_id: categoryId,
        share_method: shareMethod
      }
    });
  }

  trackViewedRankingLeaderboard(categoryId: string, categoryName: string) {
    this.track('viewed_ranking_leaderboard', {
      event_category: 'engagement',
      event_label: categoryName,
      custom_parameters: {
        category_id: categoryId,
        category_name: categoryName
      }
    });
  }
}

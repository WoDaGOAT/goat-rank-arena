
// Quiz Events
// Tracks quiz participation, performance, and engagement

import { AnalyticsCore } from './core';

export class QuizAnalytics extends AnalyticsCore {
  // 🧠 Quiz Events
  trackViewedQuiz(quizId?: string, quizTitle?: string) {
    this.track('viewed_quiz', {
      event_category: 'quiz',
      event_label: quizTitle,
      custom_parameters: {
        quiz_id: quizId,
        quiz_title: quizTitle
      }
    });
  }

  trackStartedQuiz(quizId?: string, quizTitle?: string) {
    this.track('started_quiz', {
      event_category: 'quiz',
      event_label: quizTitle,
      custom_parameters: {
        quiz_id: quizId,
        quiz_title: quizTitle
      }
    });
  }

  trackSubmittedQuizAnswers(quizId: string, quizTitle: string, score: number, totalQuestions: number, timeTaken?: number) {
    this.track('submitted_quiz_answers', {
      event_category: 'quiz',
      event_label: quizTitle,
      value: score,
      custom_parameters: {
        quiz_id: quizId,
        quiz_title: quizTitle,
        score: score,
        total_questions: totalQuestions,
        accuracy_percentage: (score / totalQuestions) * 100,
        time_taken_seconds: timeTaken
      }
    });
  }

  trackQuizScore(score: number, totalQuestions: number, quizId: string) {
    this.track('quiz_score', {
      event_category: 'quiz',
      value: score,
      custom_parameters: {
        quiz_id: quizId,
        score: score,
        total_questions: totalQuestions,
        is_perfect_score: score === totalQuestions
      }
    });
  }

  trackViewedDailyLeaderboard() {
    this.track('viewed_daily_leaderboard', {
      event_category: 'engagement'
    });
  }
}

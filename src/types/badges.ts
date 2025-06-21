
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'behavior' | 'performance' | 'streak' | 'ranking';
  requirements: {
    type: 'quiz_count' | 'streak' | 'perfect_scores' | 'accuracy' | 'daily_rank' | 'automatic';
    value?: number;
    comparison?: 'gte' | 'lte' | 'eq';
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserBadge {
  id: string;
  badge_id: string;
  user_id: string;
  earned_at: string;
  badge: Badge;
}

export interface UserStats {
  total_quizzes: number;
  current_streak: number;
  longest_streak: number;
  perfect_scores: number;
  total_correct: number;
  total_questions: number;
  accuracy_percentage: number;
  best_daily_rank?: number;
}

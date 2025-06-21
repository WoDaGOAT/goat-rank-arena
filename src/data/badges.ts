
import { Badge } from "@/types/badges";

export const BADGES: Badge[] = [
  // Behavior-Based Badges
  {
    id: 'first_quiz',
    name: 'First Quiz',
    description: 'Complete your first quiz',
    icon: '🎯',
    category: 'behavior',
    requirements: { type: 'quiz_count', value: 1, comparison: 'gte' },
    rarity: 'common'
  },
  {
    id: 'streak_3',
    name: '3-Day Streak',
    description: 'Complete quizzes for 3 consecutive days',
    icon: '🔥',
    category: 'streak',
    requirements: { type: 'streak', value: 3, comparison: 'gte' },
    rarity: 'common'
  },
  {
    id: 'streak_10',
    name: '10-Day Streak',
    description: 'Complete quizzes for 10 consecutive days',
    icon: '🚀',
    category: 'streak',
    requirements: { type: 'streak', value: 10, comparison: 'gte' },
    rarity: 'rare'
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Get 100% on a quiz',
    icon: '⭐',
    category: 'performance',
    requirements: { type: 'perfect_scores', value: 1, comparison: 'gte' },
    rarity: 'common'
  },
  {
    id: 'triple_perfect',
    name: '3 Perfect Scores',
    description: 'Achieve 3 perfect scores',
    icon: '🌟',
    category: 'performance',
    requirements: { type: 'perfect_scores', value: 3, comparison: 'gte' },
    rarity: 'rare'
  },
  {
    id: 'top_10_percent',
    name: 'Top 10%',
    description: 'Finish in the top 10% of daily rankings',
    icon: '🏆',
    category: 'ranking',
    requirements: { type: 'daily_rank', value: 10, comparison: 'lte' },
    rarity: 'epic'
  },
  {
    id: 'top_3',
    name: 'Top 3',
    description: 'Finish in the top 3 of daily rankings',
    icon: '🥉',
    category: 'ranking',
    requirements: { type: 'daily_rank', value: 3, comparison: 'lte' },
    rarity: 'epic'
  },
  {
    id: 'daily_champion',
    name: '#1 of the Day',
    description: 'Achieve the highest score of the day',
    icon: '👑',
    category: 'ranking',
    requirements: { type: 'daily_rank', value: 1, comparison: 'eq' },
    rarity: 'legendary'
  },

  // Cumulative Performance Badges
  {
    id: 'newcomer',
    name: 'Newcomer',
    description: 'Welcome to WoDaGOAT!',
    icon: '👋',
    category: 'performance',
    requirements: { type: 'automatic' },
    rarity: 'common'
  },
  {
    id: 'foot_lover',
    name: 'Foot Lover',
    description: 'Achieve 45-59.9% accuracy',
    icon: '⚽',
    category: 'performance',
    requirements: { type: 'accuracy', value: 45, comparison: 'gte' },
    rarity: 'common'
  },
  {
    id: 'expert',
    name: 'Expert',
    description: 'Achieve 60-74.9% accuracy',
    icon: '🎓',
    category: 'performance',
    requirements: { type: 'accuracy', value: 60, comparison: 'gte' },
    rarity: 'rare'
  },
  {
    id: 'legend',
    name: 'Legend',
    description: 'Achieve 75-89.9% accuracy',
    icon: '🔱',
    category: 'performance',
    requirements: { type: 'accuracy', value: 75, comparison: 'gte' },
    rarity: 'epic'
  },
  {
    id: 'goat',
    name: 'GOAT',
    description: 'Achieve 90%+ accuracy',
    icon: '🐐',
    category: 'performance',
    requirements: { type: 'accuracy', value: 90, comparison: 'gte' },
    rarity: 'legendary'
  }
];

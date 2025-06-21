
import { Badge } from "@/types/badges";
import { badgeCache } from "@/utils/badgeCache";
import { 
  Lightbulb, 
  Sparkles, 
  Trophy, 
  Shield, 
  Book,
  LucideIcon
} from "lucide-react";

// Icon mapping for badge icons
const ICON_MAP: Record<string, LucideIcon> = {
  lightbulb: Lightbulb,
  sparkles: Sparkles,
  trophy: Trophy,
  shield: Shield,
  book: Book,
};

// Rarity colors for badges
export const BADGE_RARITY_COLORS = {
  common: "text-green-400",
  rare: "text-blue-400", 
  epic: "text-purple-400",
  legendary: "text-yellow-400"
} as const;

// Background colors for rank positions (fallback when no badge)
export const RANK_BG_COLORS = [
  "bg-yellow-500/30", // 1st place
  "bg-gray-400/30",   // 2nd place  
  "bg-amber-500/30",  // 3rd place
] as const;

export const RANK_BORDER_COLORS = [
  "border-yellow-400/50", // 1st place
  "border-gray-300/50",   // 2nd place
  "border-amber-500/50",  // 3rd place
] as const;

/**
 * Get badge information by badge ID using optimized cache
 */
export function getBadgeById(badgeId: string): Badge | null {
  return badgeCache.getBadge(badgeId);
}

/**
 * Get the Lucide icon component for a badge
 */
export function getBadgeIcon(badge: Badge): LucideIcon {
  return ICON_MAP[badge.icon] || Sparkles; // Sparkles as fallback
}

/**
 * Get the color class for a badge rarity
 */
export function getBadgeRarityColor(rarity: string): string {
  return BADGE_RARITY_COLORS[rarity as keyof typeof BADGE_RARITY_COLORS] || BADGE_RARITY_COLORS.common;
}

/**
 * Get rank-based fallback icon and styling for users without badges
 */
export function getRankFallback(rank: number) {
  if (rank === 1) {
    return {
      icon: Trophy,
      bgColor: RANK_BG_COLORS[0],
      borderColor: RANK_BORDER_COLORS[0],
      textColor: "text-yellow-400",
      label: "Quiz Champion"
    };
  }
  if (rank === 2) {
    return {
      icon: Trophy,
      bgColor: RANK_BG_COLORS[1], 
      borderColor: RANK_BORDER_COLORS[1],
      textColor: "text-gray-300",
      label: "2nd Place"
    };
  }
  if (rank === 3) {
    return {
      icon: Trophy,
      bgColor: RANK_BG_COLORS[2],
      borderColor: RANK_BORDER_COLORS[2], 
      textColor: "text-amber-500",
      label: "3rd Place"
    };
  }
  
  // For ranks 4+
  return {
    icon: null,
    bgColor: "bg-gray-600/30",
    borderColor: "border-gray-500/50",
    textColor: "text-gray-300",
    label: `Rank #${rank}`
  };
}

// Pre-load badge cache on module import for better performance
badgeCache.getBadgeStats();

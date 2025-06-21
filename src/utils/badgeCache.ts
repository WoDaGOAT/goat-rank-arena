
import { Badge } from "@/types/badges";
import { BADGES } from "@/data/badges";

// Pre-computed badge lookup maps for O(1) performance
class BadgeCache {
  private static instance: BadgeCache;
  private badgeMap: Map<string, Badge>;
  private initialized = false;

  private constructor() {
    this.badgeMap = new Map();
    this.initialize();
  }

  public static getInstance(): BadgeCache {
    if (!BadgeCache.instance) {
      BadgeCache.instance = new BadgeCache();
    }
    return BadgeCache.instance;
  }

  private initialize() {
    if (this.initialized) return;
    
    // Pre-populate the badge map for instant lookups
    BADGES.forEach(badge => {
      this.badgeMap.set(badge.id, badge);
    });
    
    this.initialized = true;
    console.log(`Badge cache initialized with ${this.badgeMap.size} badges`);
  }

  public getBadge(badgeId: string): Badge | null {
    return this.badgeMap.get(badgeId) || null;
  }

  public getAllBadges(): Badge[] {
    return Array.from(this.badgeMap.values());
  }

  public getBadgesByRarity(rarity: string): Badge[] {
    return Array.from(this.badgeMap.values()).filter(badge => badge.rarity === rarity);
  }

  // Pre-compute badge statistics for dashboard
  public getBadgeStats() {
    const badges = this.getAllBadges();
    return {
      total: badges.length,
      byRarity: badges.reduce((acc, badge) => {
        acc[badge.rarity] = (acc[badge.rarity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}

// Export singleton instance
export const badgeCache = BadgeCache.getInstance();

// Backwards compatibility - update existing utility to use cache
export function getBadgeById(badgeId: string): Badge | null {
  return badgeCache.getBadge(badgeId);
}

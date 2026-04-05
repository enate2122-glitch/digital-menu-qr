export interface PlanLimits {
  maxRestaurants: number;   // -1 = unlimited
  maxCategories: number;
  maxItems: number;
  imageUploads: boolean;
  coverImage: boolean;
}

const LIMITS: Record<string, PlanLimits> = {
  professional: { maxRestaurants: 1,  maxCategories: 5,  maxItems: 30,  imageUploads: false, coverImage: false },
  growing:      { maxRestaurants: 3,  maxCategories: 15, maxItems: 100, imageUploads: true,  coverImage: true  },
  enterprise:   { maxRestaurants: -1, maxCategories: -1, maxItems: -1,  imageUploads: true,  coverImage: true  },
};

export function getLimits(plan: string): PlanLimits {
  return LIMITS[plan] ?? LIMITS['professional'];
}

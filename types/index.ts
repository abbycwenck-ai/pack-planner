export type ClothingCategory =
  | 'tops'
  | 'bottoms'
  | 'dresses'
  | 'outerwear'
  | 'shoes'
  | 'accessories'
  | 'bags';

export type ItemTag =
  | 'casual'
  | 'formal'
  | 'active'
  | 'beach'
  | 'night-out'
  | 'smart-casual'
  | 'rain'
  | 'cold-weather';

export type ActivityType =
  | 'sightseeing'
  | 'hiking'
  | 'beach'
  | 'nice-dinners'
  | 'business'
  | 'skiing'
  | 'city-walks'
  | 'outdoor-adventure';

export type ClothingItemSource = 'upload' | 'catalog';

export interface ClothingItem {
  id: string;
  tripId: string;
  name: string;
  category: ClothingCategory;
  tags: ItemTag[];
  source: ClothingItemSource;
  imageDataUrl: string | null;
  iconPath: string | null;
  iconColor: string | null;
  createdAt: string;
}

export interface TripDestination {
  city: string;
  country: string;
}

export interface Trip {
  id: string;
  name: string;
  destinations: TripDestination[];
  startDate: string;
  endDate: string;
  activities: ActivityType[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface OutfitSuggestion {
  id: string;
  tripId: string;
  label: string;
  occasion: string;
  itemIds: string[];
  aiRationale: string;
  generatedAt: string;
}

export interface GapItem {
  severity: 'critical' | 'suggested' | 'nice-to-have';
  category: ClothingCategory | 'general';
  message: string;
  suggestion: string;
}

export interface GapAnalysisResult {
  id: string;
  tripId: string;
  gaps: GapItem[];
  strengths: string[];
  generatedAt: string;
}

export interface CatalogIcon {
  id: string;
  category: ClothingCategory;
  label: string;
  path: string;
}

export interface PackPlannerStore {
  version: number;
  trips: Record<string, Trip>;
  items: Record<string, ClothingItem>;
  outfits: Record<string, OutfitSuggestion[]>;
  gapAnalyses: Record<string, GapAnalysisResult>;
}

import type { ClothingCategory, ActivityType } from '@/types';

export const CATEGORIES: { value: ClothingCategory; label: string; emoji: string }[] = [
  { value: 'tops', label: 'Tops', emoji: '👕' },
  { value: 'bottoms', label: 'Bottoms', emoji: '👖' },
  { value: 'dresses', label: 'Dresses', emoji: '👗' },
  { value: 'outerwear', label: 'Outerwear', emoji: '🧥' },
  { value: 'shoes', label: 'Shoes', emoji: '👟' },
  { value: 'accessories', label: 'Accessories', emoji: '🧣' },
  { value: 'bags', label: 'Bags', emoji: '👜' },
];

export const ACTIVITIES: { value: ActivityType; label: string }[] = [
  { value: 'sightseeing', label: 'Sightseeing' },
  { value: 'city-walks', label: 'City Walks' },
  { value: 'hiking', label: 'Hiking' },
  { value: 'beach', label: 'Beach' },
  { value: 'nice-dinners', label: 'Nice Dinners' },
  { value: 'business', label: 'Business' },
  { value: 'skiing', label: 'Skiing' },
  { value: 'outdoor-adventure', label: 'Outdoor Adventure' },
];

export const ITEM_TAGS: { value: string; label: string }[] = [
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'active', label: 'Active' },
  { value: 'beach', label: 'Beach' },
  { value: 'night-out', label: 'Night Out' },
  { value: 'smart-casual', label: 'Smart Casual' },
  { value: 'rain', label: 'Rain' },
  { value: 'cold-weather', label: 'Cold Weather' },
];

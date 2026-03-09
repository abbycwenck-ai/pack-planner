'use client';
import { ClothingItemCard } from '@/components/wardrobe/ClothingItemCard';
import type { OutfitSuggestion, ClothingItem } from '@/types';

interface Props {
  outfit: OutfitSuggestion;
  allItems: Record<string, ClothingItem>;
}

export function OutfitCard({ outfit, allItems }: Props) {
  const items = outfit.itemIds.map(id => allItems[id]).filter(Boolean);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-md transition-all">
      {/* Flat-lay item grid */}
      <div className="bg-stone-50 p-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {items.map(item => (
            <ClothingItemCard
              key={item.id}
              item={item}
              size="sm"
              showDelete={false}
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-medium text-stone-900 text-sm leading-snug">{outfit.label}</h3>
          <span className="flex-shrink-0 text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full whitespace-nowrap">
            {outfit.occasion}
          </span>
        </div>
        <p className="text-xs text-stone-500 leading-relaxed">{outfit.aiRationale}</p>
      </div>
    </div>
  );
}

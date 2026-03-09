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
    <div className="bg-white rounded-3xl border border-[#E8D5B0]/60 overflow-hidden hover:shadow-xl hover:border-[#C9A96E]/40 transition-all duration-300 group">
      {/* Accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#C9A96E] to-[#E8C4B8]" />

      {/* Flat-lay */}
      <div className="bg-[#FAF7F2] p-4 min-h-[130px] flex items-center justify-center">
        <div className="flex flex-wrap gap-2 justify-center">
          {items.map(item => (
            <ClothingItemCard key={item.id} item={item} size="sm" showDelete={false} />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 border-t border-[#F2EDE4]">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-[#1B2A4A] text-sm leading-snug">{outfit.label}</h3>
          <span className="flex-shrink-0 text-xs bg-[#F2EDE4] text-[#6B7A99] px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap border border-[#E8D5B0]/60">
            {outfit.occasion}
          </span>
        </div>
        <p className="text-xs text-[#8896B3] leading-relaxed">{outfit.aiRationale}</p>
      </div>
    </div>
  );
}

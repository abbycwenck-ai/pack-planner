'use client';
import { ClothingItemCard } from '@/components/wardrobe/ClothingItemCard';
import { useWardrobe } from '@/hooks/useWardrobe';
import { CATEGORIES } from '@/constants/categories';
import { Luggage } from 'lucide-react';
import Link from 'next/link';

interface Props {
  tripId: string;
}

export function PackingOverview({ tripId }: Props) {
  const { items, counts } = useWardrobe(tripId);
  const categoryCounts = counts();
  const totalItems = items.length;

  if (totalItems === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Luggage size={24} className="text-stone-400" />
        </div>
        <p className="text-stone-500 font-medium">Nothing packed yet</p>
        <p className="text-stone-400 text-sm mt-1">Head to the Wardrobe tab to add your items.</p>
        <Link
          href={`/trip/${tripId}/wardrobe`}
          className="mt-4 inline-block bg-stone-900 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          Go to Wardrobe
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-xl text-sm font-medium">
          <Luggage size={14} />
          <span>{totalItems} items total</span>
        </div>
        {CATEGORIES.filter(c => (categoryCounts[c.value] ?? 0) > 0).map(cat => (
          <div key={cat.value} className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-sm text-stone-700">
            <span>{cat.emoji}</span>
            <span className="font-medium">{categoryCounts[cat.value]}</span>
            <span className="text-stone-500">{cat.label.toLowerCase()}</span>
          </div>
        ))}
      </div>

      {/* Per-category collage sections */}
      {CATEGORIES.filter(cat => (categoryCounts[cat.value] ?? 0) > 0).map(cat => {
        const catItems = items.filter(i => i.category === cat.value);
        return (
          <div key={cat.value}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{cat.emoji}</span>
              <h2 className="font-semibold text-stone-900">{cat.label}</h2>
              <span className="text-sm text-stone-400">{catItems.length} item{catItems.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {catItems.map(item => (
                <ClothingItemCard key={item.id} item={item} size="sm" showDelete={false} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

'use client';
import { useState } from 'react';
import { Plus, Shirt } from 'lucide-react';
import { ClothingItemCard } from './ClothingItemCard';
import { CategoryFilter } from './CategoryFilter';
import { AddItemModal } from './AddItemModal';
import { useWardrobe } from '@/hooks/useWardrobe';
import { CATEGORIES } from '@/constants/categories';
import type { ClothingCategory } from '@/types';

interface Props {
  tripId: string;
}

export function WardrobeGrid({ tripId }: Props) {
  const { items, addItem, deleteItem, counts } = useWardrobe(tripId);
  const [activeCategory, setActiveCategory] = useState<ClothingCategory | 'all'>('all');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const filtered = activeCategory === 'all' ? items : items.filter(i => i.category === activeCategory);
  const categoryCounts = counts();

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <CategoryFilter active={activeCategory} counts={categoryCounts} onChange={setActiveCategory} />
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex-shrink-0 flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          <Plus size={15} /> Add Item
        </button>
      </div>

      {/* Summary row */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.filter(c => (categoryCounts[c.value] ?? 0) > 0).map(cat => (
            <span key={cat.value} className="text-xs text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
              {cat.emoji} {categoryCounts[cat.value]} {cat.label.toLowerCase()}
            </span>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Shirt size={24} className="text-stone-400" />
          </div>
          <p className="text-stone-500 font-medium">
            {items.length === 0 ? 'Your wardrobe is empty' : `No ${activeCategory} yet`}
          </p>
          <p className="text-stone-400 text-sm mt-1">
            {items.length === 0
              ? 'Add clothing items to start building your packing list'
              : `Add a ${activeCategory} item to get started`}
          </p>
          <button
            onClick={() => setAddModalOpen(true)}
            className="mt-4 bg-stone-900 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
          >
            Add First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {filtered.map(item => (
            <ClothingItemCard
              key={item.id}
              item={item}
              size="md"
              showDelete
              onDelete={() => deleteItem(item.id)}
            />
          ))}
          {/* Add more tile */}
          <button
            onClick={() => setAddModalOpen(true)}
            className="border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center gap-1 text-stone-300 hover:border-stone-400 hover:text-stone-500 transition-all aspect-square min-h-[112px]"
          >
            <Plus size={20} />
            <span className="text-xs">Add</span>
          </button>
        </div>
      )}

      <AddItemModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={(data) => addItem(data)}
        defaultCategory={activeCategory === 'all' ? undefined : activeCategory}
      />
    </div>
  );
}

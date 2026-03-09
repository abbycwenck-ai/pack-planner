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
          className="flex-shrink-0 flex items-center gap-2 bg-[#1B2A4A] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2D3F63] transition-colors shadow-sm"
        >
          <Plus size={15} /> Add Item
        </button>
      </div>

      {/* Summary pills */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.filter(c => (categoryCounts[c.value] ?? 0) > 0).map(cat => (
            <span key={cat.value} className="text-xs text-[#6B7A99] bg-white border border-[#E8D5B0]/60 px-3 py-1 rounded-full shadow-sm">
              {cat.emoji} <span className="font-semibold text-[#1B2A4A]">{categoryCounts[cat.value]}</span> {cat.label.toLowerCase()}
            </span>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-white border-2 border-dashed border-[#E8D5B0] rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Shirt size={26} className="text-[#C9A96E]" />
          </div>
          <p className="font-semibold text-[#1B2A4A] mb-1">
            {items.length === 0 ? 'Your wardrobe is empty' : `No ${activeCategory} added yet`}
          </p>
          <p className="text-[#8896B3] text-sm mb-5">
            {items.length === 0 ? 'Start adding pieces to build your packing list' : `Add a ${activeCategory} item to get started`}
          </p>
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-[#1B2A4A] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2D3F63] transition-colors shadow-sm"
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
          <button
            onClick={() => setAddModalOpen(true)}
            className="border-2 border-dashed border-[#E8D5B0] rounded-2xl flex flex-col items-center justify-center gap-1.5 text-[#C9A96E] hover:border-[#C9A96E] hover:bg-white transition-all aspect-square min-h-[112px] group"
          >
            <div className="w-7 h-7 rounded-lg border-2 border-current flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus size={14} />
            </div>
            <span className="text-xs font-semibold">Add</span>
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

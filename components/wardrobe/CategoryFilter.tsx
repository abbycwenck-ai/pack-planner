'use client';
import { CATEGORIES } from '@/constants/categories';
import type { ClothingCategory } from '@/types';

interface Props {
  active: ClothingCategory | 'all';
  counts: Partial<Record<ClothingCategory, number>>;
  onChange: (cat: ClothingCategory | 'all') => void;
}

export function CategoryFilter({ active, counts, onChange }: Props) {
  const total = Object.values(counts).reduce((s, n) => s + (n ?? 0), 0);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button
        onClick={() => onChange('all')}
        className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
          active === 'all'
            ? 'bg-stone-900 text-white'
            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
        }`}
      >
        All
        <span className={`text-xs ${active === 'all' ? 'text-white/70' : 'text-stone-400'}`}>{total}</span>
      </button>
      {CATEGORIES.map(cat => {
        const count = counts[cat.value] ?? 0;
        if (count === 0 && active !== cat.value) return null;
        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
              active === cat.value
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
            {count > 0 && (
              <span className={`text-xs ${active === cat.value ? 'text-white/70' : 'text-stone-400'}`}>{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

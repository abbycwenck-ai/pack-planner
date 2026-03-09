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
        className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
          active === 'all'
            ? 'bg-[#1B2A4A] text-white shadow-sm'
            : 'bg-white border border-[#E8D5B0]/80 text-[#6B7A99] hover:border-[#C9A96E]/60 hover:text-[#1B2A4A]'
        }`}
      >
        All
        <span className={`text-xs ${active === 'all' ? 'text-white/60' : 'text-[#C9A96E]'} font-bold`}>{total}</span>
      </button>
      {CATEGORIES.map(cat => {
        const count = counts[cat.value] ?? 0;
        if (count === 0 && active !== cat.value) return null;
        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              active === cat.value
                ? 'bg-[#1B2A4A] text-white shadow-sm'
                : 'bg-white border border-[#E8D5B0]/80 text-[#6B7A99] hover:border-[#C9A96E]/60 hover:text-[#1B2A4A]'
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
            {count > 0 && (
              <span className={`text-xs font-bold ${active === cat.value ? 'text-white/60' : 'text-[#C9A96E]'}`}>{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

'use client';
import { useState } from 'react';
import { CATEGORIES } from '@/constants/categories';
import { ICONS_BY_CATEGORY } from '@/constants/iconCatalog';
import { useSVGContent } from '@/hooks/useSVGContent';
import type { CatalogIcon, ClothingCategory } from '@/types';

const DEFAULT_COLORS = ['#2D2D2D', '#6B7280', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#F97316', '#14B8A6'];

interface IconButtonProps {
  icon: CatalogIcon;
  onSelect: (icon: CatalogIcon, color: string) => void;
}

function IconButton({ icon, onSelect }: IconButtonProps) {
  const svg = useSVGContent(icon.path);
  const [color, setColor] = useState('#2D2D2D');

  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-stone-200 hover:border-stone-400 hover:shadow-sm transition-all bg-white">
      <div
        className="w-14 h-14 flex items-center justify-center"
        style={{ color }}
      >
        {svg ? (
          <div
            className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div className="w-full h-full bg-stone-100 rounded-lg animate-pulse" />
        )}
      </div>

      {/* Color swatches */}
      <div className="flex gap-1 flex-wrap justify-center">
        {DEFAULT_COLORS.map(c => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-4 h-4 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-stone-900 scale-110' : 'border-transparent'}`}
            style={{ backgroundColor: c }}
          />
        ))}
        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
          className="w-4 h-4 rounded-full cursor-pointer border-0 bg-transparent"
          title="Custom color"
        />
      </div>

      <span className="text-xs text-stone-500 text-center leading-tight">{icon.label}</span>

      <button
        onClick={() => onSelect(icon, color)}
        className="w-full py-1 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-700 transition-colors"
      >
        Add
      </button>
    </div>
  );
}

interface Props {
  onSelectIcon: (icon: CatalogIcon, color: string) => void;
}

export function IconCatalog({ onSelectIcon }: Props) {
  const [activeCategory, setActiveCategory] = useState<ClothingCategory | 'all'>('all');

  const icons = activeCategory === 'all'
    ? Object.values(ICONS_BY_CATEGORY).flat()
    : (ICONS_BY_CATEGORY[activeCategory] ?? []);

  return (
    <div className="space-y-4">
      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            activeCategory === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`flex-shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeCategory === cat.value ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[360px] overflow-y-auto pr-1">
        {icons.map(icon => (
          <IconButton key={icon.id} icon={icon} onSelect={onSelectIcon} />
        ))}
      </div>
    </div>
  );
}

'use client';
import { Trash2 } from 'lucide-react';
import { useSVGContent } from '@/hooks/useSVGContent';
import type { ClothingItem } from '@/types';

interface Props {
  item: ClothingItem;
  size?: 'sm' | 'md' | 'lg';
  isSelected?: boolean;
  showDelete?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

function InlineSVG({ path, color }: { path: string; color: string }) {
  const svg = useSVGContent(path);
  if (!svg) {
    return <div className="w-full h-full bg-[#F2EDE4] rounded-xl" />;
  }
  return (
    <div
      className="w-full h-full flex items-center justify-center p-2"
      style={{ color }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export function ClothingItemCard({ item, size = 'md', isSelected, showDelete = true, onClick, onDelete }: Props) {
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36',
  };

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-200 cursor-pointer
        ${isSelected
          ? 'border-[#C9A96E] shadow-lg shadow-[#C9A96E]/20'
          : 'border-[#F2EDE4] hover:border-[#C9A96E]/40 hover:shadow-md'}
        bg-white`}
      onClick={onClick}
    >
      {/* Image area */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center bg-[#FAF7F2]`}>
        {item.source === 'upload' && item.imageDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageDataUrl}
            alt={item.name || item.category}
            className="w-full h-full object-cover"
          />
        ) : item.iconPath ? (
          <InlineSVG path={item.iconPath} color={item.iconColor ?? '#1B2A4A'} />
        ) : (
          <div className="w-full h-full bg-[#F2EDE4]" />
        )}

        {/* Delete button */}
        {showDelete && onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-[#8896B3] hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-[#F2EDE4]"
          >
            <Trash2 size={11} />
          </button>
        )}

        {/* Selected checkmark */}
        {isSelected && (
          <div className="absolute inset-0 bg-[#C9A96E]/10 flex items-end justify-end p-1.5">
            <div className="w-5 h-5 bg-[#C9A96E] rounded-full flex items-center justify-center shadow-sm">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Label */}
      {item.name && (
        <div className="px-2 py-1.5 border-t border-[#F2EDE4]">
          <p className="text-xs text-[#6B7A99] truncate text-center font-medium">{item.name}</p>
        </div>
      )}
    </div>
  );
}

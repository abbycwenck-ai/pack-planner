'use client';
import { useState } from 'react';
import { Plus, X, ChevronDown, Save } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ClothingItemCard } from '@/components/wardrobe/ClothingItemCard';
import { useSVGContent } from '@/hooks/useSVGContent';
import { CATEGORIES } from '@/constants/categories';
import type { ClothingItem, ClothingCategory } from '@/types';

// The outfit "slots" — predefined zones for each category
const OUTFIT_SLOTS: { category: ClothingCategory; label: string; emoji: string; required: boolean }[] = [
  { category: 'tops',        label: 'Top',       emoji: '👕', required: true },
  { category: 'bottoms',     label: 'Bottom',    emoji: '👖', required: false },
  { category: 'dresses',     label: 'Dress / Jumpsuit', emoji: '👗', required: false },
  { category: 'outerwear',   label: 'Outerwear', emoji: '🧥', required: false },
  { category: 'shoes',       label: 'Shoes',     emoji: '👟', required: true },
  { category: 'accessories', label: 'Accessory', emoji: '🧣', required: false },
  { category: 'bags',        label: 'Bag',       emoji: '👜', required: false },
];

interface SlotPickerProps {
  slot: typeof OUTFIT_SLOTS[number];
  items: ClothingItem[];
  selected: ClothingItem | null;
  onSelect: (item: ClothingItem | null) => void;
}

function InlineSVGSmall({ path, color }: { path: string; color: string }) {
  const svg = useSVGContent(path);
  if (!svg) return <div className="w-full h-full bg-[#F2EDE4] rounded" />;
  return (
    <div className="w-full h-full [&>svg]:w-full [&>svg]:h-full p-1"
      style={{ color }} dangerouslySetInnerHTML={{ __html: svg }} />
  );
}

function SlotPicker({ slot, items, selected, onSelect }: SlotPickerProps) {
  const [open, setOpen] = useState(false);
  const categoryItems = items.filter(i => i.category === slot.category);

  return (
    <div className="relative">
      {/* Slot button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left group
          ${selected
            ? 'border-[#C9A96E]/50 bg-white shadow-sm hover:border-[#C9A96E]'
            : slot.required
              ? 'border-dashed border-[#C9A96E]/60 bg-[#FAF7F2] hover:border-[#C9A96E] hover:bg-white slot-pulse'
              : 'border-dashed border-[#E8D5B0] bg-[#FAF7F2] hover:border-[#C9A96E]/40 hover:bg-white'
          }`}
      >
        {/* Preview */}
        <div className={`w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden
          ${selected ? 'bg-[#F2EDE4]' : 'bg-[#F2EDE4]/60'}`}>
          {selected ? (
            selected.source === 'upload' && selected.imageDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selected.imageDataUrl} alt="" className="w-full h-full object-cover" />
            ) : selected.iconPath ? (
              <InlineSVGSmall path={selected.iconPath} color={selected.iconColor ?? '#1B2A4A'} />
            ) : null
          ) : (
            <span className="text-2xl opacity-40">{slot.emoji}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-[#1B2A4A]">{slot.label}</span>
            {slot.required && !selected && (
              <span className="text-xs bg-[#C9A96E]/20 text-[#9B7A4E] px-1.5 py-0.5 rounded-full font-medium">required</span>
            )}
          </div>
          <p className="text-xs text-[#8896B3] mt-0.5 truncate">
            {selected
              ? selected.name || `${slot.label} selected`
              : categoryItems.length === 0
                ? `No ${slot.label.toLowerCase()} items — leave blank or add one`
                : `Pick a ${slot.label.toLowerCase()} (${categoryItems.length} available)`}
          </p>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {selected && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSelect(null); }}
              className="p-1 rounded-lg hover:bg-red-50 text-[#8896B3] hover:text-red-500 transition-colors"
            >
              <X size={13} />
            </button>
          )}
          <ChevronDown size={14} className={`text-[#8896B3] transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown picker */}
      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-white border border-[#E8D5B0]/60 rounded-2xl shadow-xl p-3">
          {categoryItems.length === 0 ? (
            <div className="text-center py-5">
              <span className="text-2xl">{slot.emoji}</span>
              <p className="text-sm text-[#8896B3] mt-2">No {slot.label.toLowerCase()} items in your wardrobe</p>
              <p className="text-xs text-[#C9A96E] mt-1">Go to Wardrobe tab to add some</p>
            </div>
          ) : (
            <>
              <p className="text-xs font-semibold text-[#8896B3] uppercase tracking-wider mb-2 px-1">
                Choose {slot.label}
              </p>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {categoryItems.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { onSelect(item); setOpen(false); }}
                    className={`transition-all ${selected?.id === item.id ? 'ring-2 ring-[#C9A96E] rounded-2xl' : ''}`}
                  >
                    <ClothingItemCard item={item} size="sm" showDelete={false} isSelected={selected?.id === item.id} />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  wardrobeItems: ClothingItem[];
  onSave: (data: { label: string; occasion: string; itemIds: string[]; aiRationale: string }) => void;
}

export function CreateOutfitModal({ isOpen, onClose, wardrobeItems, onSave }: Props) {
  const [label, setLabel] = useState('');
  const [occasion, setOccasion] = useState('');
  const [notes, setNotes] = useState('');
  const [selections, setSelections] = useState<Partial<Record<ClothingCategory, ClothingItem | null>>>({});

  const reset = () => { setLabel(''); setOccasion(''); setNotes(''); setSelections({}); };

  const handleClose = () => { reset(); onClose(); };

  const selectedItems = Object.values(selections).filter((i): i is ClothingItem => i != null);
  const hasTop = !!selections['tops'] || !!selections['dresses'];
  const hasShoes = !!selections['shoes'];
  const canSave = selectedItems.length >= 2 && (hasTop || selectedItems.length >= 3);

  const OCCASION_PRESETS = ['Sightseeing', 'City walk', 'Nice dinner', 'Travel day', 'Active', 'Beach', 'Casual'];

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      label: label || `My Outfit`,
      occasion: occasion || 'Custom',
      itemIds: selectedItems.map(i => i.id),
      aiRationale: notes || 'Manually curated outfit.',
    });
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Build an Outfit" size="lg">
      <div className="space-y-5">
        {/* Name & occasion */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#6B7A99] uppercase tracking-wider mb-1.5">Outfit Name</label>
            <input
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="e.g. Day 1 — Arrival"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D5B0] text-[#1B2A4A] placeholder:text-[#C5CEDD] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6B7A99] uppercase tracking-wider mb-1.5">Occasion</label>
            <input
              type="text"
              value={occasion}
              onChange={e => setOccasion(e.target.value)}
              placeholder="e.g. Sightseeing"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D5B0] text-[#1B2A4A] placeholder:text-[#C5CEDD] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40 text-sm"
            />
          </div>
        </div>

        {/* Occasion presets */}
        <div className="flex flex-wrap gap-2">
          {OCCASION_PRESETS.map(p => (
            <button key={p} type="button" onClick={() => setOccasion(p)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                occasion === p
                  ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                  : 'bg-white text-[#6B7A99] border-[#E8D5B0] hover:border-[#C9A96E]'
              }`}>
              {p}
            </button>
          ))}
        </div>

        {/* Slot pickers */}
        <div>
          <label className="block text-xs font-semibold text-[#6B7A99] uppercase tracking-wider mb-3">
            Pieces — pick what you have, leave blanks where you need something
          </label>
          <div className="space-y-2">
            {OUTFIT_SLOTS.map(slot => (
              <SlotPicker
                key={slot.category}
                slot={slot}
                items={wardrobeItems}
                selected={selections[slot.category] ?? null}
                onSelect={(item) => setSelections(prev => ({ ...prev, [slot.category]: item }))}
              />
            ))}
          </div>
        </div>

        {/* Gap warnings */}
        {selectedItems.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {!selections['tops'] && !selections['dresses'] && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                <span>⚠️</span> Missing a top or dress
              </div>
            )}
            {!selections['shoes'] && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                <span>⚠️</span> No shoes selected
              </div>
            )}
            {!selections['outerwear'] && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 text-xs font-medium">
                <span>💡</span> Consider adding an outer layer
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#6B7A99] uppercase tracking-wider mb-1.5">Notes <span className="font-normal normal-case">(optional)</span></label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Why this outfit works, when you'll wear it..."
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D5B0] text-[#1B2A4A] placeholder:text-[#C5CEDD] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40 text-sm resize-none"
          />
        </div>

        {/* Summary */}
        {selectedItems.length > 0 && (
          <div className="bg-[#FAF7F2] border border-[#E8D5B0]/60 rounded-2xl px-4 py-3">
            <p className="text-xs text-[#8896B3] font-medium">
              {selectedItems.length} piece{selectedItems.length !== 1 ? 's' : ''} selected
              {OUTFIT_SLOTS.filter(s => !selections[s.category]).length > 0 && (
                <span className="text-[#C9A96E] ml-1">
                  · {OUTFIT_SLOTS.filter(s => !selections[s.category]).length} slots left empty
                </span>
              )}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl border border-[#E8D5B0] text-[#6B7A99] font-semibold hover:bg-[#FAF7F2] transition-colors text-sm">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={selectedItems.length < 2}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1B2A4A] text-white font-semibold hover:bg-[#2D3F63] transition-colors shadow-sm text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save size={14} /> Save Outfit
          </button>
        </div>
      </div>
    </Modal>
  );
}

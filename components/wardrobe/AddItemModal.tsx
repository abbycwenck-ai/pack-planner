'use client';
import { useState } from 'react';
import { Upload, Grid3X3 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { PhotoUploader } from './PhotoUploader';
import { IconCatalog } from './IconCatalog';
import { CATEGORIES, ITEM_TAGS } from '@/constants/categories';
import { useSVGContent } from '@/hooks/useSVGContent';
import type { ClothingCategory, ItemTag, CatalogIcon } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    name: string;
    category: ClothingCategory;
    tags: ItemTag[];
    source: 'upload' | 'catalog';
    imageDataUrl?: string;
    iconPath?: string;
    iconColor?: string;
  }) => void;
  defaultCategory?: ClothingCategory;
}

type Tab = 'upload' | 'catalog';

export function AddItemModal({ isOpen, onClose, onAdd, defaultCategory }: Props) {
  const [tab, setTab] = useState<Tab>('catalog');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ClothingCategory>(defaultCategory ?? 'tops');
  const [tags, setTags] = useState<ItemTag[]>([]);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [pendingIcon, setPendingIcon] = useState<{ icon: CatalogIcon; color: string } | null>(null);

  const reset = () => {
    setName(''); setCategory(defaultCategory ?? 'tops'); setTags([]);
    setImageDataUrl(null); setPendingIcon(null);
  };

  const handleClose = () => { reset(); onClose(); };

  const toggleTag = (t: ItemTag) => {
    setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const handleIconSelect = (icon: CatalogIcon, color: string) => {
    setPendingIcon({ icon, color });
    setCategory(icon.category);
  };

  const canSubmit = tab === 'upload' ? !!imageDataUrl : !!pendingIcon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    if (tab === 'upload' && imageDataUrl) {
      onAdd({ name, category, tags, source: 'upload', imageDataUrl });
    } else if (tab === 'catalog' && pendingIcon) {
      onAdd({
        name: name || pendingIcon.icon.label,
        category: pendingIcon.icon.category,
        tags,
        source: 'catalog',
        iconPath: pendingIcon.icon.path,
        iconColor: pendingIcon.color,
      });
    }
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Item" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tabs */}
        <div className="flex gap-1 bg-stone-100 rounded-xl p-1">
          {([['catalog', Grid3X3, 'Pick an Icon'], ['upload', Upload, 'Upload Photo']] as const).map(([t, Icon, label]) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 'upload' ? (
          <PhotoUploader onImage={setImageDataUrl} />
        ) : (
          <div className="space-y-2">
            {pendingIcon && (
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="w-10 h-10" style={{ color: pendingIcon.color }}>
                  <IconPreview path={pendingIcon.icon.path} color={pendingIcon.color} />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-800">{pendingIcon.icon.label} selected</p>
                  <button type="button" onClick={() => setPendingIcon(null)}
                    className="text-xs text-stone-400 hover:text-stone-700">Change</button>
                </div>
              </div>
            )}
            {!pendingIcon && <IconCatalog onSelectIcon={handleIconSelect} />}
          </div>
        )}

        {/* Metadata */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Name <span className="text-stone-400 font-normal">(optional)</span></label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. White linen blouse"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        {tab === 'upload' && (
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    category === cat.value
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Style Tags</label>
          <div className="flex flex-wrap gap-2">
            {ITEM_TAGS.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => toggleTag(t.value as ItemTag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  tags.includes(t.value as ItemTag)
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-medium hover:bg-stone-50 transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex-1 py-2.5 rounded-xl bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add to Wardrobe
          </button>
        </div>
      </form>
    </Modal>
  );
}

function IconPreview({ path, color }: { path: string; color: string }) {
  const svg = useSVGContent(path);
  if (!svg) return <div className="w-full h-full bg-stone-100 rounded animate-pulse" />;
  return (
    <div
      className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
      style={{ color }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

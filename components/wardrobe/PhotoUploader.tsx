'use client';
import { useState, useRef } from 'react';
import { Upload, ImageIcon } from 'lucide-react';
import { compressImageToDataUrl } from '@/lib/imageUtils';

interface Props {
  onImage: (dataUrl: string) => void;
}

export function PhotoUploader({ onImage }: Props) {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setLoading(true);
    try {
      const dataUrl = await compressImageToDataUrl(file, 800, 0.75);
      setPreview(dataUrl);
      onImage(dataUrl);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div
        className={`relative border-2 border-dashed rounded-2xl transition-all cursor-pointer
          ${dragging ? 'border-stone-600 bg-stone-50' : 'border-stone-200 hover:border-stone-400 hover:bg-stone-50'}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault(); setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) processFile(file);
        }}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <div className="relative h-48 rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="w-full h-full object-contain bg-stone-50" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="text-white font-medium text-sm opacity-0 hover:opacity-100">Change photo</span>
            </div>
          </div>
        ) : (
          <div className="h-40 flex flex-col items-center justify-center gap-3 text-stone-400">
            {loading ? (
              <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-700 rounded-full animate-spin" />
            ) : (
              <>
                <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center">
                  <ImageIcon size={22} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-stone-600">Drop a photo here</p>
                  <p className="text-xs mt-0.5">or tap to browse</p>
                </div>
              </>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
        />
      </div>
    </div>
  );
}

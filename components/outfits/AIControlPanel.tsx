'use client';
import { useState } from 'react';
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { OutfitCard } from './OutfitCard';
import { GapAnalysisPanel } from './GapAnalysisPanel';
import { useWardrobe } from '@/hooks/useWardrobe';
import { useOutfits } from '@/hooks/useOutfits';
import { getStore } from '@/lib/storage';
import type { OutfitSuggestion, GapAnalysisResult, ClothingItem } from '@/types';

interface Props {
  tripId: string;
}

type AIView = 'mix' | 'gaps';

export function AIControlPanel({ tripId }: Props) {
  const { items } = useWardrobe(tripId);
  const { outfits, gapAnalysis, saveOutfits, saveGapAnalysis } = useOutfits(tripId);
  const [view, setView] = useState<AIView>('mix');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const store = getStore();
  const trip = store.trips[tripId];
  const allItemsMap = Object.fromEntries(items.map(i => [i.id, i]));

  const runMixAndMatch = async () => {
    if (!trip || items.length < 2) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/analyze-outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trip, items }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { outfits: newOutfits } = await res.json() as { outfits: Omit<OutfitSuggestion, 'id' | 'tripId' | 'generatedAt'>[] };
      saveOutfits(newOutfits);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const runGapAnalysis = async () => {
    if (!trip) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/gap-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trip, items }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json() as Pick<GapAnalysisResult, 'gaps' | 'strengths'>;
      saveGapAnalysis(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Sparkles size={24} className="text-stone-400" />
        </div>
        <p className="text-stone-500 font-medium">Add items to your wardrobe first</p>
        <p className="text-stone-400 text-sm mt-1">Then come back here for AI outfit suggestions and gap analysis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="grid sm:grid-cols-2 gap-3">
        <button
          onClick={() => { setView('mix'); runMixAndMatch(); }}
          disabled={loading}
          className="flex items-center gap-3 p-5 bg-stone-900 text-white rounded-2xl hover:bg-stone-800 transition-all text-left disabled:opacity-60 group"
        >
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="font-semibold">Mix & Match</p>
            <p className="text-sm text-stone-400">Generate outfit combos from your wardrobe</p>
          </div>
        </button>

        <button
          onClick={() => { setView('gaps'); runGapAnalysis(); }}
          disabled={loading}
          className="flex items-center gap-3 p-5 bg-white border border-stone-200 text-stone-900 rounded-2xl hover:bg-stone-50 hover:border-stone-300 transition-all text-left disabled:opacity-60"
        >
          <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle size={20} className="text-stone-600" />
          </div>
          <div>
            <p className="font-semibold">Gap Analysis</p>
            <p className="text-sm text-stone-500">Find what&apos;s missing from your packing</p>
          </div>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertCircle size={15} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-10 h-10 border-2 border-stone-200 border-t-stone-700 rounded-full animate-spin" />
          <p className="text-stone-500 text-sm">
            {view === 'mix' ? 'Building outfit combinations...' : 'Analyzing your wardrobe...'}
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && view === 'mix' && outfits.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-stone-900">{outfits.length} Outfit Ideas</h2>
            <button
              onClick={runMixAndMatch}
              className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
            >
              <RefreshCw size={13} /> Regenerate
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {outfits.map(outfit => (
              <OutfitCard key={outfit.id} outfit={outfit} allItems={allItemsMap} />
            ))}
          </div>
        </div>
      )}

      {!loading && view === 'gaps' && gapAnalysis && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-stone-900">Wardrobe Analysis</h2>
            <button
              onClick={runGapAnalysis}
              className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
            >
              <RefreshCw size={13} /> Re-analyze
            </button>
          </div>
          <GapAnalysisPanel result={gapAnalysis} />
        </div>
      )}
    </div>
  );
}

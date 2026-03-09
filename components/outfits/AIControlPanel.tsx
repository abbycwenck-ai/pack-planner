'use client';
import { useState, useEffect } from 'react';
import { Sparkles, AlertCircle, RefreshCw, Plus, Wand2 } from 'lucide-react';
import { OutfitCard } from './OutfitCard';
import { GapAnalysisPanel } from './GapAnalysisPanel';
import { CreateOutfitModal } from './CreateOutfitModal';
import { useWardrobe } from '@/hooks/useWardrobe';
import { useOutfits } from '@/hooks/useOutfits';
import { getStore } from '@/lib/storage';
import type { OutfitSuggestion, GapAnalysisResult, Trip } from '@/types';

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
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Fix SSR bug: read trip from localStorage only on client
  const [trip, setTrip] = useState<Trip | null>(null);
  useEffect(() => {
    const store = getStore();
    setTrip(store.trips[tripId] ?? null);
  }, [tripId]);

  const allItemsMap = Object.fromEntries(items.map(i => [i.id, i]));

  const runMixAndMatch = async () => {
    if (!trip || items.length < 2) return;
    setLoading(true); setError(null); setView('mix');
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
      setError(e instanceof Error ? e.message : 'Something went wrong. Check that your Anthropic API key is set in Vercel.');
    } finally {
      setLoading(false);
    }
  };

  const runGapAnalysis = async () => {
    if (!trip) return;
    setLoading(true); setError(null); setView('gaps');
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
      setError(e instanceof Error ? e.message : 'Something went wrong. Check that your Anthropic API key is set in Vercel.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-white border-2 border-dashed border-[#E8D5B0] rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Sparkles size={26} className="text-[#C9A96E]" />
        </div>
        <p className="font-semibold text-[#1B2A4A] mb-1">Add items to your wardrobe first</p>
        <p className="text-[#8896B3] text-sm">Then come back here for AI outfit suggestions and gap analysis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Hero action cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {/* AI Mix & Match */}
        <button
          onClick={runMixAndMatch}
          disabled={loading || items.length < 2}
          className="relative flex flex-col items-start gap-3 p-5 bg-[#1B2A4A] text-white rounded-3xl hover:bg-[#2D3F63] transition-all text-left disabled:opacity-50 group overflow-hidden shadow-lg"
        >
          {/* Decorative gradient orb */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#C9A96E]/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
          <div className="w-10 h-10 bg-[#C9A96E]/20 rounded-2xl flex items-center justify-center relative">
            <Wand2 size={20} className="text-[#C9A96E]" />
          </div>
          <div className="relative">
            <p className="font-bold text-base">AI Mix & Match</p>
            <p className="text-xs text-white/60 mt-0.5 leading-relaxed">Generate outfit combos from your wardrobe</p>
          </div>
        </button>

        {/* Gap Analysis */}
        <button
          onClick={runGapAnalysis}
          disabled={loading}
          className="flex flex-col items-start gap-3 p-5 bg-white border border-[#E8D5B0]/60 text-[#1B2A4A] rounded-3xl hover:border-[#C9A96E]/60 hover:shadow-lg transition-all text-left disabled:opacity-50 group"
        >
          <div className="w-10 h-10 bg-[#FAF7F2] border border-[#E8D5B0] rounded-2xl flex items-center justify-center">
            <AlertCircle size={20} className="text-[#C9A96E]" />
          </div>
          <div>
            <p className="font-bold text-base">Gap Analysis</p>
            <p className="text-xs text-[#8896B3] mt-0.5 leading-relaxed">Find what&apos;s missing from your packing</p>
          </div>
        </button>

        {/* Create Outfit manually */}
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex flex-col items-start gap-3 p-5 bg-white border-2 border-dashed border-[#E8D5B0] text-[#1B2A4A] rounded-3xl hover:border-[#C9A96E] hover:shadow-lg transition-all text-left group"
        >
          <div className="w-10 h-10 bg-[#FAF7F2] border border-[#E8D5B0] rounded-2xl flex items-center justify-center group-hover:border-[#C9A96E]/60 transition-colors">
            <Plus size={20} className="text-[#C9A96E]" />
          </div>
          <div>
            <p className="font-bold text-base">Build an Outfit</p>
            <p className="text-xs text-[#8896B3] mt-0.5 leading-relaxed">Manually pick pieces & spot gaps</p>
          </div>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm">
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Something went wrong</p>
            <p className="text-xs mt-0.5 text-rose-600">{error}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-2 border-[#E8D5B0] rounded-full" />
            <div className="absolute inset-0 border-2 border-t-[#C9A96E] rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-[#1B2A4A]">
              {view === 'mix' ? 'Building your outfits...' : 'Analyzing your wardrobe...'}
            </p>
            <p className="text-sm text-[#8896B3] mt-1">Claude is reviewing your pieces ✨</p>
          </div>
        </div>
      )}

      {/* Mix & Match Results */}
      {!loading && view === 'mix' && outfits.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-[#1B2A4A] text-lg">{outfits.length} Outfit Ideas</h2>
              <p className="text-xs text-[#8896B3] mt-0.5">Curated by AI for your trip</p>
            </div>
            <button
              onClick={runMixAndMatch}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E8D5B0] text-sm text-[#6B7A99] font-medium hover:border-[#C9A96E] hover:text-[#1B2A4A] transition-all"
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

      {/* Gap Analysis Results */}
      {!loading && view === 'gaps' && gapAnalysis && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-[#1B2A4A] text-lg">Wardrobe Analysis</h2>
              <p className="text-xs text-[#8896B3] mt-0.5">Based on your trip details and packed items</p>
            </div>
            <button
              onClick={runGapAnalysis}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E8D5B0] text-sm text-[#6B7A99] font-medium hover:border-[#C9A96E] hover:text-[#1B2A4A] transition-all"
            >
              <RefreshCw size={13} /> Re-analyze
            </button>
          </div>
          <GapAnalysisPanel result={gapAnalysis} />
        </div>
      )}

      {/* Create Outfit Modal */}
      <CreateOutfitModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        wardrobeItems={items}
        onSave={(data) => {
          saveOutfits([...(outfits.length ? outfits.map(o => ({ label: o.label, occasion: o.occasion, itemIds: o.itemIds, aiRationale: o.aiRationale })) : []), data]);
          setView('mix');
        }}
      />
    </div>
  );
}

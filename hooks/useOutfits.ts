'use client';
import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { getStore, setStore } from '@/lib/storage';
import type { OutfitSuggestion, GapAnalysisResult } from '@/types';

export function useOutfits(tripId: string) {
  const [outfits, setOutfits] = useState<OutfitSuggestion[]>([]);
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysisResult | null>(null);

  const reload = useCallback(() => {
    const store = getStore();
    setOutfits(store.outfits[tripId] ?? []);
    setGapAnalysis(store.gapAnalyses[tripId] ?? null);
  }, [tripId]);

  useEffect(() => { reload(); }, [reload]);

  const saveOutfits = useCallback((suggestions: Omit<OutfitSuggestion, 'id' | 'tripId' | 'generatedAt'>[]) => {
    const store = getStore();
    const now = new Date().toISOString();
    store.outfits[tripId] = suggestions.map(s => ({
      ...s,
      id: nanoid(),
      tripId,
      generatedAt: now,
    }));
    setStore(store);
    reload();
  }, [tripId, reload]);

  const saveGapAnalysis = useCallback((data: Omit<GapAnalysisResult, 'id' | 'tripId' | 'generatedAt'>) => {
    const store = getStore();
    const result: GapAnalysisResult = {
      ...data,
      id: nanoid(),
      tripId,
      generatedAt: new Date().toISOString(),
    };
    store.gapAnalyses[tripId] = result;
    setStore(store);
    reload();
  }, [tripId, reload]);

  return { outfits, gapAnalysis, saveOutfits, saveGapAnalysis };
}

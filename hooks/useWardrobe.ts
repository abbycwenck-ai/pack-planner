'use client';
import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { getStore, setStore } from '@/lib/storage';
import type { ClothingItem, ClothingCategory, ItemTag } from '@/types';

export function useWardrobe(tripId: string) {
  const [items, setItems] = useState<ClothingItem[]>([]);

  const reload = useCallback(() => {
    const store = getStore();
    setItems(Object.values(store.items).filter(i => i.tripId === tripId));
  }, [tripId]);

  useEffect(() => { reload(); }, [reload]);

  const addItem = useCallback((data: {
    name: string;
    category: ClothingCategory;
    tags: ItemTag[];
    source: 'upload' | 'catalog';
    imageDataUrl?: string;
    iconPath?: string;
    iconColor?: string;
  }): ClothingItem => {
    const item: ClothingItem = {
      id: nanoid(),
      tripId,
      name: data.name,
      category: data.category,
      tags: data.tags,
      source: data.source,
      imageDataUrl: data.imageDataUrl ?? null,
      iconPath: data.iconPath ?? null,
      iconColor: data.iconColor ?? null,
      createdAt: new Date().toISOString(),
    };
    const store = getStore();
    store.items[item.id] = item;
    setStore(store);
    reload();
    return item;
  }, [tripId, reload]);

  const deleteItem = useCallback((id: string) => {
    const store = getStore();
    delete store.items[id];
    setStore(store);
    reload();
  }, [reload]);

  const updateItem = useCallback((id: string, data: Partial<Pick<ClothingItem, 'name' | 'tags' | 'category'>>) => {
    const store = getStore();
    if (!store.items[id]) return;
    store.items[id] = { ...store.items[id], ...data };
    setStore(store);
    reload();
  }, [reload]);

  const itemsByCategory = useCallback((category: ClothingCategory | 'all') => {
    if (category === 'all') return items;
    return items.filter(i => i.category === category);
  }, [items]);

  const counts = useCallback(() => {
    const result: Partial<Record<ClothingCategory, number>> = {};
    items.forEach(i => { result[i.category] = (result[i.category] ?? 0) + 1; });
    return result;
  }, [items]);

  return { items, addItem, deleteItem, updateItem, itemsByCategory, counts };
}

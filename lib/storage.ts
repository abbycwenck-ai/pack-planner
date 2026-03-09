import type { PackPlannerStore } from '@/types';

const STORE_KEY = 'pack-planner-store';
const CURRENT_VERSION = 1;

function emptyStore(): PackPlannerStore {
  return {
    version: CURRENT_VERSION,
    trips: {},
    items: {},
    outfits: {},
    gapAnalyses: {},
  };
}

function migrate(store: PackPlannerStore): PackPlannerStore {
  if (store.version === CURRENT_VERSION) return store;
  return { ...emptyStore(), ...store, version: CURRENT_VERSION };
}

export function getStore(): PackPlannerStore {
  if (typeof window === 'undefined') return emptyStore();
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return emptyStore();
    return migrate(JSON.parse(raw) as PackPlannerStore);
  } catch {
    return emptyStore();
  }
}

export function setStore(store: PackPlannerStore): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

export function getStorageSizeKB(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(STORE_KEY) ?? '';
    return Math.round(raw.length / 1024);
  } catch {
    return 0;
  }
}

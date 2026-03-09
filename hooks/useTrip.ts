'use client';
import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { getStore, setStore } from '@/lib/storage';
import type { Trip, TripDestination, ActivityType } from '@/types';

export function useTrip() {
  const [trips, setTrips] = useState<Record<string, Trip>>({});

  useEffect(() => {
    setTrips(getStore().trips);
  }, []);

  const saveTrips = useCallback((updated: Record<string, Trip>) => {
    const store = getStore();
    store.trips = updated;
    setStore(store);
    setTrips(updated);
  }, []);

  const createTrip = useCallback((data: {
    name: string;
    destinations: TripDestination[];
    startDate: string;
    endDate: string;
    activities: ActivityType[];
    notes: string;
  }): Trip => {
    const now = new Date().toISOString();
    const trip: Trip = { id: nanoid(), ...data, createdAt: now, updatedAt: now };
    const store = getStore();
    store.trips[trip.id] = trip;
    setStore(store);
    setTrips({ ...store.trips });
    return trip;
  }, []);

  const updateTrip = useCallback((id: string, data: Partial<Omit<Trip, 'id' | 'createdAt'>>) => {
    const store = getStore();
    if (!store.trips[id]) return;
    store.trips[id] = { ...store.trips[id], ...data, updatedAt: new Date().toISOString() };
    setStore(store);
    setTrips({ ...store.trips });
  }, []);

  const deleteTrip = useCallback((id: string) => {
    const store = getStore();
    delete store.trips[id];
    // Also delete all items/outfits for this trip
    Object.keys(store.items).forEach(k => { if (store.items[k].tripId === id) delete store.items[k]; });
    delete store.outfits[id];
    delete store.gapAnalyses[id];
    setStore(store);
    setTrips({ ...store.trips });
  }, []);

  const getTrip = useCallback((id: string): Trip | undefined => {
    return trips[id];
  }, [trips]);

  return { trips: Object.values(trips), getTrip, createTrip, updateTrip, deleteTrip };
}

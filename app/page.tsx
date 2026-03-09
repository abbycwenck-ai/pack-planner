'use client';
import { useState } from 'react';
import { Plus, Luggage } from 'lucide-react';
import { useTrip } from '@/hooks/useTrip';
import { getStore } from '@/lib/storage';
import { TripCard } from '@/components/trip/TripCard';
import { TripSetupModal } from '@/components/trip/TripSetupModal';
import type { Trip } from '@/types';

export default function HomePage() {
  const { trips, createTrip, updateTrip, deleteTrip } = useTrip();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | undefined>();

  const getItemCount = (tripId: string) => {
    const store = getStore();
    return Object.values(store.items).filter(i => i.tripId === tripId).length;
  };

  const handleSave = (data: Parameters<typeof createTrip>[0]) => {
    if (editingTrip) {
      updateTrip(editingTrip.id, data);
    } else {
      createTrip(data);
    }
    setEditingTrip(undefined);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this trip and all its items?')) deleteTrip(id);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
              <Luggage size={16} className="text-white" />
            </div>
            <span className="text-lg font-semibold text-stone-900">Pack Planner</span>
          </div>
          <button
            onClick={() => { setEditingTrip(undefined); setModalOpen(true); }}
            className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
          >
            <Plus size={15} /> New Trip
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {trips.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Luggage size={28} className="text-stone-400" />
            </div>
            <h2 className="text-xl font-semibold text-stone-800 mb-2">Plan your first trip</h2>
            <p className="text-stone-500 mb-6 max-w-sm mx-auto">
              Add your trip details, then build a visual wardrobe and get AI outfit suggestions.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-stone-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-stone-800 transition-colors"
            >
              Create a Trip
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-stone-900 mb-6">Your Trips</h1>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trips
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map(trip => (
                  <div key={trip.id} className="relative">
                    <TripCard
                      trip={trip}
                      itemCount={getItemCount(trip.id)}
                      onEdit={() => { setEditingTrip(trip); setModalOpen(true); }}
                      onDelete={() => handleDelete(trip.id)}
                    />
                  </div>
                ))}
              <button
                onClick={() => { setEditingTrip(undefined); setModalOpen(true); }}
                className="border-2 border-dashed border-stone-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-stone-400 hover:border-stone-400 hover:text-stone-600 transition-all min-h-[180px]"
              >
                <Plus size={24} />
                <span className="text-sm font-medium">Add Trip</span>
              </button>
            </div>
          </>
        )}
      </main>

      <TripSetupModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTrip(undefined); }}
        existingTrip={editingTrip}
        onSave={handleSave}
      />
    </div>
  );
}

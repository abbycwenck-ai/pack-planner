'use client';
import { useState, useRef, useEffect } from 'react';
import { Plus, Luggage, MapPin, Calendar, Shirt, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useTrip } from '@/hooks/useTrip';
import { getStore } from '@/lib/storage';
import { TripSetupModal } from '@/components/trip/TripSetupModal';
import { format, differenceInDays } from 'date-fns';
import Link from 'next/link';

import type { Trip } from '@/types';

function TripCard({ trip, itemCount, onEdit, onDelete }: { trip: Trip; itemCount: number; onEdit: () => void; onDelete: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const days = Math.max(1, differenceInDays(new Date(trip.endDate), new Date(trip.startDate)));
  const destLabel = trip.destinations.map(d => d.city).join(' → ');

  useEffect(() => {
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-[#E8D5B0]/60 hover:border-[#C9A96E]/60 hover:shadow-xl transition-all duration-300">
      {/* Top color band */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#C9A96E] via-[#E8C4B8] to-[#8B9E7E]" />

      <Link href={`/trip/${trip.id}/wardrobe`} className="block p-6">
        <div className="mb-5">
          <h3 className="text-xl font-semibold text-[#1B2A4A] mb-1">{trip.name}</h3>
          <div className="flex items-center gap-1.5 text-[#6B7A99] text-sm">
            <MapPin size={13} />
            <span>{destLabel}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-[#8896B3] mb-5">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-[#C9A96E]" />
            <span>{format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}</span>
          </div>
          <span className="text-[#E8D5B0]">·</span>
          <span className="font-medium text-[#1B2A4A]">{days} days</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E8D5B0]/60 rounded-xl px-3 py-1.5">
            <Shirt size={13} className="text-[#C9A96E]" />
            <span className="text-sm font-medium text-[#1B2A4A]">{itemCount} items</span>
          </div>
          {trip.activities.length > 0 && (
            <div className="flex gap-1.5">
              {trip.activities.slice(0, 2).map(a => (
                <span key={a} className="px-2.5 py-1 rounded-full bg-[#F2EDE4] text-[#6B7A99] text-xs capitalize font-medium">
                  {a.replace(/-/g, ' ')}
                </span>
              ))}
              {trip.activities.length > 2 && (
                <span className="px-2.5 py-1 rounded-full bg-[#F2EDE4] text-[#6B7A99] text-xs">+{trip.activities.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </Link>

      <div className="absolute top-5 right-4" ref={menuRef}>
        <button onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen); }}
          className="p-1.5 rounded-lg text-[#8896B3] hover:text-[#1B2A4A] hover:bg-[#F2EDE4] transition-colors opacity-0 group-hover:opacity-100">
          <MoreHorizontal size={16} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-8 z-20 bg-white border border-[#E8D5B0]/60 rounded-2xl shadow-xl py-1.5 min-w-[130px]">
            <button onClick={() => { onEdit(); setMenuOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#1B2A4A] hover:bg-[#FAF7F2]">
              <Pencil size={13} className="text-[#C9A96E]" /> Edit Trip
            </button>
            <button onClick={() => { onDelete(); setMenuOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { trips, createTrip, updateTrip, deleteTrip } = useTrip();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | undefined>();

  const getItemCount = (tripId: string) => Object.values(getStore().items).filter(i => i.tripId === tripId).length;

  const handleSave = (data: Parameters<typeof createTrip>[0]) => {
    if (editingTrip) { updateTrip(editingTrip.id, data); } else { createTrip(data); }
    setEditingTrip(undefined);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#E8D5B0]/50 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1B2A4A] rounded-xl flex items-center justify-center shadow-sm">
              <Luggage size={17} className="text-[#C9A96E]" />
            </div>
            <div>
              <span className="text-lg font-bold text-[#1B2A4A] tracking-tight">Pack Planner</span>
              <span className="hidden sm:inline text-xs text-[#C9A96E] font-medium ml-2 tracking-widest uppercase">by you</span>
            </div>
          </div>
          <button
            onClick={() => { setEditingTrip(undefined); setModalOpen(true); }}
            className="flex items-center gap-2 bg-[#1B2A4A] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2D3F63] transition-colors shadow-sm"
          >
            <Plus size={15} /> New Trip
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-10">
        {trips.length === 0 ? (
          /* Hero empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-[#1B2A4A] rounded-3xl flex items-center justify-center mb-6 shadow-lg">
              <Luggage size={36} className="text-[#C9A96E]" />
            </div>
            <h1 className="text-3xl font-bold text-[#1B2A4A] mb-3 tracking-tight">Your style. Your trip.</h1>
            <p className="text-[#6B7A99] mb-8 max-w-md text-base leading-relaxed">
              Build a visual wardrobe for your next adventure. Get AI outfit suggestions and find gaps before you pack.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-[#1B2A4A] text-white px-8 py-3.5 rounded-2xl font-semibold text-base hover:bg-[#2D3F63] transition-colors shadow-md"
            >
              Plan Your First Trip
            </button>
            {/* Feature chips */}
            <div className="flex flex-wrap gap-3 justify-center mt-10">
              {['Visual wardrobe builder', 'AI outfit suggestions', 'Packing gap analysis'].map(f => (
                <span key={f} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#E8D5B0]/60 rounded-full text-sm text-[#6B7A99] shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
                  {f}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-baseline justify-between mb-7">
              <div>
                <h1 className="text-2xl font-bold text-[#1B2A4A] tracking-tight">Your Trips</h1>
                <p className="text-[#8896B3] text-sm mt-0.5">{trips.length} trip{trips.length !== 1 ? 's' : ''} planned</p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {trips
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map(trip => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    itemCount={getItemCount(trip.id)}
                    onEdit={() => { setEditingTrip(trip); setModalOpen(true); }}
                    onDelete={() => { if (confirm('Delete this trip and all its items?')) deleteTrip(trip.id); }}
                  />
                ))}
              <button
                onClick={() => { setEditingTrip(undefined); setModalOpen(true); }}
                className="border-2 border-dashed border-[#E8D5B0] rounded-3xl flex flex-col items-center justify-center gap-3 text-[#C9A96E] hover:border-[#C9A96E] hover:bg-white transition-all min-h-[200px] group"
              >
                <div className="w-10 h-10 rounded-xl border-2 border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus size={20} />
                </div>
                <span className="text-sm font-semibold">Add Trip</span>
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

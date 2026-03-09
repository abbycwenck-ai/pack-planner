'use client';
import Link from 'next/link';
import { MapPin, Calendar, Shirt, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { format, differenceInDays } from 'date-fns';
import type { Trip } from '@/types';

interface Props {
  trip: Trip;
  itemCount: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function TripCard({ trip, itemCount, onEdit, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const days = Math.max(1, differenceInDays(new Date(trip.endDate), new Date(trip.startDate)));
  const destLabel = trip.destinations.map(d => d.city).join(' → ');

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="group bg-white rounded-2xl border border-stone-200 hover:border-stone-300 hover:shadow-lg transition-all overflow-hidden">
      <Link href={`/trip/${trip.id}/wardrobe`} className="block p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-stone-900">{trip.name}</h3>
            <div className="flex items-center gap-1.5 mt-1 text-stone-500 text-sm">
              <MapPin size={13} />
              <span>{destLabel}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-stone-500">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} />
            <span>{format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}</span>
          </div>
          <div className="h-3 w-px bg-stone-200" />
          <span>{days} days</span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-stone-600 bg-stone-50 rounded-lg px-3 py-1.5">
            <Shirt size={13} />
            <span>{itemCount} items packed</span>
          </div>
          {trip.activities.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {trip.activities.slice(0, 3).map(a => (
                <span key={a} className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 text-xs capitalize">
                  {a.replace(/-/g, ' ')}
                </span>
              ))}
              {trip.activities.length > 3 && (
                <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 text-xs">+{trip.activities.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Menu */}
      <div className="absolute top-4 right-4" ref={menuRef}>
        <button
          onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen); }}
          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreHorizontal size={16} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-8 z-10 bg-white border border-stone-200 rounded-xl shadow-lg py-1 min-w-[120px]">
            <button onClick={() => { onEdit(); setMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50">
              <Pencil size={13} /> Edit
            </button>
            <button onClick={() => { onDelete(); setMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

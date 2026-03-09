'use client';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Shirt, Sparkles, LayoutGrid, ChevronLeft, Luggage } from 'lucide-react';
import { getStore } from '@/lib/storage';
import { format, differenceInDays } from 'date-fns';
import type { Trip } from '@/types';

const tabs = [
  { label: 'Wardrobe', href: 'wardrobe', icon: Shirt },
  { label: 'AI Stylist', href: 'outfits', icon: Sparkles },
  { label: 'Overview', href: 'overview', icon: LayoutGrid },
];

export default function TripLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams<{ tripId: string }>();
  const tripId = params.tripId;

  // Fix SSR bug: read localStorage only after mount on client
  const [trip, setTrip] = useState<Trip | null>(null);
  const [itemCount, setItemCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const store = getStore();
    setTrip(store.trips[tripId] ?? null);
    setItemCount(Object.values(store.items).filter(i => i.tripId === tripId).length);
    setHydrated(true);
  }, [tripId, pathname]);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E8D5B0] border-t-[#C9A96E] rounded-full animate-spin" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6B7A99]">Trip not found.</p>
          <Link href="/" className="text-[#1B2A4A] font-semibold mt-2 inline-block hover:underline">← Back home</Link>
        </div>
      </div>
    );
  }

  const days = Math.max(1, differenceInDays(new Date(trip.endDate), new Date(trip.startDate)));
  const destLabel = trip.destinations.map(d => d.city).join(' · ');

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="bg-white/90 backdrop-blur-md border-b border-[#E8D5B0]/50 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-5">
          <div className="py-3.5 flex items-center gap-3">
            <Link href="/" className="p-1.5 rounded-xl text-[#8896B3] hover:text-[#1B2A4A] hover:bg-[#F2EDE4] transition-colors">
              <ChevronLeft size={19} />
            </Link>
            <div className="w-8 h-8 bg-[#1B2A4A] rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <Luggage size={15} className="text-[#C9A96E]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h1 className="font-bold text-[#1B2A4A] truncate tracking-tight">{trip.name}</h1>
                <span className="text-[#8896B3] text-sm hidden sm:inline truncate">{destLabel}</span>
              </div>
              <p className="text-xs text-[#8896B3]">
                {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}
                <span className="text-[#C9A96E] mx-1.5">·</span>{days} days
                <span className="text-[#C9A96E] mx-1.5">·</span>{itemCount} items
              </p>
            </div>
          </div>

          <div className="flex gap-1 border-t border-[#E8D5B0]/40 pt-1 pb-0">
            {tabs.map(tab => {
              const active = pathname.includes(`/${tab.href}`);
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.href}
                  href={`/trip/${tripId}/${tab.href}`}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl border-b-2 transition-all ${
                    active
                      ? 'border-[#C9A96E] text-[#1B2A4A] bg-[#FAF7F2]/60'
                      : 'border-transparent text-[#8896B3] hover:text-[#1B2A4A] hover:bg-[#F2EDE4]/50'
                  }`}
                >
                  <Icon size={14} className={active ? 'text-[#C9A96E]' : ''} />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-7">
        {children}
      </main>
    </div>
  );
}

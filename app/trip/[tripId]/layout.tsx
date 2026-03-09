'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Shirt, Sparkles, LayoutGrid, ChevronLeft, Luggage } from 'lucide-react';
import { getStore } from '@/lib/storage';
import { format, differenceInDays } from 'date-fns';

const tabs = [
  { label: 'Wardrobe', href: 'wardrobe', icon: Shirt },
  { label: 'AI Stylist', href: 'outfits', icon: Sparkles },
  { label: 'Overview', href: 'overview', icon: LayoutGrid },
];

export default function TripLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams<{ tripId: string }>();
  const tripId = params.tripId;

  const store = getStore();
  const trip = store.trips[tripId];
  const itemCount = Object.values(store.items).filter(i => i.tripId === tripId).length;

  if (!trip) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500">Trip not found.</p>
          <Link href="/" className="text-stone-800 font-medium mt-2 inline-block hover:underline">← Back home</Link>
        </div>
      </div>
    );
  }

  const days = Math.max(1, differenceInDays(new Date(trip.endDate), new Date(trip.startDate)));
  const destLabel = trip.destinations.map(d => d.city).join(' · ');

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="py-3 flex items-center gap-3">
            <Link href="/" className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors">
              <ChevronLeft size={18} />
            </Link>
            <div className="w-7 h-7 bg-stone-900 rounded-md flex items-center justify-center">
              <Luggage size={14} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <h1 className="font-semibold text-stone-900 truncate">{trip.name}</h1>
                <span className="text-stone-400 text-sm hidden sm:inline">·</span>
                <span className="text-stone-500 text-sm hidden sm:inline truncate">{destLabel}</span>
              </div>
              <p className="text-xs text-stone-400">
                {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')} · {days} days · {itemCount} items
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-t border-stone-100">
            {tabs.map(tab => {
              const active = pathname.includes(`/${tab.href}`);
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.href}
                  href={`/trip/${tripId}/${tab.href}`}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    active
                      ? 'border-stone-900 text-stone-900'
                      : 'border-transparent text-stone-500 hover:text-stone-700'
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}

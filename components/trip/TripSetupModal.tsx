'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ACTIVITIES } from '@/constants/categories';
import type { Trip, TripDestination, ActivityType } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  existingTrip?: Trip;
  onSave: (data: {
    name: string;
    destinations: TripDestination[];
    startDate: string;
    endDate: string;
    activities: ActivityType[];
    notes: string;
  }) => void;
}

export function TripSetupModal({ isOpen, onClose, existingTrip, onSave }: Props) {
  const [name, setName] = useState('');
  const [destinations, setDestinations] = useState<TripDestination[]>([{ city: '', country: '' }]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (existingTrip) {
      setName(existingTrip.name);
      setDestinations(existingTrip.destinations);
      setStartDate(existingTrip.startDate);
      setEndDate(existingTrip.endDate);
      setActivities(existingTrip.activities);
      setNotes(existingTrip.notes);
    } else {
      setName(''); setDestinations([{ city: '', country: '' }]);
      setStartDate(''); setEndDate(''); setActivities([]); setNotes('');
    }
  }, [existingTrip, isOpen]);

  const toggleActivity = (a: ActivityType) => {
    setActivities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validDests = destinations.filter(d => d.city.trim());
    if (!validDests.length || !startDate || !endDate) return;
    onSave({ name: name || validDests[0].city, destinations: validDests, startDate, endDate, activities, notes });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingTrip ? 'Edit Trip' : 'New Trip'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Trip Name */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Trip Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Europe Summer 2026"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        {/* Destinations */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Destinations</label>
          <div className="space-y-2">
            {destinations.map((dest, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={dest.city}
                  onChange={e => setDestinations(prev => prev.map((d, j) => j === i ? { ...d, city: e.target.value } : d))}
                  placeholder="City"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
                <input
                  type="text"
                  value={dest.country}
                  onChange={e => setDestinations(prev => prev.map((d, j) => j === i ? { ...d, country: e.target.value } : d))}
                  placeholder="Country"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
                {destinations.length > 1 && (
                  <button type="button" onClick={() => setDestinations(prev => prev.filter((_, j) => j !== i))}
                    className="p-2.5 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setDestinations(prev => [...prev, { city: '', country: '' }])}
            className="mt-2 flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
          >
            <Plus size={14} /> Add destination
          </button>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Depart</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Return</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required min={startDate}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400" />
          </div>
        </div>

        {/* Activities */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Activities</label>
          <div className="flex flex-wrap gap-2">
            {ACTIVITIES.map(a => (
              <button
                key={a.value}
                type="button"
                onClick={() => toggleActivity(a.value)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activities.includes(a.value)
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Notes <span className="text-stone-400 font-normal">(optional)</span></label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Warm days, cool evenings, possible rain..."
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-medium hover:bg-stone-50 transition-colors">
            Cancel
          </button>
          <button type="submit"
            className="flex-1 py-2.5 rounded-xl bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors">
            {existingTrip ? 'Save Changes' : 'Create Trip'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

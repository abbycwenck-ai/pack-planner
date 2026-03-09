import { AIControlPanel } from '@/components/outfits/AIControlPanel';

export default function OutfitsPage({ params }: { params: { tripId: string } }) {
  return <AIControlPanel tripId={params.tripId} />;
}

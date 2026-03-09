import { WardrobeGrid } from '@/components/wardrobe/WardrobeGrid';

export default function WardrobePage({ params }: { params: { tripId: string } }) {
  return <WardrobeGrid tripId={params.tripId} />;
}

import { redirect } from 'next/navigation';

export default function TripRootPage({ params }: { params: { tripId: string } }) {
  redirect(`/trip/${params.tripId}/wardrobe`);
}

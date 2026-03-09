import { PackingOverview } from '@/components/overview/PackingOverview';

export default function OverviewPage({ params }: { params: { tripId: string } }) {
  return <PackingOverview tripId={params.tripId} />;
}

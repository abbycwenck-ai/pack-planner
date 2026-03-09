import Anthropic from '@anthropic-ai/sdk';
import { extractJSON } from '@/lib/parseJson';
import type { Trip, ClothingItem, OutfitSuggestion } from '@/types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type OutfitRaw = Omit<OutfitSuggestion, 'id' | 'tripId' | 'generatedAt'>;

function buildTripContext(trip: Trip, catalogItems: ClothingItem[]): string {
  const days = Math.max(1, Math.ceil(
    (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
  ));
  return `TRIP DETAILS:
- Destinations: ${trip.destinations.map(d => `${d.city}, ${d.country}`).join(' → ')}
- Duration: ${days} days (${trip.startDate} to ${trip.endDate})
- Activities: ${trip.activities.join(', ') || 'general travel'}
- Notes: ${trip.notes || 'none'}

CATALOG ICON ITEMS (no photos, described by metadata):
${catalogItems.length > 0 ? catalogItems.map(i =>
  `- ID: ${i.id} | ${i.category} | "${i.name || i.iconPath?.split('/').pop()?.replace('.svg','')}" | Tags: ${i.tags.join(', ') || 'none'} | Color: ${i.iconColor}`
).join('\n') : 'none'}

UPLOADED PHOTO ITEMS (images follow):`;
}

const OUTFIT_PROMPT = `Based on the trip details and clothing items shown above, suggest 8-12 complete outfits.

Return ONLY valid JSON (no markdown fences), an array with this structure:
[
  {
    "label": "Arrival Day - Casual Explore",
    "occasion": "Casual sightseeing",
    "itemIds": ["item_id_1", "item_id_2"],
    "aiRationale": "why this combination works for the trip and occasion"
  }
]

Rules:
- Each outfit must ONLY reference actual item IDs from the provided list
- Always include at minimum: a top (or dress), shoes
- Include bottoms unless item is a dress/jumpsuit
- Vary combinations to use different items across outfits
- Match outfits to the trip's activities
- Do not repeat the exact same combination twice`;

export async function POST(req: Request) {
  try {
    const { trip, items }: { trip: Trip; items: ClothingItem[] } = await req.json();

    if (!items.length) {
      return Response.json({ error: 'No items to analyze' }, { status: 400 });
    }

    const uploadedItems = items.filter(i => i.source === 'upload' && i.imageDataUrl);
    const catalogItems = items.filter(i => i.source === 'catalog');

    // Build content array
    const content: Anthropic.MessageParam['content'] = [];

    content.push({ type: 'text', text: buildTripContext(trip, catalogItems) });

    // Add uploaded item photos with labels
    for (const item of uploadedItems) {
      content.push({
        type: 'text',
        text: `\nItem ID: ${item.id} | Category: ${item.category} | Name: "${item.name}" | Tags: ${item.tags.join(', ') || 'none'}`,
      });
      // Resize to 400px for AI to reduce token cost
      const base64 = item.imageDataUrl!.replace(/^data:image\/\w+;base64,/, '');
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: 'image/jpeg', data: base64 },
      });
    }

    content.push({ type: 'text', text: OUTFIT_PROMPT });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const outfits = extractJSON<OutfitRaw[]>(text);

    // Validate that itemIds actually exist
    const itemIdSet = new Set(items.map(i => i.id));
    const validOutfits = outfits
      .map(o => ({ ...o, itemIds: o.itemIds.filter(id => itemIdSet.has(id)) }))
      .filter(o => o.itemIds.length >= 2);

    return Response.json({ outfits: validOutfits });
  } catch (err) {
    console.error('analyze-outfits error:', err);
    return Response.json({ error: 'Failed to generate outfits' }, { status: 500 });
  }
}

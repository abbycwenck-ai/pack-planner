import Anthropic from '@anthropic-ai/sdk';
import { extractJSON } from '@/lib/parseJson';
import type { Trip, ClothingItem, GapAnalysisResult } from '@/types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  try {
    const { trip, items }: { trip: Trip; items: ClothingItem[] } = await req.json();

    const days = Math.max(1, Math.ceil(
      (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
    ));

    const categoryCounts: Record<string, number> = {};
    items.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] ?? 0) + 1;
    });

    const prompt = `You are a professional travel stylist auditing a packing list.

TRIP:
- Destinations: ${trip.destinations.map(d => `${d.city}, ${d.country}`).join(' → ')}
- Duration: ${days} days
- Activities: ${trip.activities.join(', ') || 'general travel'}
- Notes: ${trip.notes || 'none'}

PACKED ITEMS BY CATEGORY:
${Object.entries(categoryCounts).map(([cat, count]) => `- ${cat}: ${count} item${count !== 1 ? 's' : ''}`).join('\n')}

DETAILED ITEM LIST:
${items.map(i => `- [${i.category}] "${i.name || 'unnamed'}" | Tags: ${i.tags.join(', ') || 'none'}`).join('\n')}

Analyze this packing list for a ${days}-day trip and return ONLY valid JSON (no markdown fences):
{
  "gaps": [
    {
      "severity": "critical",
      "category": "tops",
      "message": "concise problem statement (max 15 words)",
      "suggestion": "specific actionable fix (max 20 words)"
    }
  ],
  "strengths": [
    "what this packing list does well (max 15 words each)"
  ]
}

Severity guide:
- "critical": Will significantly impact the trip (not enough clothes, missing essentials for activities)
- "suggested": Would make the trip more comfortable or versatile
- "nice-to-have": Minor improvements

Focus on: item-to-day ratios, activity coverage, weather for destination/season, versatility.
Limit to max 6 gaps and 3 strengths. Be specific and actionable.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const parsed = extractJSON<Pick<GapAnalysisResult, 'gaps' | 'strengths'>>(text);

    return Response.json(parsed);
  } catch (err) {
    console.error('gap-analysis error:', err);
    return Response.json({ error: 'Failed to analyze wardrobe' }, { status: 500 });
  }
}

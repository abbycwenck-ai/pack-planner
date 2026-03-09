export function extractJSON<T>(text: string): T {
  // Try extracting from markdown code fence
  const fenced = text.match(/```(?:json)?\n?([\s\S]+?)\n?```/);
  if (fenced) {
    return JSON.parse(fenced[1]) as T;
  }
  // Fallback: find first [ or { and parse from there
  const arrStart = text.indexOf('[');
  const objStart = text.indexOf('{');
  if (arrStart !== -1 && (objStart === -1 || arrStart < objStart)) {
    return JSON.parse(text.slice(arrStart)) as T;
  }
  if (objStart !== -1) {
    return JSON.parse(text.slice(objStart)) as T;
  }
  throw new Error('No JSON found in response');
}

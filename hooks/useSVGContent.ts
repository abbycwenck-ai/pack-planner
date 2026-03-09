'use client';
import { useState, useEffect } from 'react';

const svgCache = new Map<string, string>();

export function useSVGContent(path: string | null) {
  const [svg, setSvg] = useState<string | null>(path ? (svgCache.get(path) ?? null) : null);

  useEffect(() => {
    if (!path) return;
    if (svgCache.has(path)) {
      setSvg(svgCache.get(path)!);
      return;
    }
    fetch(path)
      .then(r => r.text())
      .then(text => {
        svgCache.set(path, text);
        setSvg(text);
      })
      .catch(() => setSvg(null));
  }, [path]);

  return svg;
}

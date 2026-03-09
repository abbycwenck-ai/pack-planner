'use client';
import { AlertTriangle, Info, Lightbulb, CheckCircle2 } from 'lucide-react';
import type { GapAnalysisResult } from '@/types';

interface Props {
  result: GapAnalysisResult;
}

const SEVERITY_CONFIG = {
  critical: {
    icon: AlertTriangle,
    bg: 'bg-rose-50',
    border: 'border-rose-200/80',
    iconColor: 'text-rose-500',
    textColor: 'text-rose-900',
    subColor: 'text-rose-600',
    label: 'Must Add',
    labelBg: 'bg-rose-100 text-rose-700',
  },
  suggested: {
    icon: Info,
    bg: 'bg-amber-50',
    border: 'border-amber-200/80',
    iconColor: 'text-amber-500',
    textColor: 'text-amber-900',
    subColor: 'text-amber-700',
    label: 'Consider',
    labelBg: 'bg-amber-100 text-amber-700',
  },
  'nice-to-have': {
    icon: Lightbulb,
    bg: 'bg-[#FAF7F2]',
    border: 'border-[#E8D5B0]',
    iconColor: 'text-[#C9A96E]',
    textColor: 'text-[#1B2A4A]',
    subColor: 'text-[#6B7A99]',
    label: 'Nice to Have',
    labelBg: 'bg-[#F2EDE4] text-[#8B6A3E]',
  },
};

export function GapAnalysisPanel({ result }: Props) {
  const criticalGaps = result.gaps.filter(g => g.severity === 'critical');
  const suggestedGaps = result.gaps.filter(g => g.severity === 'suggested');
  const niceToHave = result.gaps.filter(g => g.severity === 'nice-to-have');

  return (
    <div className="space-y-6">
      {result.gaps.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-3xl border border-[#E8D5B0]/60">
          <CheckCircle2 size={36} className="text-[#8B9E7E] mx-auto mb-3" />
          <p className="font-bold text-[#1B2A4A]">Your packing looks great!</p>
          <p className="text-[#8896B3] text-sm mt-1">No significant gaps found for this trip.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-[#8896B3] uppercase tracking-widest px-1">Packing Gaps</h3>
          {[...criticalGaps, ...suggestedGaps, ...niceToHave].map((gap, i) => {
            const config = SEVERITY_CONFIG[gap.severity];
            const Icon = config.icon;
            return (
              <div key={i} className={`flex gap-3.5 p-4 rounded-2xl border ${config.bg} ${config.border}`}>
                <Icon size={16} className={`flex-shrink-0 mt-0.5 ${config.iconColor}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${config.labelBg}`}>
                      {config.label}
                    </span>
                    <span className="text-xs text-[#8896B3] capitalize">{gap.category}</span>
                  </div>
                  <p className={`text-sm font-semibold ${config.textColor}`}>{gap.message}</p>
                  <p className={`text-xs mt-0.5 ${config.subColor}`}>{gap.suggestion}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {result.strengths.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-[#8896B3] uppercase tracking-widest px-1">What&apos;s Working ✓</h3>
          <div className="space-y-2">
            {result.strengths.map((s, i) => (
              <div key={i} className="flex gap-3 p-3.5 rounded-2xl bg-[#F2EDE4]/60 border border-[#8B9E7E]/30">
                <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5 text-[#8B9E7E]" />
                <p className="text-sm text-[#1B2A4A]">{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

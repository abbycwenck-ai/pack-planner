'use client';
import { AlertTriangle, Info, Lightbulb, CheckCircle2 } from 'lucide-react';
import type { GapAnalysisResult } from '@/types';

interface Props {
  result: GapAnalysisResult;
}

const SEVERITY_CONFIG = {
  critical: {
    icon: AlertTriangle,
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconColor: 'text-red-500',
    textColor: 'text-red-800',
    subColor: 'text-red-600',
    label: 'Critical',
    labelBg: 'bg-red-100 text-red-700',
  },
  suggested: {
    icon: Info,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    iconColor: 'text-amber-500',
    textColor: 'text-amber-800',
    subColor: 'text-amber-600',
    label: 'Suggested',
    labelBg: 'bg-amber-100 text-amber-700',
  },
  'nice-to-have': {
    icon: Lightbulb,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconColor: 'text-blue-500',
    textColor: 'text-blue-800',
    subColor: 'text-blue-600',
    label: 'Nice to Have',
    labelBg: 'bg-blue-100 text-blue-700',
  },
};

export function GapAnalysisPanel({ result }: Props) {
  const criticalGaps = result.gaps.filter(g => g.severity === 'critical');
  const suggestedGaps = result.gaps.filter(g => g.severity === 'suggested');
  const niceToHave = result.gaps.filter(g => g.severity === 'nice-to-have');

  return (
    <div className="space-y-6">
      {/* Gaps */}
      {result.gaps.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2" />
          <p className="font-medium text-stone-800">Your packing looks great!</p>
          <p className="text-stone-500 text-sm mt-1">No significant gaps found for this trip.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Packing Gaps</h3>
          {[...criticalGaps, ...suggestedGaps, ...niceToHave].map((gap, i) => {
            const config = SEVERITY_CONFIG[gap.severity];
            const Icon = config.icon;
            return (
              <div key={i} className={`flex gap-3 p-4 rounded-xl border ${config.bg} ${config.border}`}>
                <Icon size={16} className={`flex-shrink-0 mt-0.5 ${config.iconColor}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.labelBg}`}>
                      {config.label}
                    </span>
                    <span className="text-xs text-stone-400 capitalize">{gap.category}</span>
                  </div>
                  <p className={`text-sm font-medium ${config.textColor}`}>{gap.message}</p>
                  <p className={`text-xs mt-0.5 ${config.subColor}`}>{gap.suggestion}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Strengths */}
      {result.strengths.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">What&apos;s Working</h3>
          <div className="space-y-2">
            {result.strengths.map((s, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
                <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5 text-green-500" />
                <p className="text-sm text-green-800">{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

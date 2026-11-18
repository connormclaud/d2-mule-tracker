import React from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { LEVELING_ROWS, LevelingRow } from '../data/guideData';
import { RichGuideText } from './RichGuideText';

interface MilestoneTrackerBarProps {
  activeRowId: string;
  onSelectRow: (id: string) => void;
  folded: boolean;
  onToggleFold: () => void;
}

export const MilestoneTrackerBar: React.FC<MilestoneTrackerBarProps> = ({
  activeRowId,
  onSelectRow,
  folded,
  onToggleFold,
}) => {
  const activeRowIndex = Math.max(
    0,
    LEVELING_ROWS.findIndex((r) => r.id === activeRowId)
  );
  const activeRow: LevelingRow = LEVELING_ROWS[activeRowIndex];

  const handleStep = (delta: number) => {
    const nextIdx = Math.min(Math.max(activeRowIndex + delta, 0), LEVELING_ROWS.length - 1);
    onSelectRow(LEVELING_ROWS[nextIdx].id);
  };

  return (
    <div className="sticky top-[57px] sm:top-[61px] z-20 bg-stone-50/95 dark:bg-slate-950/95 backdrop-blur-xs border-b border-stone-200 dark:border-slate-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-2.5">
        <div className="rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 sm:px-4 py-2.5">
          {/* Frozen Top Row (Always Visible) */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleStep(-1)}
                  disabled={activeRowIndex === 0}
                  aria-label="Previous milestone"
                  className="p-1.5 rounded border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleStep(1)}
                  disabled={activeRowIndex === LEVELING_ROWS.length - 1}
                  aria-label="Next milestone"
                  className="p-1.5 rounded border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 dark:text-slate-400">
                  <span className="truncate">
                    ACTIVE MILESTONE TRACKER ({activeRowIndex + 1} / {LEVELING_ROWS.length})
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                  <span className="text-sm sm:text-base font-bold font-mono text-stone-900 dark:text-white tabular-nums whitespace-nowrap">
                    {activeRow.isQuest ? `Quest: ${activeRow.levelOrQuest}` : `Level ${activeRow.levelOrQuest}`}
                  </span>
                  {folded && activeRow.gearSwapPowerSpike !== '—' && (
                    <span className="text-xs text-stone-600 dark:text-slate-300 truncate max-w-[260px] sm:max-w-[440px]">
                      <RichGuideText text={activeRow.gearSwapPowerSpike} />
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Compact Stats + Fold Toggle */}
            <div className="flex items-center gap-2 sm:gap-3 ml-auto">
              <div className="hidden md:flex items-center gap-2 font-mono text-xs tabular-nums">
                <span className="px-2 py-1 rounded bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 text-stone-700 dark:text-slate-300">
                  STR {activeRow.baseStr}/<strong className="text-amber-700 dark:text-amber-400">{activeRow.effectiveStr}</strong>
                </span>
                <span className="px-2 py-1 rounded bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 text-stone-700 dark:text-slate-300">
                  DEX {activeRow.baseDex}/<strong className="text-emerald-700 dark:text-emerald-400">{activeRow.effectiveDex}</strong>
                </span>
                <span className="px-2 py-1 rounded bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 text-stone-700 dark:text-slate-300">
                  VIT {activeRow.baseVit}/<strong className="text-rose-700 dark:text-rose-400">{activeRow.effectiveVit}</strong>
                </span>
                <span className="px-2 py-1 rounded bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 text-stone-700 dark:text-slate-300">
                  {activeRow.holyFireBaseLvl > 0
                    ? `HF ${activeRow.holyFireBaseLvl} (${activeRow.holyFireEffectiveLvl} max)`
                    : 'Might'}
                </span>
              </div>

              <button
                type="button"
                onClick={onToggleFold}
                aria-expanded={!folded}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950 text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{folded ? 'Expand' : 'Fold'}</span>
                {folded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Expanded Details Drawer */}
          {!folded && (
            <div className="mt-3 pt-3 border-t border-stone-200 dark:border-slate-800 space-y-3">
              {/* Mobile stat chips when expanded */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:hidden font-mono text-xs tabular-nums">
                <div className="px-2.5 py-1.5 rounded bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800">
                  <div className="text-[10px] text-stone-500 dark:text-slate-400">STR (BASE / EFF)</div>
                  <div className="font-semibold text-stone-900 dark:text-white">
                    {activeRow.baseStr} / <span className="text-amber-700 dark:text-amber-400">{activeRow.effectiveStr}</span>
                  </div>
                </div>
                <div className="px-2.5 py-1.5 rounded bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800">
                  <div className="text-[10px] text-stone-500 dark:text-slate-400">DEX (BASE / EFF)</div>
                  <div className="font-semibold text-stone-900 dark:text-white">
                    {activeRow.baseDex} / <span className="text-emerald-700 dark:text-emerald-400">{activeRow.effectiveDex}</span>
                  </div>
                </div>
                <div className="px-2.5 py-1.5 rounded bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800">
                  <div className="text-[10px] text-stone-500 dark:text-slate-400">VIT (BASE / EFF)</div>
                  <div className="font-semibold text-stone-900 dark:text-white">
                    {activeRow.baseVit} / <span className="text-rose-700 dark:text-rose-400">{activeRow.effectiveVit}</span>
                  </div>
                </div>
                <div className="px-2.5 py-1.5 rounded bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800">
                  <div className="text-[10px] text-stone-500 dark:text-slate-400">HOLY FIRE AURA</div>
                  <div className="font-semibold text-stone-900 dark:text-white">
                    {activeRow.holyFireBaseLvl > 0
                      ? `Lvl ${activeRow.holyFireBaseLvl} (${activeRow.holyFireEffectiveLvl} max)`
                      : 'Might Active'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm">
                <div>
                  <span className="block text-[10px] font-mono text-stone-500 dark:text-slate-400">
                    SKILL POINT INVESTED
                  </span>
                  <span className="font-mono font-semibold text-stone-900 dark:text-white mt-0.5 block">
                    <RichGuideText text={activeRow.skillInvested} />
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-stone-500 dark:text-slate-400">
                    ACTIVE L-CLICK / R-CLICK
                  </span>
                  <span className="font-mono text-stone-800 dark:text-slate-200 mt-0.5 block">
                    <RichGuideText text={activeRow.activeSkills} />
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-stone-500 dark:text-slate-400">
                    STAT ALLOCATION (+5/LVL)
                  </span>
                  <span className="font-mono text-stone-800 dark:text-slate-200 mt-0.5 block">
                    {activeRow.statPoints}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-stone-500 dark:text-slate-400">
                    GEAR SWAP / POWER SPIKE
                  </span>
                  <span className="text-stone-800 dark:text-slate-200 mt-0.5 block">
                    <RichGuideText text={activeRow.gearSwapPowerSpike} />
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

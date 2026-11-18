import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Shield,
} from 'lucide-react';
import { LEVELING_ROWS, LevelingRow, getMercStageForLevel } from '../data/guideData';
import { RichGuideText } from './RichGuideText';

interface MilestoneTrackerBarProps {
  activeRowId: string;
  onSelectRow: (id: string) => void;
  folded: boolean;
  onToggleFold: () => void;
  hidden: boolean;
  onToggleHidden: () => void;
  showMerc: boolean;
  onToggleShowMerc: () => void;
}

export const MilestoneTrackerBar: React.FC<MilestoneTrackerBarProps> = ({
  activeRowId,
  onSelectRow,
  folded,
  onToggleFold,
  hidden,
  onToggleHidden,
  showMerc,
  onToggleShowMerc,
}) => {
  const activeRowIndex = Math.max(
    0,
    LEVELING_ROWS.findIndex((r) => r.id === activeRowId)
  );
  const activeRow: LevelingRow = LEVELING_ROWS[activeRowIndex];
  const mercStage = getMercStageForLevel(activeRow.numericLevel);

  const handleStep = (delta: number) => {
    const nextIdx = Math.min(Math.max(activeRowIndex + delta, 0), LEVELING_ROWS.length - 1);
    onSelectRow(LEVELING_ROWS[nextIdx].id);
  };

  if (hidden) {
    return (
      <div className="sticky top-[57px] sm:top-[61px] z-20 bg-stone-50/95 dark:bg-slate-950/95 backdrop-blur-xs border-b border-stone-200 dark:border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-1.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 text-xs font-mono text-stone-600 dark:text-slate-400">
            <span className="font-semibold text-stone-900 dark:text-white whitespace-nowrap tabular-nums">
              {activeRow.isQuest ? `Quest: ${activeRow.levelOrQuest}` : `Level ${activeRow.levelOrQuest}`}
            </span>
            <span aria-hidden="true">·</span>
            <span className="whitespace-nowrap tabular-nums">
              {activeRow.holyFireBaseLvl > 0
                ? `HF ${activeRow.holyFireBaseLvl} (${activeRow.holyFireEffectiveLvl} max)`
                : 'Might'}
            </span>
            {showMerc && (
              <>
                <span aria-hidden="true" className="hidden sm:inline">
                  ·
                </span>
                <span className="hidden sm:inline truncate">
                  {mercStage ? (
                    <RichGuideText text={mercStage.compactSummary} />
                  ) : (
                    'Merc: Hire Normal A2 Combat (Prayer) from Greiz'
                  )}
                </span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleHidden}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Show Tracker</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-[57px] sm:top-[61px] z-20 bg-stone-50/95 dark:bg-slate-950/95 backdrop-blur-xs border-b border-stone-200 dark:border-slate-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-2.5">
        <div className="rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 sm:px-4 py-2.5">
          {/* Frozen Top Row (Always Visible) */}
          <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-3">
            {/* Left Zone: Stepper + Level + Paladin Spike (when folded) */}
            <div className="flex items-center gap-2.5 min-w-0 shrink-0 lg:max-w-[340px] xl:max-w-[380px]">
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
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-sm sm:text-base font-bold font-mono text-stone-900 dark:text-white tabular-nums whitespace-nowrap">
                    {activeRow.isQuest
                      ? `Quest: ${activeRow.levelOrQuest}`
                      : `Level ${activeRow.levelOrQuest}`}
                  </span>
                  {folded && activeRow.gearSwapPowerSpike !== '—' && (
                    <span className="text-xs text-stone-600 dark:text-slate-300 truncate max-w-[200px] sm:max-w-[240px]">
                      <RichGuideText text={activeRow.gearSwapPowerSpike} />
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Center Unused Space Slot: Live Mercenary Summary (Desktop Folded & Expanded) */}
            {showMerc && (
              <div className="hidden lg:flex flex-1 min-w-0 items-center px-3 border-l border-stone-200 dark:border-slate-800">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-stone-500 dark:text-slate-400">
                    <span className="text-amber-800 dark:text-amber-400 font-semibold whitespace-nowrap">
                      A2 PRAYER MERC
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate tabular-nums">
                      {mercStage
                        ? `Lvl ${mercStage.mercLevel} · Base Str ${mercStage.mercBaseStr} · ${mercStage.auraStatus}`
                        : 'Hire Normal Act 2 Combat (Prayer) from Greiz'}
                    </span>
                  </div>
                  <div className="text-xs text-stone-700 dark:text-slate-300 truncate mt-0.5">
                    {mercStage ? (
                      <RichGuideText text={mercStage.compactSummary} />
                    ) : (
                      <span>
                        Next swap @ Lvl 20:{' '}
                        <RichGuideText text="The Face of Horror + Hawkmail" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Right Zone: Compact Stats + Merc Toggle + Fold + Hide */}
            <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">
              <div className="hidden md:flex items-center gap-1.5 font-mono text-xs tabular-nums">
                <span className="px-2 py-1 rounded bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 text-stone-700 dark:text-slate-300">
                  STR {activeRow.baseStr}/
                  <strong className="text-amber-700 dark:text-amber-400">
                    {activeRow.effectiveStr}
                  </strong>
                </span>
                <span className="px-2 py-1 rounded bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 text-stone-700 dark:text-slate-300">
                  DEX {activeRow.baseDex}/
                  <strong className="text-emerald-700 dark:text-emerald-400">
                    {activeRow.effectiveDex}
                  </strong>
                </span>
                <span className="px-2 py-1 rounded bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 text-stone-700 dark:text-slate-300">
                  VIT {activeRow.baseVit}/
                  <strong className="text-rose-700 dark:text-rose-400">
                    {activeRow.effectiveVit}
                  </strong>
                </span>
                <span className="px-2 py-1 rounded bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 text-stone-700 dark:text-slate-300">
                  {activeRow.holyFireBaseLvl > 0
                    ? `HF ${activeRow.holyFireBaseLvl} (${activeRow.holyFireEffectiveLvl} max)`
                    : 'Might'}
                </span>
              </div>

              <button
                type="button"
                onClick={onToggleShowMerc}
                aria-pressed={showMerc}
                title={showMerc ? 'Hide Merc info in tracker' : 'Show Merc info in tracker'}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  showMerc
                    ? 'border-amber-600/40 bg-amber-600/10 text-amber-900 dark:text-amber-300'
                    : 'border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950 text-stone-500 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Merc</span>
              </button>

              <button
                type="button"
                onClick={onToggleFold}
                aria-expanded={!folded}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950 text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{folded ? 'Expand' : 'Fold'}</span>
                {folded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                type="button"
                onClick={onToggleHidden}
                aria-label="Hide milestone tracker"
                title="Hide milestone tracker"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950 text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Hide</span>
              </button>
            </div>
          </div>

          {/* Folded Tablet Merc Strip (between md and lg where center slot isn't shown) */}
          {folded && showMerc && (
            <div className="mt-2 pt-2 border-t border-stone-200/80 dark:border-slate-800/80 hidden md:flex lg:hidden items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-[10px] font-semibold text-amber-800 dark:text-amber-400 shrink-0">
                  A2 PRAYER MERC
                </span>
                <span className="text-stone-700 dark:text-slate-300 truncate">
                  {mercStage ? (
                    <RichGuideText text={mercStage.compactSummary} />
                  ) : (
                    'Hire Normal Act 2 Combat (Prayer) from Greiz · Next swap @ Lvl 20: Face of Horror + Hawkmail'
                  )}
                </span>
              </div>
              {mercStage && (
                <span className="font-mono text-[11px] text-stone-500 dark:text-slate-400 whitespace-nowrap shrink-0 tabular-nums">
                  {mercStage.auraStatus}
                </span>
              )}
            </div>
          )}

          {/* Expanded Details Drawer */}
          {!folded && (
            <div className="mt-3 pt-3 border-t border-stone-200 dark:border-slate-800 space-y-3">
              {/* Mobile stat chips when expanded */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:hidden font-mono text-xs tabular-nums">
                <div className="px-2.5 py-1.5 rounded bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800">
                  <div className="text-[10px] text-stone-500 dark:text-slate-400">STR (BASE / EFF)</div>
                  <div className="font-semibold text-stone-900 dark:text-white">
                    {activeRow.baseStr} /{' '}
                    <span className="text-amber-700 dark:text-amber-400">
                      {activeRow.effectiveStr}
                    </span>
                  </div>
                </div>
                <div className="px-2.5 py-1.5 rounded bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800">
                  <div className="text-[10px] text-stone-500 dark:text-slate-400">DEX (BASE / EFF)</div>
                  <div className="font-semibold text-stone-900 dark:text-white">
                    {activeRow.baseDex} /{' '}
                    <span className="text-emerald-700 dark:text-emerald-400">
                      {activeRow.effectiveDex}
                    </span>
                  </div>
                </div>
                <div className="px-2.5 py-1.5 rounded bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800">
                  <div className="text-[10px] text-stone-500 dark:text-slate-400">VIT (BASE / EFF)</div>
                  <div className="font-semibold text-stone-900 dark:text-white">
                    {activeRow.baseVit} /{' '}
                    <span className="text-rose-700 dark:text-rose-400">{activeRow.effectiveVit}</span>
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

              {/* Paladin Milestone Row */}
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

              {/* Mercenary Details Row (Hideable via Merc toggle) */}
              {showMerc && (
                <div className="pt-2.5 border-t border-stone-200/80 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="block text-[10px] font-mono text-amber-800 dark:text-amber-400 font-semibold">
                      ACT 2 PRAYER MERC · BASE STR
                    </span>
                    <span className="font-mono font-semibold text-stone-900 dark:text-white mt-0.5 block tabular-nums">
                      {mercStage
                        ? `Lvl ${mercStage.mercLevel} · ${mercStage.mercBaseStr}`
                        : 'Pre-Lvl 20 (Act 1 / Early Act 2)'}
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-slate-400 block mt-0.5">
                      {mercStage
                        ? mercStage.zoneAct
                        : 'Hire Normal Act 2 Combat (Prayer) from Greiz'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-mono text-stone-500 dark:text-slate-400">
                      MERC WEAPON &amp; AURA
                    </span>
                    <span className="text-stone-800 dark:text-slate-200 mt-0.5 block leading-relaxed">
                      {mercStage ? (
                        <RichGuideText text={mercStage.weapon} />
                      ) : (
                        'Shop Magic/Rare Polearm from Fara (or Savage Cube recipe)'
                      )}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-mono text-stone-500 dark:text-slate-400">
                      MERC HELM &amp; BODY ARMOR
                    </span>
                    <span className="text-stone-800 dark:text-slate-200 mt-0.5 block leading-relaxed">
                      {mercStage ? (
                        <>
                          <RichGuideText text={mercStage.helmet} />
                          <span className="text-stone-400 dark:text-slate-500 mx-1">·</span>
                          <RichGuideText text={mercStage.bodyArmor} />
                        </>
                      ) : (
                        <>
                          Next @ Lvl 20:{' '}
                          <RichGuideText text="The Face of Horror + Hawkmail" />
                        </>
                      )}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-mono text-stone-500 dark:text-slate-400">
                      MERC SYNERGY / MILESTONE NOTE
                    </span>
                    <span className="text-stone-700 dark:text-slate-300 mt-0.5 block leading-relaxed">
                      {mercStage ? (
                        <RichGuideText text={mercStage.keyNotes} />
                      ) : (
                        <RichGuideText text="Insight (Lvl 27) Meditation inherits Prayer for 2x regen; Cure (Lvl 35) Cleansing makes it 3x!" />
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

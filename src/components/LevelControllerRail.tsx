import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  RotateCcw,
  FastForward,
  Check,
} from 'lucide-react';
import {
  LEVELING_ROWS,
  MULE_ITEMS,
  MERC_GEAR_PULL_ITEMS,
  getMercStageForLevel,
} from '../data/guideData';
import { WorkspaceTab } from './GlobalSearchModal';

interface LevelControllerRailProps {
  activeRowId: string;
  onSelectRow: (id: string) => void;
  completedItemsCount: number;
  completedMercCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onResetAllProgress: () => void;
  onSwitchTab: (tab: WorkspaceTab) => void;
}

const QUICK_SPIKES: { rowId: string; label: string; note: string }[] = [
  { rowId: 'lvl-6', label: 'Lvl 6', note: 'Holy Fire + Rondache' },
  { rowId: 'lvl-8', label: 'Lvl 8', note: "5pc Sigon's (70 Str)" },
  { rowId: 'lvl-10', label: 'Lvl 10', note: 'Blood Crescent' },
  { rowId: 'lvl-12', label: 'Lvl 12', note: 'Zeal + Angelic' },
  { rowId: 'lvl-15', label: 'Lvl 15', note: 'Raven Claw Bow' },
  { rowId: 'lvl-17', label: 'Lvl 17', note: 'Stealth (36 Dex)' },
  { rowId: 'lvl-23', label: 'Lvl 23', note: "Kinemil's Awl (+6)" },
  { rowId: 'lvl-26', label: 'Lvl 26', note: 'Max HF + 2x Shim LC' },
  { rowId: 'lvl-27', label: 'Lvl 27', note: 'Merc Insight + Charge' },
  { rowId: 'lvl-29', label: 'Lvl 29', note: 'Tearhaunch + 48 FHR' },
  { rowId: 'lvl-31', label: 'Lvl 31', note: "Moser's + Spirit 34" },
  { rowId: 'lvl-35', label: 'Lvl 35', note: 'Black + Merc Helm' },
  { rowId: 'lvl-37', label: 'Lvl 37', note: 'Smoke + Beast Gyre' },
];

export const LevelControllerRail: React.FC<LevelControllerRailProps> = ({
  activeRowId,
  onSelectRow,
  completedItemsCount,
  completedMercCount,
  darkMode,
  onToggleDarkMode,
  onResetAllProgress,
  onSwitchTab,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  const activeIndex = useMemo(() => {
    const idx = LEVELING_ROWS.findIndex((r) => r.id === activeRowId);
    return idx >= 0 ? idx : 0;
  }, [activeRowId]);

  const activeRow = LEVELING_ROWS[activeIndex];
  const mercStage = getMercStageForLevel(activeRow.numericLevel);

  const nextSpike = useMemo(() => {
    for (let i = activeIndex + 1; i < LEVELING_ROWS.length; i++) {
      if (LEVELING_ROWS[i].isMajorSpike) return LEVELING_ROWS[i];
    }
    return null;
  }, [activeIndex]);

  const handleStep = (delta: number) => {
    const nextIdx = Math.min(Math.max(activeIndex + delta, 0), LEVELING_ROWS.length - 1);
    onSelectRow(LEVELING_ROWS[nextIdx].id);
  };

  const progressPct = Math.round(((activeIndex + 1) / LEVELING_ROWS.length) * 100);

  return (
    <aside className="lg:w-[272px] shrink-0">
      <div className="lg:sticky lg:top-[76px] space-y-4">
        {/* Primary Level Control Panel */}
        <div className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          {/* Active Level Header & Stepper */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between gap-2 text-xs text-stone-500 dark:text-slate-400">
              <span className="font-medium">Active Milestone</span>
              <span className="font-mono tabular-nums">
                {activeIndex + 1} / {LEVELING_ROWS.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleStep(-1)}
                disabled={activeIndex === 0}
                aria-label="Previous milestone"
                className="h-10 w-10 flex items-center justify-center rounded-lg border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-950 text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <select
                aria-label="Select current level or quest milestone"
                value={activeRowId}
                onChange={(e) => onSelectRow(e.target.value)}
                className="h-10 flex-1 min-w-0 px-2.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-950 text-sm font-semibold font-mono text-stone-900 dark:text-white cursor-pointer"
              >
                {LEVELING_ROWS.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.isQuest ? `Quest: ${row.levelOrQuest}` : `Level ${row.levelOrQuest}`}
                    {row.isMajorSpike ? ' ★' : ''}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => handleStep(1)}
                disabled={activeIndex === LEVELING_ROWS.length - 1}
                aria-label="Next milestone"
                className="h-10 w-10 flex items-center justify-center rounded-lg border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-950 text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Thin progress bar */}
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-stone-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-600 dark:bg-amber-500 transition-transform duration-150 origin-left"
                  style={{ transform: `scaleX(${progressPct / 100})` }}
                />
              </div>
              {nextSpike && (
                <button
                  type="button"
                  onClick={() => onSelectRow(nextSpike.id)}
                  className="w-full flex items-center justify-between gap-2 pt-1 text-xs text-amber-800 dark:text-amber-400 hover:underline cursor-pointer text-left"
                >
                  <span className="truncate">
                    Next spike: {nextSpike.isQuest ? nextSpike.levelOrQuest : `Level ${nextSpike.levelOrQuest}`}
                  </span>
                  <FastForward className="w-3.5 h-3.5 shrink-0" />
                </button>
              )}
            </div>
          </div>

          {/* Live Character Stats Grid */}
          <div className="px-4 py-3.5 border-t border-stone-200 dark:border-slate-800 bg-stone-50/60 dark:bg-slate-950/40">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
              <div>
                <div className="text-stone-500 dark:text-slate-400">Strength</div>
                <div className="font-mono font-semibold text-stone-900 dark:text-white tabular-nums mt-0.5">
                  {activeRow.baseStr}{' '}
                  <span className="text-stone-400 dark:text-slate-500 font-normal">base</span>{' '}
                  <span className="text-amber-800 dark:text-amber-400">
                    ({activeRow.effectiveStr})
                  </span>
                </div>
              </div>
              <div>
                <div className="text-stone-500 dark:text-slate-400">Dexterity</div>
                <div className="font-mono font-semibold text-stone-900 dark:text-white tabular-nums mt-0.5">
                  {activeRow.baseDex}{' '}
                  <span className="text-stone-400 dark:text-slate-500 font-normal">base</span>{' '}
                  <span className="text-emerald-700 dark:text-emerald-400">
                    ({activeRow.effectiveDex})
                  </span>
                </div>
              </div>
              <div>
                <div className="text-stone-500 dark:text-slate-400">Vitality</div>
                <div className="font-mono font-semibold text-stone-900 dark:text-white tabular-nums mt-0.5">
                  {activeRow.baseVit}{' '}
                  <span className="text-stone-400 dark:text-slate-500 font-normal">base</span>{' '}
                  <span className="text-rose-700 dark:text-rose-400">
                    ({activeRow.effectiveVit})
                  </span>
                </div>
              </div>
              <div>
                <div className="text-stone-500 dark:text-slate-400">Holy Fire</div>
                <div className="font-mono font-semibold text-stone-900 dark:text-white tabular-nums mt-0.5">
                  {activeRow.holyFireBaseLvl > 0
                    ? `Lvl ${activeRow.holyFireBaseLvl} (${activeRow.holyFireEffectiveLvl})`
                    : 'Might'}
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-stone-500 dark:text-slate-400">Act 2 Merc</span>
              <span className="font-mono font-medium text-stone-800 dark:text-slate-200 tabular-nums">
                {mercStage ? `Lvl ${mercStage.mercLevel} · ${mercStage.mercBaseStr.split(' ')[0]} Str` : 'Pre-Lvl 20'}
              </span>
            </div>
          </div>

          {/* Stash Readiness Links */}
          <div className="px-4 py-3.5 border-t border-stone-200 dark:border-slate-800 space-y-2.5 text-xs">
            <button
              type="button"
              onClick={() => onSwitchTab('stash')}
              className="w-full text-left group cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-stone-600 dark:text-slate-300 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">
                  Mule Stash Prep
                </span>
                <span className="font-mono font-semibold tabular-nums text-stone-900 dark:text-white">
                  {completedItemsCount} / {MULE_ITEMS.length}
                </span>
              </div>
              <div className="w-full h-1.5 bg-stone-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 dark:bg-emerald-500 transition-transform duration-150 origin-left"
                  style={{ transform: `scaleX(${completedItemsCount / MULE_ITEMS.length})` }}
                />
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSwitchTab('merc')}
              className="w-full text-left group cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-stone-600 dark:text-slate-300 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">
                  Merc Gear Pulled
                </span>
                <span className="font-mono font-semibold tabular-nums text-stone-900 dark:text-white">
                  {completedMercCount} / {MERC_GEAR_PULL_ITEMS.length}
                </span>
              </div>
              <div className="w-full h-1.5 bg-stone-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-600 dark:bg-amber-500 transition-transform duration-150 origin-left"
                  style={{ transform: `scaleX(${completedMercCount / MERC_GEAR_PULL_ITEMS.length})` }}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Interactive Power Spikes Quick Jump (Desktop Only) */}
        <div className="hidden lg:block rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-800 dark:text-slate-200">
              Power Spikes
            </span>
            <span className="text-xs text-stone-500 dark:text-slate-400">Click to jump</span>
          </div>
          <div className="max-h-[260px] overflow-y-auto divide-y divide-stone-100 dark:divide-slate-800/60">
            {QUICK_SPIKES.map((spike) => {
              const spikeIdx = LEVELING_ROWS.findIndex((r) => r.id === spike.rowId);
              const isCurrent = activeRowId === spike.rowId;
              const isPassed = spikeIdx >= 0 && spikeIdx < activeIndex;

              return (
                <button
                  key={spike.rowId}
                  type="button"
                  onClick={() => onSelectRow(spike.rowId)}
                  className={`w-full px-4 py-2 flex items-center justify-between gap-2 text-xs text-left transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-500/12 dark:bg-amber-500/15 text-stone-900 dark:text-white font-semibold'
                      : 'hover:bg-stone-50 dark:hover:bg-slate-800/50 text-stone-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono tabular-nums text-amber-800 dark:text-amber-400 w-11 shrink-0">
                      {spike.label}
                    </span>
                    <span className={`truncate ${isPassed ? 'text-stone-400 dark:text-slate-500' : ''}`}>
                      {spike.note}
                    </span>
                  </div>
                  {isPassed && (
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quiet Utility Footer: Theme + Safe Reset */}
        <div className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-stone-500 dark:text-slate-400">Theme</span>
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-950 text-stone-800 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {darkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-stone-700" />
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2.5 border-t border-stone-200/80 dark:border-slate-800/80">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-stone-600 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-stone-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Saved Progress</span>
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-stone-700 dark:text-slate-300 text-center">
                  Clear all checks and reset to Level 1?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onResetAllProgress();
                      setConfirmReset(false);
                    }}
                    className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-md bg-rose-700 text-white hover:bg-rose-800 transition-colors cursor-pointer"
                  >
                    Confirm Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

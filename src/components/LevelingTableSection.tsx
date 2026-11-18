import React, { useState, useMemo } from 'react';
import { ExternalLink, Check } from 'lucide-react';
import { LEVELING_ROWS, LevelBracket } from '../data/guideData';
import { RichGuideText } from './RichGuideText';

interface LevelingTableSectionProps {
  activeRowId: string;
  onSelectRow: (id: string) => void;
  globalSearch: string;
}

export const LevelingTableSection: React.FC<LevelingTableSectionProps> = ({
  activeRowId,
  onSelectRow,
  globalSearch,
}) => {
  const [bracketFilter, setBracketFilter] = useState<'all' | LevelBracket | 'spikes'>('all');

  const activeRowIndex = useMemo(() => {
    const idx = LEVELING_ROWS.findIndex((r) => r.id === activeRowId);
    return idx >= 0 ? idx : 0;
  }, [activeRowId]);

  const filteredRows = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    return LEVELING_ROWS.filter((row) => {
      if (bracketFilter === 'spikes') {
        if (!row.isMajorSpike && !row.isQuest && row.gearSwapPowerSpike === '—') return false;
      } else if (bracketFilter !== 'all') {
        if (row.bracket !== bracketFilter) return false;
      }

      if (q) {
        const hay = `${row.levelOrQuest} ${row.skillInvested} ${row.activeSkills} ${row.statPoints} ${row.gearSwapPowerSpike}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [bracketFilter, globalSearch]);

  return (
    <section id="leveling-table" className="scroll-mt-36 space-y-6">
      {/* Header & Attribution */}
      <div className="border-b border-stone-200 dark:border-slate-800 pb-6 space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className="text-xs font-mono tracking-wider text-stone-500 dark:text-slate-400">
              02 · COMPLETE SKILL, STAT & GEAR PROGRESSION MATRIX
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-slate-100">
              2. Optimal Holy Fire Leveling Table (Levels 1–40)
            </h2>
          </div>
          <a
            href="https://www.icy-veins.com/d2/paladin-fastest-leveling-build#hammerdin-leveling-table"
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-800 dark:text-amber-400 hover:underline whitespace-nowrap shrink-0"
          >
            <span>Reference: Icy Veins Paladin Leveling Table</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <p className="text-sm text-stone-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Inspired by the Icy Veins Paladin Leveling Table, adapted to keep{' '}
          <RichGuideText text="Holy Fire" /> all the way from Level 1 to 40 with your parsed twink gear.
          Click any milestone row below to update the frozen Active Milestone Tracker at the top.
        </p>

        {/* Base Stat Rules Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
          <div className="rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col justify-between">
            <div className="text-xs font-mono text-stone-500 dark:text-slate-400">
              BASE STARTING STATS (LEVEL 1)
            </div>
            <div className="mt-2 font-mono text-sm sm:text-base font-semibold text-stone-900 dark:text-white tabular-nums flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>Str: 25</span>
              <span className="text-stone-300 dark:text-slate-700">|</span>
              <span>Dex: 20</span>
              <span className="text-stone-300 dark:text-slate-700">|</span>
              <span>Vit: 25</span>
              <span className="text-stone-300 dark:text-slate-700">|</span>
              <span>Ene: 15</span>
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col justify-between">
            <div className="text-xs font-mono text-amber-800 dark:text-amber-400 font-semibold">
              TOTAL STAT RULE (LEVELS 2–40)
            </div>
            <p className="mt-1.5 text-xs sm:text-sm text-stone-700 dark:text-slate-300 leading-relaxed">
              Put your first <strong className="font-mono font-semibold text-stone-900 dark:text-white">35 points (Levels 2–8)</strong> into{' '}
              <strong className="font-semibold text-stone-900 dark:text-white">Strength</strong> to hit 60 Base Str (70 Total Str with{' '}
              <RichGuideText text="Sigon's Gage" />), then dump{' '}
              <strong className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">100% of remaining points into Vitality</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Bracket Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-stone-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 dark:bg-slate-950 rounded-md">
          {(
            [
              { key: 'all', label: 'All Rows (44)' },
              { key: '1-7', label: 'Lvls 1–7 (Act 1 Early)' },
              { key: '8-14', label: 'Lvls 8–14 (Act 1 Mid)' },
              { key: '15-22', label: 'Lvls 15–22 (Act 1–2)' },
              { key: '23-29', label: 'Lvls 23–29 (Act 3–4)' },
              { key: '30-40', label: 'Lvls 30–40 (Act 5 / Baal)' },
              { key: 'spikes', label: 'Gear Swaps & Quests Only' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setBracketFilter(tab.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                bracketFilter === tab.key
                  ? 'bg-white dark:bg-slate-800 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-stone-500 dark:text-slate-400 px-2">
          Showing {filteredRows.length} of {LEVELING_ROWS.length} rows
        </div>
      </div>

      {/* Main 1–40 Progression Table */}
      <div className="rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-slate-800 text-[11px] font-mono text-stone-500 dark:text-slate-400 bg-stone-50/70 dark:bg-slate-950/50">
                <th className="py-3 pl-5 pr-3 whitespace-nowrap">Level / Quest</th>
                <th className="py-3 px-3 min-w-[200px]">Skill Point Invested (Running Total)</th>
                <th className="py-3 px-3 min-w-[180px]">Active L-Click / R-Click</th>
                <th className="py-3 px-3 min-w-[180px]">Stat Points (+5/lvl)</th>
                <th className="py-3 pl-3 pr-5 min-w-[300px]">Gear Swap / Power Spike</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/70 dark:divide-slate-800/70 text-sm">
              {filteredRows.map((row) => {
                const isSelected = row.id === activeRowId;
                const rowIdx = LEVELING_ROWS.findIndex((r) => r.id === row.id);
                const isCompleted = rowIdx < activeRowIndex;

                return (
                  <tr
                    key={row.id}
                    onClick={() => onSelectRow(row.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/12 dark:bg-amber-500/15'
                        : row.isMajorSpike
                        ? 'bg-amber-50/35 dark:bg-amber-950/10 hover:bg-stone-100/80 dark:hover:bg-slate-800/50'
                        : row.isQuest
                        ? 'bg-stone-50/80 dark:bg-slate-900/80 hover:bg-stone-100/80 dark:hover:bg-slate-800/50'
                        : 'hover:bg-stone-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-2.5 pl-5 pr-3 font-mono text-xs tabular-nums whitespace-nowrap align-top">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-4 h-4 rounded-sm flex items-center justify-center text-[10px] border ${
                            isSelected
                              ? 'border-amber-600 bg-amber-600 text-white font-bold'
                              : isCompleted
                              ? 'border-emerald-600/50 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400'
                              : 'border-stone-300 dark:border-slate-700 text-transparent'
                          }`}
                        >
                          {isSelected ? '▸' : isCompleted ? <Check className="w-2.5 h-2.5" /> : '·'}
                        </span>
                        <span
                          className={
                            row.isQuest
                              ? 'font-semibold text-amber-800 dark:text-amber-400'
                              : isSelected
                              ? 'font-bold text-stone-900 dark:text-white'
                              : 'font-semibold text-stone-800 dark:text-slate-200'
                          }
                        >
                          {row.levelOrQuest}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-xs text-stone-800 dark:text-slate-200 align-top">
                      <RichGuideText text={row.skillInvested} />
                    </td>
                    <td className="py-2.5 px-3 font-mono text-xs text-stone-600 dark:text-slate-400 align-top">
                      <RichGuideText text={row.activeSkills} />
                    </td>
                    <td className="py-2.5 px-3 font-mono text-xs tabular-nums text-stone-700 dark:text-slate-300 align-top">
                      {row.statPoints}
                    </td>
                    <td
                      className={`py-2.5 pl-3 pr-5 text-xs sm:text-sm align-top leading-relaxed ${
                        row.gearSwapPowerSpike === '—'
                          ? 'text-stone-400 dark:text-slate-600 font-mono'
                          : 'text-stone-700 dark:text-slate-300'
                      }`}
                    >
                      <RichGuideText text={row.gearSwapPowerSpike} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

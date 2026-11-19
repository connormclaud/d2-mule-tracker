import React, { useState, useMemo, useRef } from 'react';
import { ExternalLink, Check, Crosshair } from 'lucide-react';
import { LEVELING_ROWS, LevelBracket } from '../data/guideData';
import { RichGuideText } from './RichGuideText';

interface LevelingTableSectionProps {
  activeRowId: string;
  onSelectRow: (id: string) => void;
}

export const LevelingTableSection: React.FC<LevelingTableSectionProps> = ({
  activeRowId,
  onSelectRow,
}) => {
  const [bracketFilter, setBracketFilter] = useState<'all' | LevelBracket | 'spikes'>('all');
  const activeRowRef = useRef<HTMLTableRowElement | null>(null);

  const activeRowIndex = useMemo(() => {
    const idx = LEVELING_ROWS.findIndex((r) => r.id === activeRowId);
    return idx >= 0 ? idx : 0;
  }, [activeRowId]);

  const filteredRows = useMemo(() => {
    return LEVELING_ROWS.filter((row) => {
      if (bracketFilter === 'spikes') {
        return row.isMajorSpike || row.isQuest || row.gearSwapPowerSpike !== '—';
      }
      if (bracketFilter !== 'all') {
        return row.bracket === bracketFilter;
      }
      return true;
    });
  }, [bracketFilter]);

  const handleScrollToActive = () => {
    setBracketFilter('all');
    setTimeout(() => {
      activeRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 30);
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-stone-200 dark:border-slate-800">
        <div className="space-y-1">
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-white"
            style={{ textWrap: 'balance' }}
          >
            Levels 1–40 Skill, Stat &amp; Gear Matrix
          </h1>
          <p className="text-sm text-stone-600 dark:text-slate-300 max-w-2xl">
            Click any milestone row to set it as your active level across the entire guide.
          </p>
        </div>

        <a
          href="https://www.icy-veins.com/d2/paladin-fastest-leveling-build#hammerdin-leveling-table"
          target="_blank"
          rel="noopener noreferrer"
          referrerPolicy="no-referrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 dark:text-amber-400 hover:underline whitespace-nowrap shrink-0"
        >
          <span>Icy Veins Reference</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Single Flat Stat Allocation Rule Bar */}
      <div className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-200 dark:divide-slate-800">
        <div className="lg:col-span-4 px-5 py-4 space-y-1">
          <div className="text-xs font-medium text-stone-500 dark:text-slate-400">
            Paladin Starting Stats (Lvl 1)
          </div>
          <div className="font-mono text-sm font-semibold text-stone-900 dark:text-white tabular-nums flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>25 Str</span>
            <span aria-hidden="true" className="text-stone-300 dark:text-slate-700">·</span>
            <span>20 Dex</span>
            <span aria-hidden="true" className="text-stone-300 dark:text-slate-700">·</span>
            <span>25 Vit</span>
            <span aria-hidden="true" className="text-stone-300 dark:text-slate-700">·</span>
            <span>15 Ene</span>
          </div>
        </div>
        <div className="lg:col-span-8 px-5 py-4 space-y-1">
          <div className="text-xs font-medium text-amber-800 dark:text-amber-400">
            Stat Allocation Rule (Levels 2–40)
          </div>
          <p className="text-sm text-stone-700 dark:text-slate-300 leading-relaxed">
            Invest your first <strong className="font-mono font-semibold text-stone-900 dark:text-white">35 points (Levels 2–8)</strong> into{' '}
            <strong className="font-semibold text-stone-900 dark:text-white">Strength</strong> (60 Base → 70 Str with{' '}
            <RichGuideText text="Sigon's Gage" />), then put{' '}
            <strong className="font-semibold text-emerald-700 dark:text-emerald-400">100% of remaining points into Vitality</strong> (0 Dex).
          </p>
        </div>
      </div>

      {/* Filter Bar + Scroll to Active */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-200/70 dark:bg-slate-900 rounded-lg border border-stone-200 dark:border-slate-800">
          {(
            [
              { key: 'all', label: 'All (44)' },
              { key: '1-7', label: '1–7' },
              { key: '8-14', label: '8–14' },
              { key: '15-22', label: '15–22' },
              { key: '23-29', label: '23–29' },
              { key: '30-40', label: '30–40' },
              { key: 'spikes', label: 'Swaps & Quests' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setBracketFilter(tab.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                bracketFilter === tab.key
                  ? 'bg-white dark:bg-slate-800 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleScrollToActive}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Crosshair className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
          <span>Locate Active Level</span>
        </button>
      </div>

      {/* Main 1–40 Table */}
      <div className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-slate-800 text-xs font-medium text-stone-500 dark:text-slate-400 bg-stone-50/70 dark:bg-slate-950/50">
                <th className="py-3 pl-5 pr-3 whitespace-nowrap">Level / Quest</th>
                <th className="py-3 px-3 min-w-[180px]">Skill Invested</th>
                <th className="py-3 px-3 min-w-[165px]">L-Click / R-Click</th>
                <th className="py-3 px-3 min-w-[175px]">Stat Points</th>
                <th className="py-3 pl-3 pr-5 min-w-[280px]">Gear Swap / Power Spike</th>
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
                    ref={isSelected ? activeRowRef : null}
                    onClick={() => onSelectRow(row.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 dark:bg-amber-500/18'
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
                          className={`w-4 h-4 rounded-sm flex items-center justify-center text-[10px] border shrink-0 ${
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
                        {isSelected && (
                          <span className="text-[11px] font-sans font-semibold text-amber-800 dark:text-amber-400">
                            Active
                          </span>
                        )}
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

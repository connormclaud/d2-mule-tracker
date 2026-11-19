import React, { useState, useMemo, useEffect } from 'react';
import {
  Check,
  Search,
  RotateCcw,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
} from 'lucide-react';
import { MULE_GROUPS, MULE_ITEMS, MuleGroupKey, MuleItem } from '../data/guideData';
import { RichGuideText } from './RichGuideText';

interface MuleTransferSectionProps {
  checkedItems: Record<string, boolean>;
  onToggleItem: (id: string) => void;
  onSetAllItems: (checked: boolean) => void;
  onSetGroupItems: (groupKey: MuleGroupKey, checked: boolean) => void;
  initialGroup?: 'all' | MuleGroupKey;
  initialSearch?: string;
}

const SHORT_GROUP_LABELS: Record<MuleGroupKey, string> = {
  mule_leveling: 'A. mule_leveling',
  mule_unique: 'B. mule_unique',
  mulejewelbase_charms: 'C. Jewelbase & Charms',
  shared_stash: 'D. Shared Stash',
  sork_stash: 'E. sork Stash',
  sork_inv_gear: 'F. sork Inv & Gear',
};

export const MuleTransferSection: React.FC<MuleTransferSectionProps> = ({
  checkedItems,
  onToggleItem,
  onSetAllItems,
  onSetGroupItems,
  initialGroup = 'all',
  initialSearch = '',
}) => {
  const [selectedGroup, setSelectedGroup] = useState<'all' | MuleGroupKey>(initialGroup);
  const [localSearch, setLocalSearch] = useState(initialSearch);
  const [onlyUnchecked, setOnlyUnchecked] = useState(false);
  const [sortByLevel, setSortByLevel] = useState(false);
  const [showSynergyNote, setShowSynergyNote] = useState(false);

  useEffect(() => {
    setSelectedGroup(initialGroup);
  }, [initialGroup]);

  useEffect(() => {
    if (initialSearch) {
      setLocalSearch(initialSearch);
    }
  }, [initialSearch]);

  const effectiveSearch = localSearch.trim().toLowerCase();

  const groupStats = useMemo(() => {
    const stats: Record<MuleGroupKey, { total: number; done: number }> = {
      mule_leveling: { total: 0, done: 0 },
      mule_unique: { total: 0, done: 0 },
      mulejewelbase_charms: { total: 0, done: 0 },
      shared_stash: { total: 0, done: 0 },
      sork_stash: { total: 0, done: 0 },
      sork_inv_gear: { total: 0, done: 0 },
    };
    for (const item of MULE_ITEMS) {
      stats[item.groupKey].total += 1;
      if (checkedItems[item.id]) stats[item.groupKey].done += 1;
    }
    return stats;
  }, [checkedItems]);

  const filteredItemsByGroup = useMemo(() => {
    const map: Record<MuleGroupKey, MuleItem[]> = {
      mule_leveling: [],
      mule_unique: [],
      mulejewelbase_charms: [],
      shared_stash: [],
      sork_stash: [],
      sork_inv_gear: [],
    };

    for (const item of MULE_ITEMS) {
      if (selectedGroup !== 'all' && item.groupKey !== selectedGroup) continue;
      if (onlyUnchecked && checkedItems[item.id]) continue;
      if (effectiveSearch) {
        const haystack = `${item.item} ${item.currentLocation} ${item.equipLvlDisplay} ${item.reqStrDex} ${item.roleInLeveling} ${item.slotOrType}`.toLowerCase();
        if (!haystack.includes(effectiveSearch)) continue;
      }
      map[item.groupKey].push(item);
    }

    if (sortByLevel) {
      (Object.keys(map) as MuleGroupKey[]).forEach((k) => {
        map[k].sort((a, b) => a.equipLvlNumeric - b.equipLvlNumeric);
      });
    }

    return map;
  }, [selectedGroup, onlyUnchecked, effectiveSearch, checkedItems, sortByLevel]);

  const totalItems = MULE_ITEMS.length;
  const completedCount = useMemo(
    () => MULE_ITEMS.filter((i) => checkedItems[i.id]).length,
    [checkedItems]
  );

  const totalVisibleItems = useMemo(
    () => Object.values(filteredItemsByGroup).reduce((acc, arr) => acc + arr.length, 0),
    [filteredItemsByGroup]
  );

  const getRarityTextClass = (rarity: MuleItem['rarity']) => {
    switch (rarity) {
      case 'Unique':
        return 'text-amber-800 dark:text-amber-300 font-semibold';
      case 'Set':
        return 'text-emerald-800 dark:text-emerald-400 font-semibold';
      case 'Runeword':
        return 'text-orange-800 dark:text-orange-300 font-semibold';
      case 'Magic':
        return 'text-blue-800 dark:text-sky-400 font-semibold';
      case 'Rare':
        return 'text-yellow-800 dark:text-yellow-300 font-semibold';
      case 'Base':
        return 'text-stone-900 dark:text-slate-100 font-semibold';
    }
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-stone-200 dark:border-slate-800">
        <div className="space-y-1">
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-white"
            style={{ textWrap: 'balance' }}
          >
            Stash &amp; Mule Consolidation Checklist
          </h1>
          <p className="text-sm text-stone-600 dark:text-slate-300 max-w-2xl">
            Work through one character or stash tab at a time before starting your Paladin. Click any row to check it off.
          </p>
        </div>

        <div className="flex items-center gap-3 text-sm font-mono tabular-nums text-stone-600 dark:text-slate-300 shrink-0">
          <span>
            <strong className="text-stone-900 dark:text-white">{completedCount}</strong> / {totalItems} moved
          </span>
          <span aria-hidden="true">·</span>
          <span>{Math.round((completedCount / totalItems) * 100)}%</span>
        </div>
      </div>

      {/* Mule-by-Mule Guided Selector Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-7 gap-2">
        <button
          type="button"
          onClick={() => setSelectedGroup('all')}
          className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
            selectedGroup === 'all'
              ? 'border-amber-600 bg-amber-50/70 dark:bg-amber-950/30 text-stone-900 dark:text-white'
              : 'border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-stone-700 dark:text-slate-300 hover:border-stone-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="text-xs font-semibold truncate">All Mules</div>
          <div className="mt-1 font-mono text-xs tabular-nums text-stone-500 dark:text-slate-400">
            {completedCount} / {totalItems}
          </div>
        </button>

        {MULE_GROUPS.map((group) => {
          const st = groupStats[group.key];
          const isComplete = st.done === st.total && st.total > 0;
          const isSelected = selectedGroup === group.key;

          return (
            <button
              key={group.key}
              type="button"
              onClick={() => setSelectedGroup(group.key)}
              className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                isSelected
                  ? 'border-amber-600 bg-amber-50/70 dark:bg-amber-950/30 text-stone-900 dark:text-white'
                  : 'border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-stone-700 dark:text-slate-300 hover:border-stone-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold truncate">
                  {SHORT_GROUP_LABELS[group.key]}
                </span>
                {isComplete && (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
              </div>
              <div className="mt-1 font-mono text-xs tabular-nums text-stone-500 dark:text-slate-400">
                {st.done} / {st.total} {isComplete ? '· Done' : ''}
              </div>
            </button>
          );
        })}
      </div>

      {/* Collapsible Zero-Dex Stat Synergy Explainer */}
      <div className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowSynergyNote((s) => !s)}
          aria-expanded={showSynergyNote}
          className="w-full px-5 py-3.5 flex items-center justify-between gap-4 text-left hover:bg-stone-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
        >
          <div className="text-xs sm:text-sm font-medium text-stone-800 dark:text-slate-200">
            <span className="text-amber-800 dark:text-amber-400 font-semibold">
              Stat Synergy Note:
            </span>{' '}
            Why this stash list lets you invest 0 points in Dexterity (Levels 1–40) and stop Strength at 60 base
          </div>
          {showSynergyNote ? (
            <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
          )}
        </button>

        {showSynergyNote && (
          <div className="px-5 py-4 border-t border-stone-200 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <p className="lg:col-span-6 text-sm leading-relaxed text-stone-700 dark:text-slate-300">
              By grabbing two Dexterity charms from{' '}
              <strong className="font-semibold text-stone-900 dark:text-white">Shared Stash Tab 5</strong>{' '}
              (<span className="font-mono text-xs">+6 Dex GC</span> +{' '}
              <span className="font-mono text-xs">+4 Dex LC</span>) alongside{' '}
              <strong className="font-semibold text-stone-900 dark:text-white">Stealth</strong> (
              <span className="font-mono text-xs">+6 Dex</span>), your Paladin&apos;s base{' '}
              <span className="font-mono text-xs">20 Dexterity</span> reaches{' '}
              <strong className="font-mono font-semibold text-stone-900 dark:text-white">36 Dexterity</strong>{' '}
              automatically. You need{' '}
              <strong className="font-semibold text-emerald-700 dark:text-emerald-400">
                0 stat points in Dexterity from Levels 1–40
              </strong>{' '}
              (covering Kinemil&apos;s Awl [34 Dex] and Black [35 Dex]), and only{' '}
              <strong className="font-semibold text-stone-900 dark:text-white">35 points in Strength</strong>{' '}
              (60 base Str at Level 8 → 70 Str with Sigon&apos;s Gage).
            </p>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-stone-200 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-4">
                <div className="font-semibold text-stone-800 dark:text-slate-200">
                  Dexterity Chain (0 pts)
                </div>
                <div className="flex justify-between text-stone-600 dark:text-slate-400">
                  <span>Paladin Base (Lvl 1)</span>
                  <span className="tabular-nums">20</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-slate-400">
                  <span>Beryl GC (Lvl 10, Tab 5)</span>
                  <span className="tabular-nums">+6 (26)</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-slate-400">
                  <span>Dex LC (Lvl 13, Tab 5)</span>
                  <span className="tabular-nums">+4 (30)</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-slate-400">
                  <span>Stealth (Lvl 17 Armor)</span>
                  <span className="tabular-nums">+6 (36)</span>
                </div>
                <div className="border-t border-stone-200 dark:border-slate-800 pt-1 flex justify-between font-semibold text-emerald-700 dark:text-emerald-400">
                  <span>With Tearhaunch (29)</span>
                  <span className="tabular-nums">41 Dex</span>
                </div>
              </div>

              <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-stone-200 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-4">
                <div className="font-semibold text-stone-800 dark:text-slate-200">
                  Strength Chain (35 pts)
                </div>
                <div className="flex justify-between text-stone-600 dark:text-slate-400">
                  <span>Paladin Base (Lvl 1)</span>
                  <span className="tabular-nums">25</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-slate-400">
                  <span>Lvls 2–8 (+5 Str/lvl)</span>
                  <span className="tabular-nums">+35 (60)</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-slate-400">
                  <span>Sigon&apos;s Gage (Lvl 8)</span>
                  <span className="tabular-nums">+10 (70)</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-slate-400">
                  <span>Tearhaunch (Lvl 29)</span>
                  <span className="tabular-nums">+5 (75)</span>
                </div>
                <div className="border-t border-stone-200 dark:border-slate-800 pt-1 flex justify-between font-semibold text-amber-800 dark:text-amber-400">
                  <span>Lvls 9–40 Allocation</span>
                  <span className="tabular-nums">100% Vit</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter & Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="w-4 h-4 text-stone-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Filter items, locations, or roles..."
            aria-label="Filter mule items"
            className="w-full h-10 pl-9 pr-3 text-sm bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-lg text-stone-900 dark:text-slate-100 placeholder:text-stone-400 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSortByLevel((s) => !s)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              sortByLevel
                ? 'bg-amber-600/10 border-amber-600/40 text-amber-900 dark:text-amber-300'
                : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortByLevel ? 'Sorted by Equip Level' : 'Sort by Equip Level'}</span>
          </button>

          <button
            type="button"
            onClick={() => setOnlyUnchecked((prev) => !prev)}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              onlyUnchecked
                ? 'bg-amber-600/10 border-amber-600/40 text-amber-900 dark:text-amber-300'
                : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
            }`}
          >
            {onlyUnchecked ? 'Showing Remaining Only' : 'Show Remaining Only'}
          </button>

          <button
            type="button"
            onClick={() => onSetAllItems(completedCount < totalItems)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {completedCount < totalItems ? (
              <>
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Mark All Moved</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Uncheck All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Empty Filter State */}
      {totalVisibleItems === 0 && (
        <div className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center space-y-3">
          <p className="text-sm font-semibold text-stone-900 dark:text-white">
            {onlyUnchecked && !effectiveSearch
              ? 'All items in this view are checked off!'
              : 'No items match your current filter.'}
          </p>
          <p className="text-xs text-stone-500 dark:text-slate-400">
            Clear your search or switch to All Mules to review completed items.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedGroup('all');
              setLocalSearch('');
              setOnlyUnchecked(false);
            }}
            className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Mule Tables */}
      <div className="space-y-6">
        {MULE_GROUPS.map((group) => {
          const items = filteredItemsByGroup[group.key];
          if (items.length === 0) return null;

          const st = groupStats[group.key];
          const allGroupDone = st.done === st.total;

          return (
            <div
              key={group.key}
              className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
            >
              {/* Group Subheader */}
              <div className="px-5 py-4 border-b border-stone-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-stone-50/70 dark:bg-slate-950/50">
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-stone-900 dark:text-white">
                    {group.title}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                    {group.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono tabular-nums text-stone-500 dark:text-slate-400">
                    {st.done} / {st.total} moved
                  </span>
                  <button
                    type="button"
                    onClick={() => onSetGroupItems(group.key, !allGroupDone)}
                    className="px-3 py-1.5 text-xs font-medium rounded-md border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {allGroupDone ? 'Uncheck Group' : 'Mark Group Done'}
                  </button>
                </div>
              </div>

              {/* Clean High-Density Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-slate-800 text-xs font-medium text-stone-500 dark:text-slate-400 bg-stone-50/40 dark:bg-slate-950/30">
                      <th className="py-2.5 pl-5 pr-2 w-12">Done</th>
                      <th className="py-2.5 px-3 min-w-[210px]">Item</th>
                      <th className="py-2.5 px-3 min-w-[140px]">Location</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">Lvl</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">Str / Dex</th>
                      <th className="py-2.5 pl-3 pr-5 min-w-[260px]">Role in Leveling</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200/70 dark:divide-slate-800/70 text-sm">
                    {items.map((row) => {
                      const isChecked = !!checkedItems[row.id];
                      return (
                        <tr
                          key={row.id}
                          onClick={() => onToggleItem(row.id)}
                          className={`group transition-colors cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-50/40 dark:bg-emerald-950/15 text-stone-400 dark:text-slate-500'
                              : 'hover:bg-stone-50 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="py-3 pl-5 pr-2 align-top">
                            <button
                              type="button"
                              aria-label={`Mark ${row.item} as moved`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleItem(row.id);
                              }}
                              className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors cursor-pointer ${
                                isChecked
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-950 group-hover:border-stone-400'
                              }`}
                            >
                              {isChecked ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : null}
                            </button>
                          </td>
                          <td className="py-3 px-3 align-top">
                            <div className={isChecked ? 'line-through' : getRarityTextClass(row.rarity)}>
                              {row.item}
                            </div>
                            <div className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                              {row.rarity} · {row.slotOrType}
                            </div>
                          </td>
                          <td className="py-3 px-3 align-top font-mono text-xs text-stone-700 dark:text-slate-300 whitespace-nowrap">
                            {row.currentLocation}
                          </td>
                          <td className="py-3 px-3 align-top font-mono text-xs tabular-nums text-right text-stone-900 dark:text-slate-100 whitespace-nowrap font-semibold">
                            {row.equipLvlDisplay}
                          </td>
                          <td className="py-3 px-3 align-top font-mono text-xs tabular-nums text-right text-stone-600 dark:text-slate-400 whitespace-nowrap">
                            {row.reqStrDex}
                          </td>
                          <td className="py-3 pl-3 pr-5 align-top text-stone-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                            <RichGuideText text={row.roleInLeveling} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {group.footnote && (
                <div className="px-5 py-3 bg-stone-50 dark:bg-slate-950/60 border-t border-stone-200 dark:border-slate-800 text-xs text-stone-600 dark:text-slate-400">
                  <strong className="font-semibold text-stone-800 dark:text-slate-200">Note:</strong>{' '}
                  {group.footnote}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

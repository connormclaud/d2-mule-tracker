import React, { useState, useMemo } from 'react';
import { Check, Search, RotateCcw, CheckSquare } from 'lucide-react';
import { MULE_GROUPS, MULE_ITEMS, MuleGroupKey, MuleItem } from '../data/guideData';
import { RichGuideText } from './RichGuideText';

interface MuleTransferSectionProps {
  checkedItems: Record<string, boolean>;
  onToggleItem: (id: string) => void;
  onSetAllItems: (checked: boolean) => void;
  globalSearch: string;
}

export const MuleTransferSection: React.FC<MuleTransferSectionProps> = ({
  checkedItems,
  onToggleItem,
  onSetAllItems,
  globalSearch,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<'all' | MuleGroupKey>('all');
  const [localSearch, setLocalSearch] = useState('');
  const [onlyUnchecked, setOnlyUnchecked] = useState(false);

  const effectiveSearch = (globalSearch || localSearch).trim().toLowerCase();

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

    return map;
  }, [selectedGroup, onlyUnchecked, effectiveSearch, checkedItems]);

  const countsByGroup = useMemo(() => {
    const counts: Record<MuleGroupKey, number> = {
      mule_leveling: 0,
      mule_unique: 0,
      mulejewelbase_charms: 0,
      shared_stash: 0,
      sork_stash: 0,
      sork_inv_gear: 0,
    };
    for (const item of MULE_ITEMS) {
      counts[item.groupKey] += 1;
    }
    return counts;
  }, []);

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
        return 'text-blue-800 dark:text-blue-400 font-semibold';
      case 'Rare':
        return 'text-yellow-700 dark:text-yellow-300 font-semibold';
      case 'Base':
        return 'text-stone-800 dark:text-slate-200 font-semibold';
    }
  };

  return (
    <section id="mule-prep" className="scroll-mt-36 space-y-8">
      {/* Section Header */}
      <div className="border-b border-stone-200 dark:border-slate-800 pb-6">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className="text-xs font-mono tracking-wider text-stone-500 dark:text-slate-400">
              01 · PRE-RUN INVENTORY & STASH CONSOLIDATION
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-slate-100">
              1. What to Move to Your Paladin / Shared Stash Before Starting
            </h2>
          </div>
          <div className="flex items-center gap-3 text-sm font-mono tabular-nums text-stone-600 dark:text-slate-300">
            <span>
              Transferred: <strong className="text-stone-900 dark:text-white">{completedCount}</strong> / {totalItems}
            </span>
            <span aria-hidden="true">·</span>
            <span>{Math.round((completedCount / totalItems) * 100)}% Ready</span>
          </div>
        </div>

        {/* Hidden Stat Synergy Architecture Box */}
        <div className="mt-6 rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <div className="text-xs font-mono text-amber-800 dark:text-amber-400 font-semibold">
                Hidden Stat Synergy · Zero Base Dexterity Investment (Levels 1–40)
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-stone-700 dark:text-slate-300">
                Your muling setup has a hidden stat synergy: by grabbing two Dexterity charms from{' '}
                <strong className="font-semibold text-stone-900 dark:text-white">Shared Stash Tab 5</strong>{' '}
                (<span className="font-mono text-xs sm:text-sm">+6 Dex GC</span> +{' '}
                <span className="font-mono text-xs sm:text-sm">+4 Dex LC</span>) alongside{' '}
                <strong className="font-semibold text-stone-900 dark:text-white">Stealth</strong> (
                <span className="font-mono text-xs sm:text-sm">+6 Dex</span>), your Paladin&apos;s base{' '}
                <span className="font-mono text-xs sm:text-sm">20 Dexterity</span> reaches{' '}
                <strong className="font-mono font-semibold text-stone-900 dark:text-white">36 Dexterity</strong>{' '}
                automatically. That means you need{' '}
                <strong className="font-semibold text-emerald-700 dark:text-emerald-400">
                  0 stat points in Dexterity from Levels 1–40
                </strong>{' '}
                (even for Kinemil&apos;s Awl [34 Dex] and Black [35 Dex]), and only{' '}
                <strong className="font-semibold text-stone-900 dark:text-white">35 points in Strength</strong>{' '}
                (reaching 60 base Str at Level 8, which Sigon&apos;s Gage boosts to 70 Str).
              </p>
            </div>

            {/* Tabular Stat Equation Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0 lg:w-96 font-mono text-xs">
              <div className="rounded border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950/60 p-3 space-y-1.5">
                <div className="text-stone-500 dark:text-slate-400">DEXTERITY CHAIN (0 PTS)</div>
                <div className="flex justify-between text-stone-700 dark:text-slate-300">
                  <span>Paladin Base (Lvl 1)</span>
                  <span className="tabular-nums">20</span>
                </div>
                <div className="flex justify-between text-stone-700 dark:text-slate-300">
                  <span>Beryl GC (Lvl 10, Tab 5)</span>
                  <span className="tabular-nums">+6 (26)</span>
                </div>
                <div className="flex justify-between text-stone-700 dark:text-slate-300">
                  <span>Dex LC (Lvl 13, Tab 5)</span>
                  <span className="tabular-nums">+4 (30)</span>
                </div>
                <div className="flex justify-between text-stone-700 dark:text-slate-300">
                  <span>Stealth (Lvl 17 Armor)</span>
                  <span className="tabular-nums">+6 (36)</span>
                </div>
                <div className="border-t border-stone-200 dark:border-slate-800 pt-1 flex justify-between font-semibold text-emerald-700 dark:text-emerald-400">
                  <span>Total w/ Tearhaunch (29)</span>
                  <span className="tabular-nums">41 Dex</span>
                </div>
              </div>

              <div className="rounded border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950/60 p-3 space-y-1.5">
                <div className="text-stone-500 dark:text-slate-400">STRENGTH CHAIN (35 PTS)</div>
                <div className="flex justify-between text-stone-700 dark:text-slate-300">
                  <span>Paladin Base (Lvl 1)</span>
                  <span className="tabular-nums">25</span>
                </div>
                <div className="flex justify-between text-stone-700 dark:text-slate-300">
                  <span>Lvls 2–8 (+5 Str/lvl)</span>
                  <span className="tabular-nums">+35 (60)</span>
                </div>
                <div className="flex justify-between text-stone-700 dark:text-slate-300">
                  <span>Sigon&apos;s Gage (Lvl 8)</span>
                  <span className="tabular-nums">+10 (70)</span>
                </div>
                <div className="flex justify-between text-stone-700 dark:text-slate-300">
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
        </div>
      </div>

      {/* Interactive Filter & Checklist Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg border border-stone-200 dark:border-slate-800">
        {/* Segmented Source Filter Controls */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 dark:bg-slate-950 rounded-md">
          <button
            type="button"
            onClick={() => setSelectedGroup('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedGroup === 'all'
                ? 'bg-white dark:bg-slate-800 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            All Sources ({MULE_ITEMS.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedGroup('mule_leveling')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedGroup === 'mule_leveling'
                ? 'bg-white dark:bg-slate-800 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            A. mule_leveling ({countsByGroup.mule_leveling})
          </button>
          <button
            type="button"
            onClick={() => setSelectedGroup('mule_unique')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedGroup === 'mule_unique'
                ? 'bg-white dark:bg-slate-800 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            B. mule_unique ({countsByGroup.mule_unique})
          </button>
          <button
            type="button"
            onClick={() => setSelectedGroup('mulejewelbase_charms')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedGroup === 'mulejewelbase_charms'
                ? 'bg-white dark:bg-slate-800 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            C. Jewelbase & Charms ({countsByGroup.mulejewelbase_charms})
          </button>
          <button
            type="button"
            onClick={() => setSelectedGroup('shared_stash')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedGroup === 'shared_stash'
                ? 'bg-white dark:bg-slate-800 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            D. Shared Stash ({countsByGroup.shared_stash})
          </button>
          <button
            type="button"
            onClick={() => setSelectedGroup('sork_stash')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedGroup === 'sork_stash'
                ? 'bg-white dark:bg-slate-800 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            E. sork Stash ({countsByGroup.sork_stash})
          </button>
          <button
            type="button"
            onClick={() => setSelectedGroup('sork_inv_gear')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedGroup === 'sork_inv_gear'
                ? 'bg-white dark:bg-slate-800 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            F. sork Inv & Gear ({countsByGroup.sork_inv_gear})
          </button>
        </div>

        {/* Search & Checklist Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-stone-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filter items, stats, tabs..."
              aria-label="Filter mule items"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded text-stone-900 dark:text-slate-100 placeholder:text-stone-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-600/40"
            />
          </div>

          <button
            type="button"
            onClick={() => setOnlyUnchecked((prev) => !prev)}
            className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              onlyUnchecked
                ? 'bg-amber-600/10 border-amber-600/40 text-amber-900 dark:text-amber-300'
                : 'bg-stone-50 dark:bg-slate-950 border-stone-200 dark:border-slate-800 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
            }`}
          >
            {onlyUnchecked ? 'Showing Missing Only' : 'Show Missing Only'}
          </button>

          <button
            type="button"
            onClick={() => onSetAllItems(completedCount < totalItems)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {completedCount < totalItems ? (
              <>
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Mark All Moved</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Checks</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Empty Search State */}
      {totalVisibleItems === 0 && (
        <div className="rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center space-y-3">
          <p className="text-sm font-medium text-stone-800 dark:text-slate-200">
            No mule items match your current filter criteria.
          </p>
          <p className="text-xs text-stone-500 dark:text-slate-400">
            Try clearing the search query or switching back to All Sources.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedGroup('all');
              setLocalSearch('');
              setOnlyUnchecked(false);
            }}
            className="px-4 py-2 text-xs font-medium bg-stone-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded hover:opacity-90 transition-opacity cursor-pointer"
          >
            Reset Item Filters
          </button>
        </div>
      )}

      {/* Tables per Mule Group */}
      <div className="space-y-8">
        {MULE_GROUPS.map((group) => {
          const items = filteredItemsByGroup[group.key];
          if (items.length === 0) return null;

          const groupCheckedCount = items.filter((i) => checkedItems[i.id]).length;

          return (
            <div
              key={group.key}
              className="rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
            >
              {/* Group Subheader */}
              <div className="px-5 py-4 border-b border-stone-200 dark:border-slate-800 flex flex-wrap items-baseline justify-between gap-2 bg-stone-50/70 dark:bg-slate-950/50">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-slate-100">
                    {group.title}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                    {group.subtitle}
                  </p>
                </div>
                <span className="text-xs font-mono tabular-nums text-stone-500 dark:text-slate-400">
                  {groupCheckedCount} / {items.length} moved
                </span>
              </div>

              {/* High-Density Documentation Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-slate-800 text-[11px] font-mono text-stone-500 dark:text-slate-400 bg-stone-50/40 dark:bg-slate-950/30">
                      <th className="py-2.5 pl-5 pr-2 w-10">Moved</th>
                      <th className="py-2.5 px-3 min-w-[210px]">Item</th>
                      <th className="py-2.5 px-3 min-w-[140px]">Current Location</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">Equip Lvl</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">Req Str / Dex</th>
                      <th className="py-2.5 pl-3 pr-5 min-w-[280px]">Role in Leveling (1–40)</th>
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
                              className={`w-5 h-5 rounded flex items-center justify-center border transition-colors cursor-pointer ${
                                isChecked
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-950 group-hover:border-stone-400'
                              }`}
                            >
                              {isChecked ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : null}
                            </button>
                          </td>
                          <td className="py-3 px-3 align-top">
                            <div className={isChecked ? 'line-through' : getRarityTextClass(row.rarity)}>
                              {row.item}
                            </div>
                            <div className="text-xs text-stone-500 dark:text-slate-400 mt-0.5 font-mono">
                              {row.rarity} · {row.slotOrType}
                            </div>
                          </td>
                          <td className="py-3 px-3 align-top font-mono text-xs text-stone-700 dark:text-slate-300 whitespace-nowrap">
                            {row.currentLocation}
                          </td>
                          <td className="py-3 px-3 align-top font-mono text-xs tabular-nums text-right text-stone-800 dark:text-slate-200 whitespace-nowrap font-semibold">
                            {row.equipLvlDisplay}
                          </td>
                          <td className="py-3 px-3 align-top font-mono text-xs tabular-nums text-right text-stone-600 dark:text-slate-400 whitespace-nowrap">
                            {row.reqStrDex}
                          </td>
                          <td className="py-3 pl-3 pr-5 align-top text-stone-700 dark:text-slate-300 leading-relaxed">
                            <RichGuideText text={row.roleInLeveling} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Optional Footnote (e.g., for mule_unique holdout items) */}
              {group.footnote && (
                <div className="px-5 py-3 bg-stone-50 dark:bg-slate-950/60 border-t border-stone-200 dark:border-slate-800 text-xs text-stone-600 dark:text-slate-400 font-mono">
                  Note: {group.footnote}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

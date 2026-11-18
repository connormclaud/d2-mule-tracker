import React, { useMemo } from 'react';
import { Check, CheckSquare, RotateCcw } from 'lucide-react';
import {
  MERC_GEAR_PULL_ITEMS,
  MERC_PROGRESSION_STAGES,
  MercGearPullItem,
  getMercStageForLevel,
} from '../data/guideData';
import { RichGuideText } from './RichGuideText';

interface MercGearSectionProps {
  checkedMercItems: Record<string, boolean>;
  onToggleMercItem: (id: string) => void;
  onSetAllMercItems: (checked: boolean) => void;
  activeNumericLevel: number;
  onSelectLevelRow: (rowId: string) => void;
  globalSearch: string;
}

export const MercGearSection: React.FC<MercGearSectionProps> = ({
  checkedMercItems,
  onToggleMercItem,
  onSetAllMercItems,
  activeNumericLevel,
  onSelectLevelRow,
  globalSearch,
}) => {
  const q = globalSearch.trim().toLowerCase();

  const filteredPullItems = useMemo(() => {
    if (!q) return MERC_GEAR_PULL_ITEMS;
    return MERC_GEAR_PULL_ITEMS.filter((item) => {
      const hay = `${item.slot} ${item.item} ${item.exactLocation} ${item.equipLvl} ${item.reqStr} ${item.whyMercWantsIt}`.toLowerCase();
      return hay.includes(q);
    });
  }, [q]);

  const filteredProgression = useMemo(() => {
    if (!q) return MERC_PROGRESSION_STAGES;
    return MERC_PROGRESSION_STAGES.filter((stage) => {
      const hay = `${stage.mercLevel} ${stage.zoneAct} ${stage.mercBaseStr} ${stage.weapon} ${stage.helmet} ${stage.bodyArmor} ${stage.keyNotes}`.toLowerCase();
      return hay.includes(q);
    });
  }, [q]);

  const activeMercStage = useMemo(
    () => getMercStageForLevel(activeNumericLevel),
    [activeNumericLevel]
  );

  const pulledCount = useMemo(
    () => MERC_GEAR_PULL_ITEMS.filter((i) => checkedMercItems[i.id]).length,
    [checkedMercItems]
  );

  const getRarityTextClass = (rarity: MercGearPullItem['rarity']) => {
    switch (rarity) {
      case 'Unique':
        return 'text-amber-800 dark:text-amber-300 font-semibold';
      case 'Runeword':
        return 'text-orange-800 dark:text-orange-300 font-semibold';
      case 'Combo':
        return 'text-stone-900 dark:text-slate-100 font-semibold';
    }
  };

  return (
    <section id="merc-gear" className="scroll-mt-36 space-y-8">
      {/* Section Header */}
      <div className="border-b border-stone-200 dark:border-slate-800 pb-6 space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className="text-xs font-mono tracking-wider text-stone-500 dark:text-slate-400">
              03 · ACT 2 PRAYER MERCENARY GEAR &amp; PROGRESSION
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-slate-100">
              3. Merc Gear Table (Levels 20–40)
            </h2>
          </div>

          <div className="flex items-center gap-3 text-sm font-mono tabular-nums text-stone-600 dark:text-slate-300">
            <span>
              Pulled: <strong className="text-stone-900 dark:text-white">{pulledCount}</strong> /{' '}
              {MERC_GEAR_PULL_ITEMS.length}
            </span>
            <span aria-hidden="true">·</span>
            <span>Normal Act 2 Combat (Prayer)</span>
          </div>
        </div>

        {/* Hiring & Triple-Prayer Aura Synergy Card */}
        <div className="rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <div className="text-xs font-mono text-amber-800 dark:text-amber-400 font-semibold">
                Hire a Normal Act 2 Combat (Prayer) Mercenary from Greiz
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-stone-700 dark:text-slate-300">
                <strong className="font-semibold text-stone-900 dark:text-white">Why Prayer?</strong>{' '}
                In D2R, the <RichGuideText text="Meditation" /> aura on your{' '}
                <RichGuideText text="Insight (Bill)" /> (Lvl 27) passively inherits your Merc&apos;s{' '}
                <RichGuideText text="Prayer" /> aura, doubling the life regeneration for both you and your
                Merc. If you also equip <RichGuideText text="Cure (Crown)" /> at Level 35,{' '}
                <RichGuideText text="Cleansing" /> inherits <RichGuideText text="Prayer" /> a second time
                for <strong className="font-semibold text-emerald-700 dark:text-emerald-400">3x passive life regeneration</strong> + instant poison/curse clearing!
              </p>
            </div>

            {/* Tabular Aura Stacking Chain */}
            <div className="rounded border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950/60 p-3.5 shrink-0 lg:w-80 font-mono text-xs space-y-1.5">
              <div className="text-stone-500 dark:text-slate-400">PRAYER SYNERGY STACKING</div>
              <div className="flex justify-between text-stone-700 dark:text-slate-300">
                <span>Greiz Hire (Act 2 Combat)</span>
                <span className="tabular-nums font-semibold">1x Prayer</span>
              </div>
              <div className="flex justify-between text-stone-700 dark:text-slate-300">
                <span>Lvl 27 Insight (Bill)</span>
                <span className="tabular-nums font-semibold text-amber-700 dark:text-amber-400">
                  2x Regen
                </span>
              </div>
              <div className="flex justify-between text-stone-700 dark:text-slate-300">
                <span>Lvl 28 The Spirit Shroud</span>
                <span className="tabular-nums">+1 All Skills</span>
              </div>
              <div className="border-t border-stone-200 dark:border-slate-800 pt-1 flex justify-between font-semibold text-emerald-700 dark:text-emerald-400">
                <span>Lvl 35 Cure (Cleansing)</span>
                <span className="tabular-nums">3x Regen (~45+ HP/2s)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subsection 3A: Mercenary Gear to Pull From Mules / Shared Stash */}
      <div className="rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-stone-50/70 dark:bg-slate-950/50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-slate-100">
              Mercenary Gear to Pull From Your Mules / Shared Stash (Lvls 20–40)
            </h3>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
              Click any item row to check it off as pulled into your shared stash or Paladin inventory.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSetAllMercItems(pulledCount < MERC_GEAR_PULL_ITEMS.length)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {pulledCount < MERC_GEAR_PULL_ITEMS.length ? (
              <>
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Mark All Pulled</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Checks</span>
              </>
            )}
          </button>
        </div>

        {filteredPullItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-500 dark:text-slate-400">
            No mercenary pull items match your current search filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-slate-800 text-[11px] font-mono text-stone-500 dark:text-slate-400 bg-stone-50/40 dark:bg-slate-950/30">
                  <th className="py-2.5 pl-5 pr-2 w-10">Pulled</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Slot</th>
                  <th className="py-2.5 px-3 min-w-[220px]">Item</th>
                  <th className="py-2.5 px-3 min-w-[170px]">Exact Location</th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap">Equip Lvl</th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap">Req Str</th>
                  <th className="py-2.5 pl-3 pr-5 min-w-[300px]">Why Your Merc Wants It</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/70 dark:divide-slate-800/70 text-sm">
                {filteredPullItems.map((row) => {
                  const isChecked = !!checkedMercItems[row.id];
                  return (
                    <tr
                      key={row.id}
                      onClick={() => onToggleMercItem(row.id)}
                      className={`group transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/15 text-stone-400 dark:text-slate-500'
                          : 'hover:bg-stone-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 pl-5 pr-2 align-top">
                        <button
                          type="button"
                          aria-label={`Mark ${row.item} as pulled`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleMercItem(row.id);
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
                      <td className="py-3 px-3 align-top font-mono text-xs text-stone-600 dark:text-slate-400 whitespace-nowrap">
                        {row.slot}
                      </td>
                      <td className="py-3 px-3 align-top">
                        <div className={isChecked ? 'line-through' : getRarityTextClass(row.rarity)}>
                          {isChecked ? row.item : <RichGuideText text={row.item} />}
                        </div>
                      </td>
                      <td className="py-3 px-3 align-top font-mono text-xs text-stone-700 dark:text-slate-300 whitespace-nowrap">
                        {row.exactLocation}
                      </td>
                      <td className="py-3 px-3 align-top font-mono text-xs tabular-nums text-right text-stone-800 dark:text-slate-200 whitespace-nowrap font-semibold">
                        {row.equipLvl}
                      </td>
                      <td className="py-3 px-3 align-top font-mono text-xs tabular-nums text-right text-stone-600 dark:text-slate-400 whitespace-nowrap">
                        {row.reqStr}
                      </td>
                      <td className="py-3 pl-3 pr-5 align-top text-stone-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                        <RichGuideText text={row.whyMercWantsIt} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Subsection 3B: Level 20–40 Mercenary Progression Table */}
      <div className="rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200 dark:border-slate-800 flex flex-wrap items-baseline justify-between gap-2 bg-stone-50/70 dark:bg-slate-950/50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-slate-100">
              Level 20–40 Mercenary Progression Table
            </h3>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
              Click any level bracket row to update the Active Milestone Tracker to that breakpoint.
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-stone-500 dark:text-slate-400">
            {activeMercStage
              ? `Active Bracket: Merc Lvl ${activeMercStage.mercLevel}`
              : 'Active Level < 20 (Pre-Merc Gear Bracket)'}
          </span>
        </div>

        {filteredProgression.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-500 dark:text-slate-400">
            No mercenary progression rows match your current search filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-slate-800 text-[11px] font-mono text-stone-500 dark:text-slate-400 bg-stone-50/40 dark:bg-slate-950/30">
                  <th className="py-3 pl-5 pr-3 whitespace-nowrap">Merc Level</th>
                  <th className="py-3 px-3 min-w-[170px]">Zone / Act</th>
                  <th className="py-3 px-3 min-w-[130px] whitespace-nowrap">Merc Base Str</th>
                  <th className="py-3 px-3 min-w-[180px]">Weapon</th>
                  <th className="py-3 px-3 min-w-[180px]">Helmet</th>
                  <th className="py-3 px-3 min-w-[180px]">Body Armor</th>
                  <th className="py-3 pl-3 pr-5 min-w-[280px]">Key Milestone / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/70 dark:divide-slate-800/70 text-sm">
                {filteredProgression.map((stage) => {
                  const isActive =
                    activeNumericLevel >= stage.minLevel && activeNumericLevel <= stage.maxLevel;
                  const isCompleted = activeNumericLevel > stage.maxLevel;

                  return (
                    <tr
                      key={stage.id}
                      onClick={() => onSelectLevelRow(stage.targetRowId)}
                      className={`transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-amber-500/12 dark:bg-amber-500/15'
                          : stage.mercLevel === '27'
                          ? 'bg-amber-50/35 dark:bg-amber-950/10 hover:bg-stone-100/80 dark:hover:bg-slate-800/50'
                          : 'hover:bg-stone-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 pl-5 pr-3 font-mono text-xs tabular-nums whitespace-nowrap align-top">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-4 h-4 rounded-sm flex items-center justify-center text-[10px] border ${
                              isActive
                                ? 'border-amber-600 bg-amber-600 text-white font-bold'
                                : isCompleted
                                ? 'border-emerald-600/50 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400'
                                : 'border-stone-300 dark:border-slate-700 text-transparent'
                            }`}
                          >
                            {isActive ? '▸' : isCompleted ? <Check className="w-2.5 h-2.5" /> : '·'}
                          </span>
                          <span
                            className={
                              isActive
                                ? 'font-bold text-stone-900 dark:text-white'
                                : 'font-semibold text-stone-800 dark:text-slate-200'
                            }
                          >
                            {stage.mercLevel}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-xs text-stone-700 dark:text-slate-300 align-top">
                        {stage.zoneAct}
                      </td>
                      <td className="py-3 px-3 font-mono text-xs tabular-nums text-stone-800 dark:text-slate-200 align-top">
                        {stage.mercBaseStr}
                      </td>
                      <td className="py-3 px-3 text-xs text-stone-800 dark:text-slate-200 align-top leading-relaxed">
                        <RichGuideText text={stage.weapon} />
                      </td>
                      <td className="py-3 px-3 text-xs text-stone-800 dark:text-slate-200 align-top leading-relaxed">
                        <RichGuideText text={stage.helmet} />
                      </td>
                      <td className="py-3 px-3 text-xs text-stone-800 dark:text-slate-200 align-top leading-relaxed">
                        <RichGuideText text={stage.bodyArmor} />
                      </td>
                      <td className="py-3 pl-3 pr-5 text-xs sm:text-sm text-stone-700 dark:text-slate-300 align-top leading-relaxed">
                        <RichGuideText text={stage.keyNotes} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

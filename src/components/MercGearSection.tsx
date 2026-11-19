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
}

export const MercGearSection: React.FC<MercGearSectionProps> = ({
  checkedMercItems,
  onToggleMercItem,
  onSetAllMercItems,
  activeNumericLevel,
  onSelectLevelRow,
}) => {
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
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-stone-200 dark:border-slate-800">
        <div className="space-y-1">
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-white"
            style={{ textWrap: 'balance' }}
          >
            Act 2 Prayer Mercenary (Levels 20–40)
          </h1>
          <p className="text-sm text-stone-600 dark:text-slate-300 max-w-2xl">
            Hire Normal Act 2 Combat (<RichGuideText text="Prayer" />) from Greiz. Click any level bracket below to sync your active milestone.
          </p>
        </div>

        <div className="flex items-center gap-3 text-sm font-mono tabular-nums text-stone-600 dark:text-slate-300 shrink-0">
          <span>
            Pulled: <strong className="text-stone-900 dark:text-white">{pulledCount}</strong> /{' '}
            {MERC_GEAR_PULL_ITEMS.length}
          </span>
        </div>
      </div>

      {/* Triple-Prayer Aura Synergy Flat Strip */}
      <div className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-200 dark:divide-slate-800">
        <div className="lg:col-span-7 p-5 space-y-2">
          <div className="text-xs font-semibold text-amber-800 dark:text-amber-400">
            Why Normal Act 2 Combat (Prayer)?
          </div>
          <p className="text-sm leading-relaxed text-stone-700 dark:text-slate-300">
            In D2R, the <RichGuideText text="Meditation" /> aura on <RichGuideText text="Insight (Bill)" /> (Lvl 27) passively inherits your Merc&apos;s{' '}
            <RichGuideText text="Prayer" /> aura, doubling life regeneration for both of you. Adding{' '}
            <RichGuideText text="Cure (Crown)" /> at Level 35 stacks <RichGuideText text="Cleansing" /> on top for{' '}
            <strong className="font-semibold text-emerald-700 dark:text-emerald-400">
              3x passive life regeneration
            </strong>{' '}
            plus instant poison and curse clearing.
          </p>
        </div>

        <div className="lg:col-span-5 p-5 font-mono text-xs space-y-2">
          <div className="font-sans font-semibold text-stone-800 dark:text-slate-200">
            Prayer Synergy Stacking
          </div>
          <div className="flex justify-between text-stone-600 dark:text-slate-400">
            <span>Greiz Hire (Act 2 Combat)</span>
            <span className="tabular-nums font-semibold text-stone-900 dark:text-white">1x Prayer</span>
          </div>
          <div className="flex justify-between text-stone-600 dark:text-slate-400">
            <span>Lvl 27 Insight (Bill)</span>
            <span className="tabular-nums font-semibold text-amber-800 dark:text-amber-400">2x Regen</span>
          </div>
          <div className="flex justify-between text-stone-600 dark:text-slate-400">
            <span>Lvl 28 The Spirit Shroud</span>
            <span className="tabular-nums">+1 All Skills</span>
          </div>
          <div className="border-t border-stone-200 dark:border-slate-800 pt-1.5 flex justify-between font-semibold text-emerald-700 dark:text-emerald-400">
            <span>Lvl 35 Cure (Cleansing)</span>
            <span className="tabular-nums">3x Regen (~45+ HP/2s)</span>
          </div>
        </div>
      </div>

      {/* Subsection A: Mercenary Gear Pull Checklist */}
      <div className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-stone-50/70 dark:bg-slate-950/50">
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              Mercenary Gear Pull Checklist
            </h2>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
              Items to pull from your mules and shared stash for Levels 20–40 (plus Level 41+ handoff).
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSetAllMercItems(pulledCount < MERC_GEAR_PULL_ITEMS.length)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {pulledCount < MERC_GEAR_PULL_ITEMS.length ? (
              <>
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Mark All Pulled</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Uncheck All</span>
              </>
            )}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-slate-800 text-xs font-medium text-stone-500 dark:text-slate-400 bg-stone-50/40 dark:bg-slate-950/30">
                <th className="py-2.5 pl-5 pr-2 w-12">Done</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Slot</th>
                <th className="py-2.5 px-3 min-w-[210px]">Item</th>
                <th className="py-2.5 px-3 min-w-[160px]">Location</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Lvl</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Str</th>
                <th className="py-2.5 pl-3 pr-5 min-w-[280px]">Why Your Merc Wants It</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/70 dark:divide-slate-800/70 text-sm">
              {MERC_GEAR_PULL_ITEMS.map((row) => {
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
                        className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-950 group-hover:border-stone-400'
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
                    <td className="py-3 px-3 align-top font-mono text-xs tabular-nums text-right text-stone-900 dark:text-slate-100 whitespace-nowrap font-semibold">
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
      </div>

      {/* Subsection B: Level 20–40 Progression Table */}
      <div className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200 dark:border-slate-800 flex flex-wrap items-baseline justify-between gap-2 bg-stone-50/70 dark:bg-slate-950/50">
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              Level 20–40 Mercenary Progression
            </h2>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
              Synced to your active Paladin level. Click any row to jump to that breakpoint.
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-stone-600 dark:text-slate-400">
            {activeMercStage
              ? `Current Bracket: Lvl ${activeMercStage.mercLevel}`
              : 'Current Level < 20 (Pre-Merc)'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-slate-800 text-xs font-medium text-stone-500 dark:text-slate-400 bg-stone-50/40 dark:bg-slate-950/30">
                <th className="py-3 pl-5 pr-3 whitespace-nowrap">Merc Lvl</th>
                <th className="py-3 px-3 min-w-[155px]">Zone / Act</th>
                <th className="py-3 px-3 min-w-[120px] whitespace-nowrap">Base Str</th>
                <th className="py-3 px-3 min-w-[170px]">Weapon</th>
                <th className="py-3 px-3 min-w-[170px]">Helmet</th>
                <th className="py-3 px-3 min-w-[170px]">Body Armor</th>
                <th className="py-3 pl-3 pr-5 min-w-[260px]">Key Milestone Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/70 dark:divide-slate-800/70 text-sm">
              {MERC_PROGRESSION_STAGES.map((stage) => {
                const isActive =
                  activeNumericLevel >= stage.minLevel && activeNumericLevel <= stage.maxLevel;
                const isCompleted = activeNumericLevel > stage.maxLevel;

                return (
                  <tr
                    key={stage.id}
                    onClick={() => onSelectLevelRow(stage.targetRowId)}
                    className={`transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-amber-500/15 dark:bg-amber-500/18'
                        : stage.mercLevel === '27'
                        ? 'bg-amber-50/35 dark:bg-amber-950/10 hover:bg-stone-100/80 dark:hover:bg-slate-800/50'
                        : 'hover:bg-stone-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 pl-5 pr-3 font-mono text-xs tabular-nums whitespace-nowrap align-top">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-4 h-4 rounded-sm flex items-center justify-center text-[10px] border shrink-0 ${
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
      </div>
    </section>
  );
};

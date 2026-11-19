import React, { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Check,
  Shield,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  LEVELING_ROWS,
  WALKTHROUGH_STAGES,
  MULE_ITEMS,
  getMercStageForLevel,
} from '../data/guideData';
import { RichGuideText, RarityLegend } from './RichGuideText';
import { WorkspaceTab } from './GlobalSearchModal';

interface LiveRunViewProps {
  activeRowId: string;
  onSelectRow: (id: string) => void;
  checkedItems: Record<string, boolean>;
  onToggleItem: (id: string) => void;
  onSwitchTab: (tab: WorkspaceTab) => void;
}

export const LiveRunView: React.FC<LiveRunViewProps> = ({
  activeRowId,
  onSelectRow,
  checkedItems,
  onToggleItem,
  onSwitchTab,
}) => {
  const [showMercPanel, setShowMercPanel] = useState(true);

  const activeIndex = useMemo(() => {
    const idx = LEVELING_ROWS.findIndex((r) => r.id === activeRowId);
    return idx >= 0 ? idx : 0;
  }, [activeRowId]);

  const activeRow = LEVELING_ROWS[activeIndex];
  const upcomingRows = useMemo(
    () => LEVELING_ROWS.slice(activeIndex + 1, activeIndex + 4),
    [activeIndex]
  );

  const nextMajorSpike = useMemo(() => {
    for (let i = activeIndex + 1; i < LEVELING_ROWS.length; i++) {
      if (LEVELING_ROWS[i].isMajorSpike) return LEVELING_ROWS[i];
    }
    return null;
  }, [activeIndex]);

  const currentStage = useMemo(
    () =>
      WALKTHROUGH_STAGES.find((s) => s.bracket === activeRow.bracket) ||
      WALKTHROUGH_STAGES[0],
    [activeRow.bracket]
  );

  const mercStage = useMemo(
    () => getMercStageForLevel(activeRow.numericLevel),
    [activeRow.numericLevel]
  );

  // Items equipping right at this exact numeric level (so the player knows what to pull from stash NOW)
  const itemsUnlockingNow = useMemo(() => {
    if (activeRow.isQuest) return [];
    return MULE_ITEMS.filter((item) => item.equipLvlNumeric === activeRow.numericLevel);
  }, [activeRow.numericLevel, activeRow.isQuest]);

  const handleStep = (delta: number) => {
    const nextIdx = Math.min(Math.max(activeIndex + delta, 0), LEVELING_ROWS.length - 1);
    onSelectRow(LEVELING_ROWS[nextIdx].id);
  };

  return (
    <div className="space-y-8">
      {/* Focal Anchor: Current Milestone Action Card */}
      <section
        aria-label="Current milestone actions"
        className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
      >
        {/* Top Action Bar */}
        <div className="px-6 py-5 border-b border-stone-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-slate-400">
              <span>{currentStage.title}</span>
              <span aria-hidden="true">·</span>
              <span>{currentStage.zones}</span>
              {activeRow.isMajorSpike && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-amber-800 dark:text-amber-400">
                    Major Power Spike
                  </span>
                </>
              )}
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-white"
              style={{ textWrap: 'balance' }}
            >
              {activeRow.isQuest
                ? `Quest Milestone: ${activeRow.levelOrQuest}`
                : `Level ${activeRow.levelOrQuest}`}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleStep(-1)}
              disabled={activeIndex === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium rounded-lg border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-950 text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              type="button"
              onClick={() => handleStep(1)}
              disabled={activeIndex === LEVELING_ROWS.length - 1}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-lg bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white dark:text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Next Level</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Action Columns separated by clean hairline dividers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-200 dark:divide-slate-800">
          <div className="p-5 space-y-1.5">
            <div className="text-xs font-medium text-stone-500 dark:text-slate-400">
              1. Skill Point to Invest
            </div>
            <div className="text-base font-semibold font-mono text-stone-900 dark:text-white">
              <RichGuideText text={activeRow.skillInvested} />
            </div>
            <div className="text-xs text-stone-500 dark:text-slate-400 font-mono tabular-nums">
              {activeRow.holyFireBaseLvl > 0
                ? `Holy Fire: Lvl ${activeRow.holyFireBaseLvl} (${activeRow.holyFireEffectiveLvl} w/ swap)`
                : 'Aura: Might until Level 6'}
            </div>
          </div>

          <div className="p-5 space-y-1.5">
            <div className="text-xs font-medium text-stone-500 dark:text-slate-400">
              2. Active L-Click / R-Click
            </div>
            <div className="text-base font-semibold font-mono text-stone-900 dark:text-white">
              <RichGuideText text={activeRow.activeSkills} />
            </div>
            <div className="text-xs text-stone-500 dark:text-slate-400">
              {activeRow.numericLevel >= 23
                ? 'Press W to swap Raven Claw & Kinemil’s Awl'
                : activeRow.numericLevel >= 15
                ? 'Press W for Blood Crescent + Rondache'
                : 'Melee with starter / Blood Crescent'}
            </div>
          </div>

          <div className="p-5 space-y-1.5">
            <div className="text-xs font-medium text-stone-500 dark:text-slate-400">
              3. Spend +5 Stat Points
            </div>
            <div className="text-base font-semibold font-mono tabular-nums text-stone-900 dark:text-white">
              {activeRow.statPoints}
            </div>
            <div className="text-xs text-stone-500 dark:text-slate-400 font-mono tabular-nums">
              Eff: {activeRow.effectiveStr} Str · {activeRow.effectiveDex} Dex · {activeRow.effectiveVit} Vit
            </div>
          </div>

          <div
            className={`p-5 space-y-1.5 ${
              activeRow.gearSwapPowerSpike !== '—'
                ? 'bg-amber-50/50 dark:bg-amber-950/20'
                : ''
            }`}
          >
            <div className="text-xs font-medium text-amber-800 dark:text-amber-400">
              4. Gear Swap &amp; Spike
            </div>
            <div className="text-sm sm:text-[15px] leading-snug text-stone-900 dark:text-slate-100">
              {activeRow.gearSwapPowerSpike === '—' ? (
                <span className="text-stone-500 dark:text-slate-400">
                  No gear swap this level — keep pushing forward.
                </span>
              ) : (
                <RichGuideText text={activeRow.gearSwapPowerSpike} />
              )}
            </div>
          </div>
        </div>

        {/* Inline Stash Pull Reminder for Items Equipping at This Exact Level */}
        {itemsUnlockingNow.length > 0 && (
          <div className="px-6 py-4 border-t border-stone-200 dark:border-slate-800 bg-stone-50/70 dark:bg-slate-950/50 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-stone-800 dark:text-slate-200">
                Items equipping at Level {activeRow.numericLevel} ({itemsUnlockingNow.length})
              </span>
              <button
                type="button"
                onClick={() => onSwitchTab('stash')}
                className="text-xs font-medium text-amber-800 dark:text-amber-400 hover:underline cursor-pointer"
              >
                Open full Stash Prep
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {itemsUnlockingNow.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onToggleItem(item.id)}
                    className={`flex items-start gap-3 p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                      isChecked
                        ? 'border-emerald-600/30 bg-emerald-50/50 dark:bg-emerald-950/20'
                        : 'border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-stone-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span
                      className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-stone-300 dark:border-slate-600'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[2.5]" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className={`text-xs font-medium ${isChecked ? 'line-through text-stone-400 dark:text-slate-500' : 'text-stone-900 dark:text-white'}`}>
                        <RichGuideText text={item.item} />
                      </div>
                      <div className="text-[11px] font-mono text-stone-500 dark:text-slate-400 mt-0.5 truncate">
                        {item.currentLocation} · Req {item.reqStrDex} Str/Dex
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Upcoming Queue: Next 3 Milestones + Next Major Spike */}
      {upcomingRows.length > 0 && (
        <section aria-label="Coming up next" className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-stone-800 dark:text-slate-200">
              Coming Up Next
            </h2>
            <div className="flex items-center gap-4 text-xs">
              {nextMajorSpike && (
                <button
                  type="button"
                  onClick={() => onSelectRow(nextMajorSpike.id)}
                  className="inline-flex items-center gap-1 font-medium text-amber-800 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  <span>
                    Jump to next major spike (
                    {nextMajorSpike.isQuest
                      ? nextMajorSpike.levelOrQuest
                      : `Lvl ${nextMajorSpike.levelOrQuest}`}
                    )
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => onSwitchTab('leveling')}
                className="text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:underline cursor-pointer"
              >
                View full 1–40 table
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingRows.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => onSelectRow(row.id)}
                className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-left hover:border-amber-600/50 dark:hover:border-amber-500/50 transition-colors cursor-pointer flex flex-col justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-mono font-bold text-stone-900 dark:text-white tabular-nums">
                      {row.isQuest ? row.levelOrQuest : `Level ${row.levelOrQuest}`}
                    </span>
                    <span className="font-mono text-stone-500 dark:text-slate-400 truncate">
                      {row.skillInvested}
                    </span>
                  </div>
                  <div className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                    {row.gearSwapPowerSpike === '—' ? (
                      <span className="text-stone-400 dark:text-slate-500">
                        {row.statPoints} · No gear swap
                      </span>
                    ) : (
                      <RichGuideText text={row.gearSwapPowerSpike} />
                    )}
                  </div>
                </div>
                {row.isMajorSpike && (
                  <div className="text-[11px] font-medium text-amber-800 dark:text-amber-400">
                    Major Power Spike
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Synced 2-Column Context: Act Routing (Left) + Active Loadout & Mercenary (Right) */}
      <section aria-label="Synced routing and loadout" className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        {/* Left: Synced Act Routing */}
        <div className="xl:col-span-7 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
          <div className="px-6 py-4 border-b border-stone-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-white">
                Current Act Strategy · {currentStage.title}
              </h2>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                {currentStage.zones}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSwitchTab('walkthrough')}
              className="text-xs font-medium text-amber-800 dark:text-amber-400 hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              All 5 Acts
            </button>
          </div>

          <div className="p-6 flex-1 space-y-5">
            <ol className="space-y-4 text-sm sm:text-[15px] text-stone-700 dark:text-slate-300 leading-relaxed">
              {currentStage.whatToDo.map((point, idx) => (
                <li key={idx} className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs font-semibold text-amber-800 dark:text-amber-400 shrink-0 tabular-nums">
                      0{idx + 1}.
                    </span>
                    <span className={point.subPoints ? 'font-semibold text-stone-900 dark:text-white' : ''}>
                      <RichGuideText text={point.text} />
                    </span>
                  </div>
                  {point.subPoints && (
                    <ul className="pl-7 space-y-2 text-sm text-stone-600 dark:text-slate-300">
                      {point.subPoints.map((sub, j) => (
                        <li key={j} className="flex items-baseline gap-2">
                          <span className="font-mono text-xs text-stone-400 dark:text-slate-500 shrink-0">
                            —
                          </span>
                          <span>
                            <RichGuideText text={sub} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>

            {currentStage.nightmareTransition && (
              <div className="pt-5 border-t border-stone-200 dark:border-slate-800 space-y-2.5">
                <h3 className="text-xs font-semibold text-amber-800 dark:text-amber-400">
                  {currentStage.nightmareTransition.title}
                </h3>
                <ul className="space-y-2 text-sm text-stone-700 dark:text-slate-300 leading-relaxed">
                  {currentStage.nightmareTransition.points.map((pt, k) => (
                    <li key={k} className="flex items-baseline gap-2.5">
                      <span className="font-mono text-xs font-semibold text-amber-800 dark:text-amber-400 shrink-0">
                        4{k + 1}.
                      </span>
                      <span>
                        <RichGuideText text={pt} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="px-6 py-3 border-t border-stone-200 dark:border-slate-800 bg-stone-50/60 dark:bg-slate-950/40">
            <RarityLegend />
          </div>
        </div>

        {/* Right: Synced Active Loadout + Act 2 Prayer Mercenary */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          {/* Active Gear Loadout */}
          <div className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex-1">
            <div className="px-6 py-4 border-b border-stone-200 dark:border-slate-800">
              <h2 className="text-base font-bold text-stone-900 dark:text-white">
                {currentStage.whatToWearTitle}
              </h2>
            </div>
            <dl className="divide-y divide-stone-200/80 dark:divide-slate-800/80 px-6 py-2">
              {currentStage.loadout.map((slotItem, idx) => (
                <div key={idx} className="py-3">
                  <dt className="text-xs font-mono text-stone-500 dark:text-slate-400">
                    {slotItem.slot}
                  </dt>
                  <dd className="mt-0.5 text-sm font-medium text-stone-900 dark:text-white">
                    <RichGuideText text={slotItem.equippedItem} />
                  </dd>
                  <dd className="mt-0.5 text-xs text-stone-600 dark:text-slate-400 leading-relaxed">
                    <RichGuideText text={slotItem.statsSummary} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Synced Act 2 Mercenary Card */}
          <div className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowMercPanel((s) => !s)}
              aria-expanded={showMercPanel}
              className="w-full px-6 py-4 flex items-center justify-between gap-3 text-left hover:bg-stone-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Shield className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-stone-900 dark:text-white truncate">
                    Act 2 Prayer Mercenary
                  </div>
                  <div className="text-xs font-mono text-stone-500 dark:text-slate-400 truncate tabular-nums">
                    {mercStage
                      ? `Lvl ${mercStage.mercLevel} · Base Str ${mercStage.mercBaseStr} · ${mercStage.auraStatus}`
                      : 'Pre-Lvl 20 · Hire Normal A2 Combat (Prayer) from Greiz'}
                  </div>
                </div>
              </div>
              {showMercPanel ? (
                <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
              )}
            </button>

            {showMercPanel && (
              <div className="px-6 py-4 border-t border-stone-200 dark:border-slate-800 space-y-3 text-xs">
                {mercStage ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="block text-stone-500 dark:text-slate-400">Weapon</span>
                        <span className="mt-0.5 block text-stone-900 dark:text-slate-100 leading-relaxed">
                          <RichGuideText text={mercStage.weapon} />
                        </span>
                      </div>
                      <div>
                        <span className="block text-stone-500 dark:text-slate-400">Helm &amp; Armor</span>
                        <span className="mt-0.5 block text-stone-900 dark:text-slate-100 leading-relaxed">
                          <RichGuideText text={mercStage.helmet} />
                          <span className="mx-1 text-stone-400">·</span>
                          <RichGuideText text={mercStage.bodyArmor} />
                        </span>
                      </div>
                    </div>
                    <p className="text-stone-600 dark:text-slate-300 leading-relaxed pt-2 border-t border-stone-200/70 dark:border-slate-800/70">
                      <RichGuideText text={mercStage.keyNotes} />
                    </p>
                  </>
                ) : (
                  <p className="text-stone-600 dark:text-slate-300 leading-relaxed">
                    Hire a Normal Act 2 Combat (<RichGuideText text="Prayer" />) Mercenary from Greiz when you reach Lut Gholein. First gear swap unlocks at Level 20:{' '}
                    <RichGuideText text="The Face of Horror" /> + <RichGuideText text="Hawkmail" />.
                  </p>
                )}

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => onSwitchTab('merc')}
                    className="inline-flex items-center gap-1 font-medium text-amber-800 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    <span>Open full Mercenary gear &amp; checklist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

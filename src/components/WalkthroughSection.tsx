import React, { useState } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { WALKTHROUGH_STAGES, LevelBracket } from '../data/guideData';
import { RichGuideText } from './RichGuideText';

interface WalkthroughSectionProps {
  onJumpToLevelBracket: (bracket: LevelBracket) => void;
}

export const WalkthroughSection: React.FC<WalkthroughSectionProps> = ({
  onJumpToLevelBracket,
}) => {
  const [selectedStage, setSelectedStage] = useState<'all' | LevelBracket>('all');

  const visibleStages =
    selectedStage === 'all'
      ? WALKTHROUGH_STAGES
      : WALKTHROUGH_STAGES.filter((s) => s.bracket === selectedStage);

  const firstLevelRowIdForBracket = (bracket: LevelBracket) => {
    switch (bracket) {
      case '1-7':
        return 'lvl-1';
      case '8-14':
        return 'lvl-8';
      case '15-22':
        return 'lvl-15';
      case '23-29':
        return 'lvl-23';
      case '30-40':
        return 'lvl-30';
    }
  };

  return (
    <section id="walkthrough" className="scroll-mt-36 space-y-8">
      {/* Header & Attribution */}
      <div className="border-b border-stone-200 dark:border-slate-800 pb-6 space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className="text-xs font-mono tracking-wider text-stone-500 dark:text-slate-400">
              03 · ACT-BY-ACT ROUTING, LOADOUT SNAPSHOTS & BOSS TECH
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-slate-100">
              3. Per-Level & Per-Act Walkthrough: What to Do & Wear
            </h2>
          </div>
          <a
            href="https://maxroll.gg/d2/guides/paladin-leveling"
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-800 dark:text-amber-400 hover:underline whitespace-nowrap shrink-0"
          >
            <span>Reference: Maxroll Paladin Leveling Guide</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <p className="text-sm text-stone-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Inspired by the Maxroll Paladin Leveling Guide, tailored to your exact twink breakpoints,{' '}
          <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-stone-200/70 dark:bg-slate-800 text-stone-900 dark:text-white">
            sork
          </code>{' '}
          gear upgrades, dual-weapon{' '}
          <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-stone-200/70 dark:bg-slate-800 text-stone-900 dark:text-white">
            W
          </code>{' '}
          swap tech, and Crushing Blow boss setups.
        </p>

        {/* Stage Selector + Quiet Inline Color Key */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 dark:bg-slate-900 rounded-md w-fit border border-stone-200 dark:border-slate-800">
            {(
              [
                { key: 'all', label: 'All Stages (1–40)' },
                { key: '1-7', label: 'Lvls 1–7: Early Act 1' },
                { key: '8-14', label: 'Lvls 8–14: Mid Act 1' },
                { key: '15-22', label: 'Lvls 15–22: Late Act 1 & Act 2' },
                { key: '23-29', label: 'Lvls 23–29: Act 3 & Act 4' },
                { key: '30-40', label: 'Lvls 30–40: Act 5 & Baal' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedStage(tab.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedStage === tab.key
                    ? 'bg-white dark:bg-slate-800 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-stone-500 dark:text-slate-400">
            <span className="text-rose-700 dark:text-rose-400 font-semibold">Skill</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-800 dark:text-amber-300 font-semibold">Unique</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-800 dark:text-emerald-400 font-semibold">Set</span>
            <span aria-hidden="true">·</span>
            <span className="text-orange-800 dark:text-orange-300 font-semibold">Runeword</span>
            <span aria-hidden="true">·</span>
            <span className="text-blue-800 dark:text-blue-400 font-semibold">Magic</span>
            <span aria-hidden="true">·</span>
            <span className="text-yellow-700 dark:text-yellow-300 font-semibold">Rare</span>
          </div>
        </div>
      </div>

      {/* Stage Articles */}
      <div className="space-y-8" id="loadouts">
        {visibleStages.map((stage, index) => (
          <article
            key={stage.id}
            className="rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
          >
            {/* Stage Top Header */}
            <div className="px-6 py-4 border-b border-stone-200 dark:border-slate-800 bg-stone-50/70 dark:bg-slate-950/50 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-stone-500 dark:text-slate-400">
                  STAGE 0{index + 1} · {stage.zones.toUpperCase()}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white mt-0.5">
                  {stage.title} ({stage.zones})
                </h3>
              </div>

              <a
                href="#leveling-table"
                onClick={() => {
                  onJumpToLevelBracket(stage.bracket);
                  const rowId = firstLevelRowIdForBracket(stage.bracket);
                  const evt = new CustomEvent('select-level-row', { detail: rowId });
                  window.dispatchEvent(evt);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-stone-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
              >
                <span>Set Active Level to {stage.bracket.split('-')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 2-Column Split: What to Do vs What to Wear */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-200 dark:divide-slate-800 items-stretch">
              {/* Left Column: What to Do */}
              <div className="lg:col-span-7 p-6 space-y-4">
                <h4 className="text-xs font-mono tracking-wider text-stone-500 dark:text-slate-400">
                  WHAT TO DO
                </h4>
                <ul className="space-y-3.5 text-sm sm:text-base text-stone-700 dark:text-slate-300 leading-relaxed">
                  {stage.whatToDo.map((point, i) => (
                    <li key={i} className="space-y-2">
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-mono text-xs text-amber-700 dark:text-amber-400 shrink-0">
                          0{i + 1}.
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
                </ul>
              </div>

              {/* Right Column: What to Wear Loadout Table */}
              <div className="lg:col-span-5 p-6 bg-stone-50/40 dark:bg-slate-950/30 space-y-4">
                <h4 className="text-xs font-mono tracking-wider text-amber-800 dark:text-amber-400 font-semibold">
                  {stage.whatToWearTitle.toUpperCase()}
                </h4>
                <dl className="divide-y divide-stone-200/80 dark:divide-slate-800/80">
                  {stage.loadout.map((slotItem, idx) => (
                    <div key={idx} className="py-2.5 first:pt-0 last:pb-0">
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
            </div>

            {/* Nightmare Transition Footer (Stage 30–40) */}
            {stage.nightmareTransition && (
              <div className="px-6 py-5 border-t border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950/70 space-y-2.5">
                <div className="text-xs font-mono font-semibold text-amber-800 dark:text-amber-400">
                  {stage.nightmareTransition.title.toUpperCase()}
                </div>
                <ul className="space-y-2 text-sm text-stone-700 dark:text-slate-300 leading-relaxed">
                  {stage.nightmareTransition.points.map((pt, k) => (
                    <li key={k} className="flex items-baseline gap-2.5">
                      <span className="font-mono text-xs text-amber-700 dark:text-amber-400 shrink-0">
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
          </article>
        ))}
      </div>
    </section>
  );
};

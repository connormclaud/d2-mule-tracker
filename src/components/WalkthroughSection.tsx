import React, { useState, useEffect } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { WALKTHROUGH_STAGES, LevelBracket } from '../data/guideData';
import { RichGuideText, RarityLegend } from './RichGuideText';

interface WalkthroughSectionProps {
  activeBracket: LevelBracket;
  initialStage?: 'all' | LevelBracket;
  onActivateStageLevel: (rowId: string) => void;
}

export const WalkthroughSection: React.FC<WalkthroughSectionProps> = ({
  activeBracket,
  initialStage = 'all',
  onActivateStageLevel,
}) => {
  const [selectedStage, setSelectedStage] = useState<'all' | LevelBracket>(initialStage);

  useEffect(() => {
    setSelectedStage(initialStage);
  }, [initialStage]);

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
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-stone-200 dark:border-slate-800">
        <div className="space-y-1">
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-white"
            style={{ textWrap: 'balance' }}
          >
            Act-by-Act Walkthrough &amp; Loadout Snapshots
          </h1>
          <p className="text-sm text-stone-600 dark:text-slate-300 max-w-2xl">
            Routing, dual-weapon <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-stone-200/70 dark:bg-slate-800 text-stone-900 dark:text-white">W</code> swap tech, Crushing Blow boss setups, and Nightmare Level 41+ transition.
          </p>
        </div>

        <a
          href="https://maxroll.gg/d2/guides/paladin-leveling"
          target="_blank"
          rel="noopener noreferrer"
          referrerPolicy="no-referrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 dark:text-amber-400 hover:underline whitespace-nowrap shrink-0"
        >
          <span>Maxroll Reference</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Stage Selector + Quiet Inline Color Key */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-200/70 dark:bg-slate-900 rounded-lg border border-stone-200 dark:border-slate-800">
          {(
            [
              { key: 'all', label: 'All Stages' },
              { key: '1-7', label: 'Lvls 1–7' },
              { key: '8-14', label: 'Lvls 8–14' },
              { key: '15-22', label: 'Lvls 15–22' },
              { key: '23-29', label: 'Lvls 23–29' },
              { key: '30-40', label: 'Lvls 30–40' },
            ] as const
          ).map((tab) => {
            const isCurrentBracket = tab.key === activeBracket;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedStage(tab.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedStage === tab.key
                    ? 'bg-white dark:bg-slate-800 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
                {isCurrentBracket ? ' · Now' : ''}
              </button>
            );
          })}
        </div>

        <RarityLegend />
      </div>

      {/* Stage Articles */}
      <div className="space-y-6">
        {visibleStages.map((stage) => {
          const isCurrent = stage.bracket === activeBracket;

          return (
            <article
              key={stage.id}
              className={`rounded-xl border bg-white dark:bg-slate-900 overflow-hidden ${
                isCurrent
                  ? 'border-amber-600/60 dark:border-amber-500/50'
                  : 'border-stone-200 dark:border-slate-800'
              }`}
            >
              {/* Stage Top Header */}
              <div className="px-6 py-4 border-b border-stone-200 dark:border-slate-800 bg-stone-50/70 dark:bg-slate-950/50 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-slate-400">
                    <span>{stage.zones}</span>
                    {isCurrent && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-amber-800 dark:text-amber-400">
                          Current Active Stage
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white mt-0.5">
                    {stage.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => onActivateStageLevel(firstLevelRowIdForBracket(stage.bracket))}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-stone-800 dark:text-slate-200 hover:border-amber-600/50 hover:text-amber-800 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Track in Live Run (Lvl {stage.bracket.split('-')[0]})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 2-Column Split: What to Do vs What to Wear */}
              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-200 dark:divide-slate-800 items-stretch">
                {/* Left Column: What to Do */}
                <div className="lg:col-span-7 p-6 space-y-4">
                  <h3 className="text-xs font-semibold text-stone-500 dark:text-slate-400">
                    What to Do
                  </h3>
                  <ol className="space-y-3.5 text-sm sm:text-[15px] text-stone-700 dark:text-slate-300 leading-relaxed">
                    {stage.whatToDo.map((point, i) => (
                      <li key={i} className="space-y-2">
                        <div className="flex items-baseline gap-2.5">
                          <span className="font-mono text-xs font-semibold text-amber-800 dark:text-amber-400 shrink-0 tabular-nums">
                            0{i + 1}.
                          </span>
                          <span
                            className={
                              point.subPoints ? 'font-semibold text-stone-900 dark:text-white' : ''
                            }
                          >
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
                </div>

                {/* Right Column: Loadout Snapshot */}
                <div className="lg:col-span-5 p-6 bg-stone-50/40 dark:bg-slate-950/30 space-y-4">
                  <h3 className="text-xs font-semibold text-amber-800 dark:text-amber-400">
                    {stage.whatToWearTitle}
                  </h3>
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

              {/* Nightmare Transition Footer */}
              {stage.nightmareTransition && (
                <div className="px-6 py-5 border-t border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950/70 space-y-2.5">
                  <div className="text-xs font-semibold text-amber-800 dark:text-amber-400">
                    {stage.nightmareTransition.title}
                  </div>
                  <ul className="space-y-2 text-sm text-stone-700 dark:text-slate-300 leading-relaxed">
                    {stage.nightmareTransition.points.map((pt, k) => (
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
            </article>
          );
        })}
      </div>
    </section>
  );
};

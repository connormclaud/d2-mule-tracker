import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import {
  MULE_ITEMS,
  LEVELING_ROWS,
  MERC_GEAR_PULL_ITEMS,
  WALKTHROUGH_STAGES,
  MuleGroupKey,
  LevelBracket,
} from '../data/guideData';
import { RichGuideText } from './RichGuideText';

export type WorkspaceTab = 'live' | 'stash' | 'leveling' | 'merc' | 'walkthrough';

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
  onJumpToMuleItem: (groupKey: MuleGroupKey, searchTerm: string) => void;
  onJumpToLevelRow: (rowId: string, openTab: WorkspaceTab) => void;
  onJumpToMerc: (targetRowId?: string) => void;
  onJumpToWalkthrough: (bracket: LevelBracket) => void;
}

const SUGGESTED_QUERIES = [
  'Raven Claw',
  'Sigon',
  'Insight',
  'Kinemil',
  'Spirit',
  'Smoke',
  'Stealskull',
  'Moser',
];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  open,
  onClose,
  onJumpToMuleItem,
  onJumpToLevelRow,
  onJumpToMerc,
  onJumpToWalkthrough,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 20);
    } else {
      setQuery('');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const trimmed = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!trimmed) {
      return { mule: [], leveling: [], merc: [], walkthrough: [] };
    }

    const mule = MULE_ITEMS.filter((item) =>
      `${item.item} ${item.currentLocation} ${item.slotOrType} ${item.roleInLeveling} ${item.equipLvlDisplay}`
        .toLowerCase()
        .includes(trimmed)
    ).slice(0, 6);

    const leveling = LEVELING_ROWS.filter((row) =>
      `${row.levelOrQuest} ${row.skillInvested} ${row.activeSkills} ${row.statPoints} ${row.gearSwapPowerSpike}`
        .toLowerCase()
        .includes(trimmed)
    ).slice(0, 6);

    const merc = MERC_GEAR_PULL_ITEMS.filter((item) =>
      `${item.item} ${item.slot} ${item.exactLocation} ${item.whyMercWantsIt}`
        .toLowerCase()
        .includes(trimmed)
    ).slice(0, 4);

    const walkthrough = WALKTHROUGH_STAGES.filter((stage) =>
      `${stage.title} ${stage.zones} ${stage.whatToDo.map((d) => d.text).join(' ')} ${stage.loadout
        .map((l) => `${l.equippedItem} ${l.statsSummary}`)
        .join(' ')}`
        .toLowerCase()
        .includes(trimmed)
    ).slice(0, 4);

    return { mule, leveling, merc, walkthrough };
  }, [trimmed]);

  const totalCount =
    results.mule.length +
    results.leveling.length +
    results.merc.length +
    results.walkthrough.length;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-stone-950/60 dark:bg-black/70 backdrop-blur-[2px] px-4 pt-[10vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search guide"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[76vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-stone-200 dark:border-slate-800">
          <Search className="w-4 h-4 text-stone-400 dark:text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items, mule tabs, levels, skills, or merc gear..."
            aria-label="Search guide"
            className="flex-1 bg-transparent text-sm sm:text-base text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search query"
              className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-medium text-stone-600 dark:text-slate-300 border border-stone-200 dark:border-slate-700 rounded-md hover:bg-stone-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
          >
            Esc
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto divide-y divide-stone-200/80 dark:divide-slate-800/80">
          {!trimmed ? (
            <div className="p-5 space-y-4">
              <p className="text-xs font-medium text-stone-500 dark:text-slate-400">
                Quick lookups
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUERIES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 text-xs font-medium rounded-md border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-950 text-stone-700 dark:text-slate-200 hover:border-amber-600/50 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <p className="text-xs text-stone-500 dark:text-slate-400">
                Tip: Press <kbd className="font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-slate-200">/</kbd> anywhere to open search, or use{' '}
                <kbd className="font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-slate-200">←</kbd>{' '}
                <kbd className="font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-slate-200">→</kbd> to step levels.
              </p>
            </div>
          ) : totalCount === 0 ? (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-medium text-stone-800 dark:text-slate-200">
                No matches for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-stone-500 dark:text-slate-400">
                Try searching for an item name, mule source (e.g. sork, Tab 5), skill, or level number.
              </p>
            </div>
          ) : (
            <>
              {results.leveling.length > 0 && (
                <div className="p-3">
                  <div className="px-2 pb-2 text-xs font-medium text-stone-500 dark:text-slate-400">
                    Leveling milestones
                  </div>
                  <div className="space-y-1">
                    {results.leveling.map((row) => (
                      <button
                        key={row.id}
                        type="button"
                        onClick={() => {
                          onJumpToLevelRow(row.id, 'live');
                          onClose();
                        }}
                        className="w-full flex items-center justify-between gap-4 px-3 py-2.5 rounded-lg text-left hover:bg-stone-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-stone-900 dark:text-white tabular-nums">
                            {row.isQuest ? row.levelOrQuest : `Level ${row.levelOrQuest}`}{' '}
                            <span className="font-normal text-stone-500 dark:text-slate-400">
                              · {row.skillInvested}
                            </span>
                          </div>
                          <div className="text-xs text-stone-600 dark:text-slate-300 truncate mt-0.5">
                            <RichGuideText text={row.gearSwapPowerSpike} />
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.mule.length > 0 && (
                <div className="p-3">
                  <div className="px-2 pb-2 text-xs font-medium text-stone-500 dark:text-slate-400">
                    Stash prep items
                  </div>
                  <div className="space-y-1">
                    {results.mule.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onJumpToMuleItem(item.groupKey, item.item);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between gap-4 px-3 py-2.5 rounded-lg text-left hover:bg-stone-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-stone-900 dark:text-white truncate">
                            <RichGuideText text={item.item} />
                          </div>
                          <div className="text-xs text-stone-500 dark:text-slate-400 truncate mt-0.5 font-mono">
                            {item.currentLocation} · Equip Lvl {item.equipLvlDisplay} · {item.slotOrType}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.merc.length > 0 && (
                <div className="p-3">
                  <div className="px-2 pb-2 text-xs font-medium text-stone-500 dark:text-slate-400">
                    Act 2 Mercenary gear
                  </div>
                  <div className="space-y-1">
                    {results.merc.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onJumpToMerc();
                          onClose();
                        }}
                        className="w-full flex items-center justify-between gap-4 px-3 py-2.5 rounded-lg text-left hover:bg-stone-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-stone-900 dark:text-white truncate">
                            <RichGuideText text={item.item} />
                          </div>
                          <div className="text-xs text-stone-500 dark:text-slate-400 truncate mt-0.5 font-mono">
                            {item.exactLocation} · {item.slot} · Req Str {item.reqStr}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.walkthrough.length > 0 && (
                <div className="p-3">
                  <div className="px-2 pb-2 text-xs font-medium text-stone-500 dark:text-slate-400">
                    Act walkthrough stages
                  </div>
                  <div className="space-y-1">
                    {results.walkthrough.map((stage) => (
                      <button
                        key={stage.id}
                        type="button"
                        onClick={() => {
                          onJumpToWalkthrough(stage.bracket);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between gap-4 px-3 py-2.5 rounded-lg text-left hover:bg-stone-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-stone-900 dark:text-white truncate">
                            {stage.title}
                          </div>
                          <div className="text-xs text-stone-500 dark:text-slate-400 truncate mt-0.5">
                            {stage.zones}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

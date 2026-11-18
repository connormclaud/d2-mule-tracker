/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Sun, Moon, Search, X, BookOpen, Layers } from 'lucide-react';
import { MULE_ITEMS, LEVELING_ROWS, LevelBracket } from './data/guideData';
import { MuleTransferSection } from './components/MuleTransferSection';
import { LevelingTableSection } from './components/LevelingTableSection';
import { WalkthroughSection } from './components/WalkthroughSection';
import { MilestoneTrackerBar } from './components/MilestoneTrackerBar';

type DocPageMode = 'all' | 'section-1' | 'section-2' | 'section-3';

const STORAGE_KEY_ITEMS = 'd2_holyfire_checked_items_v1';
const STORAGE_KEY_LEVEL = 'd2_holyfire_active_level_v1';
const STORAGE_KEY_THEME = 'd2_holyfire_theme_v1';
const STORAGE_KEY_TRACKER_FOLDED = 'd2_holyfire_tracker_folded_v1';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      return saved ? saved === 'dark' : true;
    } catch {
      return true;
    }
  });

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ITEMS);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [activeRowId, setActiveRowId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_LEVEL) || 'lvl-1';
    } catch {
      return 'lvl-1';
    }
  });

  const [pageMode, setPageMode] = useState<DocPageMode>('all');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [trackerFolded, setTrackerFolded] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRACKER_FOLDED);
      return saved ? saved === 'true' : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEY_THEME, darkMode ? 'dark' : 'light');
    } catch {
      // ignore storage errors
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(checkedItems));
    } catch {
      // ignore
    }
  }, [checkedItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LEVEL, activeRowId);
    } catch {
      // ignore
    }
  }, [activeRowId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRACKER_FOLDED, String(trackerFolded));
    } catch {
      // ignore
    }
  }, [trackerFolded]);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<string>;
      if (custom.detail) {
        setActiveRowId(custom.detail);
      }
    };
    window.addEventListener('select-level-row', handler);
    return () => window.removeEventListener('select-level-row', handler);
  }, []);

  const handleToggleItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSetAllItems = (checked: boolean) => {
    if (!checked) {
      setCheckedItems({});
      return;
    }
    const next: Record<string, boolean> = {};
    for (const item of MULE_ITEMS) {
      next[item.id] = true;
    }
    setCheckedItems(next);
  };

  const handleResetAllProgress = () => {
    setCheckedItems({});
    setActiveRowId('lvl-1');
    setGlobalSearch('');
  };

  const completedItemsCount = useMemo(
    () => MULE_ITEMS.filter((i) => checkedItems[i.id]).length,
    [checkedItems]
  );

  const activeLevelObj = useMemo(
    () => LEVELING_ROWS.find((r) => r.id === activeRowId) || LEVELING_ROWS[0],
    [activeRowId]
  );

  const handleJumpToBracket = (_bracket: LevelBracket) => {
    if (pageMode !== 'all' && pageMode !== 'section-2') {
      setPageMode('section-2');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-stone-50/95 dark:bg-slate-950/95 backdrop-blur-xs border-b border-stone-200 dark:border-slate-800">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={() => setPageMode('all')}
            className="text-base sm:text-lg font-bold tracking-tight text-stone-900 dark:text-white whitespace-nowrap shrink-0 font-display"
          >
            Holy Fire Paladin 1–40 Docs
          </a>

          {/* Zone 2: 4 concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600 dark:text-slate-300">
            <a
              href="#mule-prep"
              onClick={() => {
                if (pageMode !== 'all') setPageMode('section-1');
              }}
              className="hover:text-stone-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              1. Mule Prep
            </a>
            <a
              href="#leveling-table"
              onClick={() => {
                if (pageMode !== 'all') setPageMode('section-2');
              }}
              className="hover:text-stone-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              2. Leveling Table
            </a>
            <a
              href="#walkthrough"
              onClick={() => {
                if (pageMode !== 'all') setPageMode('section-3');
              }}
              className="hover:text-stone-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              3. Act Walkthrough
            </a>
            <a
              href="#loadouts"
              onClick={() => {
                if (pageMode !== 'all') setPageMode('section-3');
              }}
              className="hover:text-stone-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              4. Loadout Snapshots
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleResetAllProgress}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-stone-900 dark:bg-amber-600 dark:text-slate-950 dark:font-semibold rounded-md hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
            >
              Reset Tracker
            </button>
          </div>
        </div>
      </header>

      {/* Frozen Active Milestone Tracker Bar (Foldable) */}
      <MilestoneTrackerBar
        activeRowId={activeRowId}
        onSelectRow={setActiveRowId}
        folded={trackerFolded}
        onToggleFold={() => setTrackerFolded((f) => !f)}
      />

      {/* Main 1440px Documentation Workspace */}
      <div id="top" className="max-w-[1440px] w-full mx-auto flex-1 flex flex-col lg:flex-row gap-8 px-4 sm:px-8 py-6 sm:py-8">
        {/* Left Documentation Sidebar (Desktop 250px) */}
        <aside className="lg:w-64 shrink-0">
          <div className={`lg:sticky space-y-6 ${trackerFolded ? 'lg:top-[140px]' : 'lg:top-[224px]'}`}>
            {/* Theme & Reading View Controls */}
            <div className="rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-stone-500 dark:text-slate-400">
                  READING APPEARANCE
                </span>
                <button
                  type="button"
                  onClick={() => setDarkMode((d) => !d)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950 text-stone-800 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {darkMode ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Light Paper</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-slate-700" />
                      <span>Dark Slate</span>
                    </>
                  )}
                </button>
              </div>

              {/* Global Search Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Search guide (e.g. Raven Claw)..."
                  aria-label="Global guide search"
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded text-stone-900 dark:text-slate-100 placeholder:text-stone-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-600/40"
                />
                {globalSearch && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setGlobalSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Page View Selector */}
              <div className="space-y-1">
                <div className="text-[11px] font-mono text-stone-500 dark:text-slate-400 pb-1">
                  DOCUMENTATION MODE
                </div>
                {(
                  [
                    { id: 'all', label: 'Complete Guide (All Sections)', icon: Layers },
                    { id: 'section-1', label: '1. Mule & Stash Setup', icon: BookOpen },
                    { id: 'section-2', label: '2. Leveling Table (1–40)', icon: BookOpen },
                    { id: 'section-3', label: '3. Act Walkthrough & Gear', icon: BookOpen },
                  ] as const
                ).map((mode) => {
                  const Icon = mode.icon;
                  const active = pageMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setPageMode(mode.id)}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium rounded text-left transition-colors cursor-pointer ${
                        active
                          ? 'bg-stone-900 text-white dark:bg-slate-800 dark:text-amber-300'
                          : 'text-stone-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800/50 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Character & Stash Summary Widget */}
            <div className="rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 font-mono text-xs">
              <div className="text-[11px] text-stone-500 dark:text-slate-400">
                SESSION STATUS
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-stone-600 dark:text-slate-400">
                  <span>Mule Items Moved</span>
                  <span className="tabular-nums font-semibold text-stone-900 dark:text-white">
                    {completedItemsCount} / {MULE_ITEMS.length}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 dark:bg-emerald-500 transition-transform origin-left"
                    style={{
                      transform: `scaleX(${completedItemsCount / MULE_ITEMS.length})`,
                    }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 dark:border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-500 dark:text-slate-400">Active Milestone</span>
                  <span className="font-semibold text-amber-800 dark:text-amber-400 tabular-nums">
                    {activeLevelObj.isQuest ? activeLevelObj.levelOrQuest : `Lvl ${activeLevelObj.levelOrQuest}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 dark:text-slate-400">Effective Str / Dex</span>
                  <span className="tabular-nums text-stone-800 dark:text-slate-200">
                    {activeLevelObj.effectiveStr} / {activeLevelObj.effectiveDex}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 dark:text-slate-400">Effective Vit</span>
                  <span className="tabular-nums text-stone-800 dark:text-slate-200">
                    {activeLevelObj.effectiveVit}
                  </span>
                </div>
              </div>

              {/* Key Breakpoints Quick Reference */}
              <div className="pt-2 border-t border-stone-200 dark:border-slate-800 space-y-1 text-[11px] text-stone-500 dark:text-slate-400">
                <div className="font-semibold text-stone-700 dark:text-slate-300">
                  MAJOR POWER SPIKES
                </div>
                <div>· Lvl 6: Sup. Rondache (+44 Res)</div>
                <div>· Lvl 7: 2x Nagel + 2x Russet (+39% FR)</div>
                <div>· Lvl 8: 5pc Sigon&apos;s (70 Str)</div>
                <div>· Lvl 10: Blood Crescent + Beryl GC</div>
                <div>· Lvl 15: Raven Claw Explosive Bow</div>
                <div>· Lvl 17: Stealth (36 Dex) + Ocher SC</div>
                <div>· Lvl 23: Kinemil&apos;s Awl (+6 Holy Fire)</div>
                <div>· Lvl 26: 2x Shimmering LCs (+14 Res)</div>
                <div>· Lvl 27: Merc Insight + Charge</div>
                <div>· Lvl 29: Tearhaunch + 48% FHR (5-fr)</div>
                <div>· Lvl 31: Moser&apos;s (+63 Res) + Spirit 34</div>
                <div>· Lvl 35: Stealskull Merc + 65% CB</div>
                <div>· Lvl 37: Smoke MP + Beast Gyre Ring</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 space-y-14">
          {/* Document Title Banner */}
          <div className="rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-stone-500 dark:text-slate-400">
              <span>DIABLO II: RESURRECTED</span>
              <span aria-hidden="true">·</span>
              <span>SOFTCORE TWINK LEVELING REFERENCE</span>
              <span aria-hidden="true">·</span>
              <span>PARSED FROM .D2S MULES & MODERNSHAREDSTASHSOFTCOREV2.D2I</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-stone-900 dark:text-white leading-[1.15]"
              style={{ textWrap: 'balance' }}
            >
              Custom Levels 1–40 Holy Fire Paladin Leveling Guide
            </h1>

            <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Built directly from the items parsed across your{' '}
              <code className="font-mono text-sm px-1.5 py-0.5 rounded bg-stone-100 dark:bg-slate-800 text-stone-900 dark:text-slate-100">
                .d2s
              </code>{' '}
              mules (<code className="font-mono text-sm">mule_leveling</code>,{' '}
              <code className="font-mono text-sm">mule_unique</code>,{' '}
              <code className="font-mono text-sm">mulejewelbase</code>,{' '}
              <code className="font-mono text-sm">mule_charms</code>), stripped gear from{' '}
              <code className="font-mono text-sm">sork</code> (Stash, Inv &amp; Equipped), and{' '}
              <code className="font-mono text-sm px-1.5 py-0.5 rounded bg-stone-100 dark:bg-slate-800 text-stone-900 dark:text-slate-100">
                ModernSharedStashSoftCoreV2.d2i
              </code>
              .
            </p>
          </div>

          {/* Section 1: Mule & Shared Stash Consolidation */}
          {(pageMode === 'all' || pageMode === 'section-1') && (
            <MuleTransferSection
              checkedItems={checkedItems}
              onToggleItem={handleToggleItem}
              onSetAllItems={handleSetAllItems}
              globalSearch={globalSearch}
            />
          )}

          {/* Section 2: Optimal Holy Fire Leveling Table (1–40) */}
          {(pageMode === 'all' || pageMode === 'section-2') && (
            <LevelingTableSection
              activeRowId={activeRowId}
              onSelectRow={setActiveRowId}
              globalSearch={globalSearch}
            />
          )}

          {/* Section 3: Per-Level & Per-Act Walkthrough */}
          {(pageMode === 'all' || pageMode === 'section-3') && (
            <WalkthroughSection onJumpToLevelBracket={handleJumpToBracket} />
          )}
        </main>
      </div>

      {/* Quiet Documentation Footer */}
      <footer className="border-t border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-slate-400">
          <div>
            Custom Levels 1–40 Holy Fire Paladin Leveling Documentation · Parsed from local .d2s & .d2i stash files
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.icy-veins.com/d2/paladin-fastest-leveling-build#hammerdin-leveling-table"
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="hover:text-stone-900 dark:hover:text-white underline underline-offset-4"
            >
              Icy Veins Leveling Table
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://maxroll.gg/d2/guides/paladin-leveling"
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="hover:text-stone-900 dark:hover:text-white underline underline-offset-4"
            >
              Maxroll Paladin Guide
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

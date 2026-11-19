/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search } from 'lucide-react';
import {
  MULE_ITEMS,
  MERC_GEAR_PULL_ITEMS,
  LEVELING_ROWS,
  MuleGroupKey,
  LevelBracket,
} from './data/guideData';
import { LevelControllerRail } from './components/LevelControllerRail';
import { LiveRunView } from './components/LiveRunView';
import { MuleTransferSection } from './components/MuleTransferSection';
import { LevelingTableSection } from './components/LevelingTableSection';
import { MercGearSection } from './components/MercGearSection';
import { WalkthroughSection } from './components/WalkthroughSection';
import { GlobalSearchModal, WorkspaceTab } from './components/GlobalSearchModal';

const STORAGE_KEY_ITEMS = 'd2_holyfire_checked_items_v1';
const STORAGE_KEY_MERC_ITEMS = 'd2_holyfire_checked_merc_items_v1';
const STORAGE_KEY_LEVEL = 'd2_holyfire_active_level_v1';
const STORAGE_KEY_THEME = 'd2_holyfire_theme_v1';
const STORAGE_KEY_TAB = 'd2_holyfire_active_tab_v2';

const NAV_ITEMS: { id: WorkspaceTab; label: string }[] = [
  { id: 'live', label: 'Live Run' },
  { id: 'stash', label: 'Stash Prep' },
  { id: 'leveling', label: 'Leveling Table' },
  { id: 'merc', label: 'Mercenary' },
  { id: 'walkthrough', label: 'Walkthrough' },
];

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

  const [checkedMercItems, setCheckedMercItems] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_MERC_ITEMS);
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

  const [activeTab, setActiveTab] = useState<WorkspaceTab>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TAB) as WorkspaceTab | null;
      if (saved && ['live', 'stash', 'leveling', 'merc', 'walkthrough'].includes(saved)) {
        return saved;
      }
      return 'live';
    } catch {
      return 'live';
    }
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [stashFocusGroup, setStashFocusGroup] = useState<'all' | MuleGroupKey>('all');
  const [stashFocusSearch, setStashFocusSearch] = useState('');
  const [walkthroughFocusStage, setWalkthroughFocusStage] = useState<'all' | LevelBracket>('all');

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
      localStorage.setItem(STORAGE_KEY_MERC_ITEMS, JSON.stringify(checkedMercItems));
    } catch {
      // ignore
    }
  }, [checkedMercItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LEVEL, activeRowId);
    } catch {
      // ignore
    }
  }, [activeRowId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TAB, activeTab);
    } catch {
      // ignore
    }
  }, [activeTab]);

  // Global keyboard shortcuts: '/' opens search, ArrowLeft/ArrowRight steps levels
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (e.key === '/' && !isEditable && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((open) => !open);
        return;
      }

      if (!isEditable && !searchOpen && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        const idx = LEVELING_ROWS.findIndex((r) => r.id === activeRowId);
        const safeIdx = idx >= 0 ? idx : 0;
        const delta = e.key === 'ArrowRight' ? 1 : -1;
        const nextIdx = Math.min(Math.max(safeIdx + delta, 0), LEVELING_ROWS.length - 1);
        if (nextIdx !== safeIdx) {
          e.preventDefault();
          setActiveRowId(LEVELING_ROWS[nextIdx].id);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeRowId, searchOpen]);

  const handleSwitchTab = useCallback((tab: WorkspaceTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleSetGroupItems = (groupKey: MuleGroupKey, checked: boolean) => {
    setCheckedItems((prev) => {
      const next = { ...prev };
      for (const item of MULE_ITEMS) {
        if (item.groupKey === groupKey) {
          if (checked) {
            next[item.id] = true;
          } else {
            delete next[item.id];
          }
        }
      }
      return next;
    });
  };

  const handleToggleMercItem = (id: string) => {
    setCheckedMercItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSetAllMercItems = (checked: boolean) => {
    if (!checked) {
      setCheckedMercItems({});
      return;
    }
    const next: Record<string, boolean> = {};
    for (const item of MERC_GEAR_PULL_ITEMS) {
      next[item.id] = true;
    }
    setCheckedMercItems(next);
  };

  const handleResetAllProgress = () => {
    setCheckedItems({});
    setCheckedMercItems({});
    setActiveRowId('lvl-1');
  };

  const completedItemsCount = useMemo(
    () => MULE_ITEMS.filter((i) => checkedItems[i.id]).length,
    [checkedItems]
  );

  const completedMercCount = useMemo(
    () => MERC_GEAR_PULL_ITEMS.filter((i) => checkedMercItems[i.id]).length,
    [checkedMercItems]
  );

  const activeLevelObj = useMemo(
    () => LEVELING_ROWS.find((r) => r.id === activeRowId) || LEVELING_ROWS[0],
    [activeRowId]
  );

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Strict 3-Zone Top Bar Contract (Single 56px sticky bar across all viewports) */}
      <header className="sticky top-0 z-30 h-14 bg-stone-50/95 dark:bg-slate-950/95 backdrop-blur-xs border-b border-stone-200 dark:border-slate-800">
        <div className="max-w-[1440px] h-full mx-auto flex items-center justify-between gap-8 px-4 sm:px-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#live"
            onClick={(e) => {
              e.preventDefault();
              handleSwitchTab('live');
            }}
            className="text-base sm:text-lg font-bold tracking-tight text-stone-900 dark:text-white whitespace-nowrap shrink-0 font-display"
          >
            Holy Fire 1–40
          </a>

          {/* Zone 2: 5 Concise Single-Line Text Navigation Links */}
          <nav
            aria-label="Primary workspace navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSwitchTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                    isActive
                      ? 'border-amber-600 text-stone-900 dark:text-white font-semibold'
                      : 'border-transparent text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Safe Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-stone-900 text-white dark:bg-amber-600 dark:text-slate-950 hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Guide</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Workspace Navigation Strip (Non-sticky to preserve mobile viewport) */}
      <nav
        aria-label="Mobile workspace navigation"
        className="md:hidden border-b border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto"
      >
        <div className="flex items-center gap-1 px-4 py-2 min-w-max">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSwitchTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white dark:bg-amber-600 dark:text-slate-950 font-semibold'
                    : 'text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main 1440px Workspace Layout */}
      <div className="max-w-[1440px] w-full mx-auto flex-1 flex flex-col lg:flex-row gap-8 px-4 sm:px-8 py-6 sm:py-8">
        {/* Left Always-On Level Controller Rail */}
        <LevelControllerRail
          activeRowId={activeRowId}
          onSelectRow={setActiveRowId}
          completedItemsCount={completedItemsCount}
          completedMercCount={completedMercCount}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((d) => !d)}
          onResetAllProgress={handleResetAllProgress}
          onSwitchTab={handleSwitchTab}
        />

        {/* Focused Workspace Viewport */}
        <main className="flex-1 min-w-0">
          {activeTab === 'live' && (
            <LiveRunView
              activeRowId={activeRowId}
              onSelectRow={setActiveRowId}
              checkedItems={checkedItems}
              onToggleItem={handleToggleItem}
              onSwitchTab={handleSwitchTab}
            />
          )}

          {activeTab === 'stash' && (
            <MuleTransferSection
              checkedItems={checkedItems}
              onToggleItem={handleToggleItem}
              onSetAllItems={handleSetAllItems}
              onSetGroupItems={handleSetGroupItems}
              initialGroup={stashFocusGroup}
              initialSearch={stashFocusSearch}
            />
          )}

          {activeTab === 'leveling' && (
            <LevelingTableSection
              activeRowId={activeRowId}
              onSelectRow={setActiveRowId}
            />
          )}

          {activeTab === 'merc' && (
            <MercGearSection
              checkedMercItems={checkedMercItems}
              onToggleMercItem={handleToggleMercItem}
              onSetAllMercItems={handleSetAllMercItems}
              activeNumericLevel={activeLevelObj.numericLevel}
              onSelectLevelRow={setActiveRowId}
            />
          )}

          {activeTab === 'walkthrough' && (
            <WalkthroughSection
              activeBracket={activeLevelObj.bracket}
              initialStage={walkthroughFocusStage}
              onActivateStageLevel={(rowId) => {
                setActiveRowId(rowId);
                handleSwitchTab('live');
              }}
            />
          )}
        </main>
      </div>

      {/* Quiet Documentation Footer */}
      <footer className="border-t border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-slate-400">
          <div>
            Custom Levels 1–40 Holy Fire Paladin Leveling Companion · Parsed from .d2s &amp; Shared Stash files · Press <kbd className="font-mono px-1 py-0.5 rounded bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300">←</kbd> <kbd className="font-mono px-1 py-0.5 rounded bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300">→</kbd> to step levels
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <a
              href="https://www.icy-veins.com/d2/paladin-fastest-leveling-build#hammerdin-leveling-table"
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="hover:text-stone-900 dark:hover:text-white underline underline-offset-4"
            >
              Icy Veins Table
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://maxroll.gg/d2/guides/paladin-leveling"
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="hover:text-stone-900 dark:hover:text-white underline underline-offset-4"
            >
              Maxroll Guide
            </a>
          </div>
        </div>
      </footer>

      {/* Global Search Modal */}
      <GlobalSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onJumpToMuleItem={(groupKey, searchTerm) => {
          setStashFocusGroup(groupKey);
          setStashFocusSearch(searchTerm);
          handleSwitchTab('stash');
        }}
        onJumpToLevelRow={(rowId, openTab) => {
          setActiveRowId(rowId);
          handleSwitchTab(openTab);
        }}
        onJumpToMerc={() => {
          handleSwitchTab('merc');
        }}
        onJumpToWalkthrough={(bracket) => {
          setWalkthroughFocusStage(bracket);
          handleSwitchTab('walkthrough');
        }}
      />
    </div>
  );
}

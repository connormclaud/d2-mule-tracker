import React from 'react';

type TokenKind = 'unique' | 'set' | 'runeword' | 'magic' | 'rare' | 'base' | 'skill';

interface TokenRule {
  pattern: string;
  kind: TokenKind;
}

// Ordered longest-first so compound names match before shorter substrings
const TOKEN_RULES: TokenRule[] = [
  // Magic charms
  { pattern: 'Ocher Small Charm of Sustenance', kind: 'magic' },
  { pattern: 'Beryl Grand Charm of Dexterity', kind: 'magic' },
  { pattern: 'Grand Charm of Balance', kind: 'magic' },
  { pattern: 'Small Charms of Good Luck', kind: 'magic' },
  { pattern: 'Small Charm of Good Luck', kind: 'magic' },
  { pattern: 'Small Charms of Balance', kind: 'magic' },
  { pattern: 'Small Charm of Inertia', kind: 'magic' },
  { pattern: 'Large Charm of Dexterity', kind: 'magic' },
  { pattern: 'Shimmering Large Charms', kind: 'magic' },
  { pattern: 'Shimmering Large Charm', kind: 'magic' },
  { pattern: 'Amber SC of Good Luck', kind: 'magic' },
  { pattern: "Serpent's LC of Inertia", kind: 'magic' },
  { pattern: 'Beryl GC of Dexterity', kind: 'magic' },
  { pattern: 'Crimson SC of Shock', kind: 'magic' },
  { pattern: 'Russet Grand Charms', kind: 'magic' },
  { pattern: 'Russet Small Charms', kind: 'magic' },
  { pattern: 'Crimson Small Charm', kind: 'magic' },
  { pattern: 'Iron LC of Inertia', kind: 'magic' },
  { pattern: 'Ruby Small Charm', kind: 'magic' },
  { pattern: 'LC of Dexterity', kind: 'magic' },
  { pattern: 'GC of Balance', kind: 'magic' },
  { pattern: 'Shimmering LCs', kind: 'magic' },
  { pattern: 'Good Luck SCs', kind: 'magic' },
  { pattern: 'SC of Inertia', kind: 'magic' },
  { pattern: 'Sapphire GC', kind: 'magic' },
  { pattern: 'Balance SCs', kind: 'magic' },
  { pattern: "Serpent's LC", kind: 'magic' },
  { pattern: 'Russet GCs', kind: 'magic' },
  { pattern: 'Russet SCs', kind: 'magic' },
  { pattern: 'Crimson SC', kind: 'magic' },
  { pattern: 'Beryl GC', kind: 'magic' },
  { pattern: 'Ocher SC', kind: 'magic' },
  { pattern: 'Jade SCs', kind: 'magic' },
  { pattern: 'Amber SC', kind: 'magic' },
  { pattern: 'Ruby SC', kind: 'magic' },

  // Set items
  { pattern: "Hsarus' Iron Stay", kind: 'set' },
  { pattern: "5-Piece Sigon's", kind: 'set' },
  { pattern: "Sigon's Shelter", kind: 'set' },
  { pattern: "Sigon's Visor", kind: 'set' },
  { pattern: "Sigon's Sabot", kind: 'set' },
  { pattern: "Sigon's Gage", kind: 'set' },
  { pattern: "Sigon's Wrap", kind: 'set' },
  { pattern: "Cathan's Seal", kind: 'set' },
  { pattern: 'Angelic Amulet', kind: 'set' },
  { pattern: 'Angelic Wings', kind: 'set' },
  { pattern: 'Angelic Halo', kind: 'set' },
  { pattern: "5pc Sigon's", kind: 'set' },
  { pattern: "Sigon's", kind: 'set' },
  { pattern: 'Angelic', kind: 'set' },

  // Unique items
  { pattern: "Moser's Blessed Circle", kind: 'unique' },
  { pattern: 'Hand of Blessed Light', kind: 'unique' },
  { pattern: 'The Face of Horror', kind: 'unique' },
  { pattern: 'The Spirit Shroud', kind: 'unique' },
  { pattern: 'The Battlebranch', kind: 'unique' },
  { pattern: 'Treads of Cthon', kind: 'unique' },
  { pattern: 'Blood Crescent', kind: 'unique' },
  { pattern: 'Peasant Crown', kind: 'unique' },
  { pattern: 'Face of Horror', kind: 'unique' },
  { pattern: 'Spirit Shroud', kind: 'unique' },
  { pattern: "Kinemil's Awl", kind: 'unique' },
  { pattern: "Duriel's Shell", kind: 'unique' },
  { pattern: "Heaven's Light", kind: 'unique' },
  { pattern: 'Vampire Gaze', kind: 'unique' },
  { pattern: 'Kuko Shakaku', kind: 'unique' },
  { pattern: 'Rockstopper', kind: 'unique' },
  { pattern: 'Manald Heal', kind: 'unique' },
  { pattern: 'Goblin Toe', kind: 'unique' },
  { pattern: 'Tearhaunch', kind: 'unique' },
  { pattern: 'Spellsteel', kind: 'unique' },
  { pattern: 'Raven Claw', kind: 'unique' },
  { pattern: 'Gore Rider', kind: 'unique' },
  { pattern: 'Stealskull', kind: 'unique' },
  { pattern: 'Vamp Gaze', kind: 'unique' },
  { pattern: 'Nagelring', kind: 'unique' },
  { pattern: 'Tarnhelm', kind: 'unique' },
  { pattern: 'Hawkmail', kind: 'unique' },
  { pattern: 'Goldskin', kind: 'unique' },
  { pattern: "Moser's", kind: 'unique' },

  // Rare items
  { pattern: 'Doom Hold', kind: 'rare' },
  { pattern: 'Beast Gyre', kind: 'rare' },

  // Runewords
  { pattern: 'Lionheart', kind: 'runeword' },
  { pattern: 'Treachery', kind: 'runeword' },
  { pattern: 'Stealth', kind: 'runeword' },
  { pattern: 'Insight', kind: 'runeword' },
  { pattern: 'Spirit', kind: 'runeword' },
  { pattern: 'Smoke', kind: 'runeword' },
  { pattern: 'Black', kind: 'runeword' },
  { pattern: 'Cure', kind: 'runeword' },

  // Bases
  { pattern: 'Superior Rondache', kind: 'base' },
  { pattern: 'Full Plate Mail', kind: 'base' },
  { pattern: 'Studded Leather', kind: 'base' },
  { pattern: 'Savage Polearm', kind: 'base' },
  { pattern: 'Sup. Rondache', kind: 'base' },
  { pattern: 'Crystal Sword', kind: 'base' },
  { pattern: 'Starter Sword', kind: 'base' },
  { pattern: 'Breast Plate', kind: 'base' },
  { pattern: 'Broad Sword', kind: 'base' },
  { pattern: 'Mage Plate', kind: 'base' },
  { pattern: 'Scale Mail', kind: 'base' },
  { pattern: 'Poleaxe', kind: 'base' },
  { pattern: 'Polearm', kind: 'base' },
  { pattern: 'Buckler', kind: 'base' },
  { pattern: 'Casque', kind: 'base' },
  { pattern: 'Crown', kind: 'base' },
  { pattern: 'Mask', kind: 'base' },
  { pattern: 'Bill', kind: 'base' },

  // Skills
  { pattern: 'Explosive Arrows', kind: 'skill' },
  { pattern: 'Explosive Arrow', kind: 'skill' },
  { pattern: 'Resist Fire', kind: 'skill' },
  { pattern: 'Holy Fire', kind: 'skill' },
  { pattern: 'Holy Bolt', kind: 'skill' },
  { pattern: 'Meditation', kind: 'skill' },
  { pattern: 'Sacrifice', kind: 'skill' },
  { pattern: 'Cleansing', kind: 'skill' },
  { pattern: 'Decrepify', kind: 'skill' },
  { pattern: 'Defiance', kind: 'skill' },
  { pattern: 'Teleport', kind: 'skill' },
  { pattern: 'Hammerdin', kind: 'skill' },
  { pattern: 'Charge', kind: 'skill' },
  { pattern: 'Prayer', kind: 'skill' },
  { pattern: 'FoHdin', kind: 'skill' },
  { pattern: 'Smite', kind: 'skill' },
  { pattern: 'Vigor', kind: 'skill' },
  { pattern: 'Might', kind: 'skill' },
  { pattern: 'Zeal', kind: 'skill' },
  { pattern: 'FoH', kind: 'skill' },
];

const KIND_CLASS: Record<TokenKind, string> = {
  unique: 'text-amber-800 dark:text-amber-300 font-semibold',
  set: 'text-emerald-800 dark:text-emerald-400 font-semibold',
  runeword: 'text-orange-800 dark:text-orange-300 font-semibold',
  magic: 'text-blue-800 dark:text-blue-400 font-semibold',
  rare: 'text-yellow-700 dark:text-yellow-300 font-semibold',
  base: 'text-stone-900 dark:text-slate-100 font-semibold',
  skill: 'text-rose-700 dark:text-rose-400 font-semibold',
};

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const TOKEN_LOOKUP = new Map<string, TokenKind>(
  TOKEN_RULES.map((rule) => [rule.pattern, rule.kind])
);

const COMBINED_REGEX = new RegExp(
  `(?<![A-Za-z0-9'])(${TOKEN_RULES.map((r) => escapeRegExp(r.pattern)).join('|')})(?![A-Za-z0-9])`,
  'g'
);

interface RichGuideTextProps {
  text: string;
}

export const RichGuideText: React.FC<RichGuideTextProps> = ({ text }) => {
  if (!text || text === '—') {
    return <>{text}</>;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(COMBINED_REGEX)) {
    const matchedText = match[0];
    const startIndex = match.index ?? 0;

    if (startIndex > lastIndex) {
      parts.push(text.slice(lastIndex, startIndex));
    }

    const kind = TOKEN_LOOKUP.get(matchedText);
    if (kind) {
      parts.push(
        <span key={`${startIndex}-${matchedText}`} className={KIND_CLASS[kind]}>
          {matchedText}
        </span>
      );
    } else {
      parts.push(matchedText);
    }

    lastIndex = startIndex + matchedText.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
};

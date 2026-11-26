import {
  BoardTheme,
  CatTier,
  DailyMissionDef,
  DailyRewardDef,
  MissionDef,
  WheelSector,
} from './types';

export const BOARD_SIZE = 16; // 4x4 grid

export const CAT_TIERS: CatTier[] = [
  {
    level: 1,
    name: 'Mochi Kitten',
    title: 'Soft Starter',
    bodyColor: '#FFFDF7',
    bellyColor: '#FFF0E5',
    accentColor: '#FF7B6B',
    earInnerColor: '#FFB3BA',
    eyeColor: '#1E2430',
    incomePerSec: 2,
    buyBaseCost: 25,
    accessory: 'collar',
    scale: 0.78,
  },
  {
    level: 2,
    name: 'Ginger Tabby',
    title: 'Playful Tiger',
    bodyColor: '#FFA959',
    bellyColor: '#FFF4E0',
    accentColor: '#48A9A6',
    earInnerColor: '#FF9EAA',
    eyeColor: '#1E2430',
    incomePerSec: 6,
    buyBaseCost: 65,
    accessory: 'collar',
    scale: 0.84,
  },
  {
    level: 3,
    name: 'Siamese Prince',
    title: 'Blue-Eyed Noble',
    bodyColor: '#EFE4D4',
    bellyColor: '#FAF6F0',
    accentColor: '#5B6C8F',
    earInnerColor: '#C8A69E',
    eyeColor: '#2E86DE',
    incomePerSec: 16,
    buyBaseCost: 170,
    accessory: 'scarf',
    scale: 0.88,
  },
  {
    level: 4,
    name: 'Plush Smoke',
    title: 'Cloud British',
    bodyColor: '#9AA8BC',
    bellyColor: '#DFE5EE',
    accentColor: '#FFAA33',
    earInnerColor: '#E8AEB7',
    eyeColor: '#F6A623',
    incomePerSec: 42,
    buyBaseCost: 440,
    accessory: 'ruff',
    scale: 0.94,
  },
  {
    level: 5,
    name: 'Shogun Meow',
    title: 'Board Guardian',
    bodyColor: '#3B4252',
    bellyColor: '#ECEFF4',
    accentColor: '#E63946',
    earInnerColor: '#D08770',
    eyeColor: '#FFD166',
    incomePerSec: 110,
    buyBaseCost: 1150,
    accessory: 'kabuto',
    scale: 0.98,
  },
  {
    level: 6,
    name: 'Cyber Neko 2002',
    title: 'PS2 Neon Core',
    bodyColor: '#2B3040',
    bellyColor: '#535D78',
    accentColor: '#00D2D3',
    earInnerColor: '#48DBFB',
    eyeColor: '#00F5D4',
    incomePerSec: 280,
    buyBaseCost: 3000,
    accessory: 'visor',
    scale: 1.0,
  },
  {
    level: 7,
    name: 'Astro Neko',
    title: 'Orbital Pilot',
    bodyColor: '#F4F7FC',
    bellyColor: '#DCE4F2',
    accentColor: '#FF6B35',
    earInnerColor: '#FF9F80',
    eyeColor: '#2C3E50',
    incomePerSec: 720,
    buyBaseCost: 7800,
    accessory: 'astro',
    scale: 1.04,
  },
  {
    level: 8,
    name: 'Golden Maneki',
    title: 'Fortune Magnet',
    bodyColor: '#FFD147',
    bellyColor: '#FFF7D6',
    accentColor: '#E63946',
    earInnerColor: '#FFB703',
    eyeColor: '#242933',
    incomePerSec: 1850,
    buyBaseCost: 20500,
    accessory: 'maneki',
    scale: 1.08,
  },
  {
    level: 9,
    name: 'Jade Emperor',
    title: 'Lotus Sovereign',
    bodyColor: '#2EC4B6',
    bellyColor: '#CBF3F0',
    accentColor: '#FFB703',
    earInnerColor: '#80ED99',
    eyeColor: '#14213D',
    incomePerSec: 4800,
    buyBaseCost: 54000,
    accessory: 'crown',
    scale: 1.1,
  },
  {
    level: 10,
    name: 'Phantom Neko',
    title: 'Twin-Tail Spirit',
    bodyColor: '#D8D4F2',
    bellyColor: '#F5F3FF',
    accentColor: '#8338EC',
    earInnerColor: '#C77DFF',
    eyeColor: '#FF006E',
    incomePerSec: 12500,
    buyBaseCost: 145000,
    accessory: 'spirit',
    scale: 1.12,
  },
  {
    level: 11,
    name: 'Crystal Titan',
    title: 'Polygon Prism',
    bodyColor: '#56CFE1',
    bellyColor: '#CAF0F8',
    accentColor: '#3A86FF',
    earInnerColor: '#90E0EF',
    eyeColor: '#FFFFFF',
    incomePerSec: 32000,
    buyBaseCost: 390000,
    accessory: 'crystal',
    scale: 1.15,
  },
  {
    level: 12,
    name: 'Mythic Cat Deity',
    title: 'Ultimate Form',
    bodyColor: '#FFF8E7',
    bellyColor: '#FFFFFF',
    accentColor: '#F7B801',
    earInnerColor: '#FFD166',
    eyeColor: '#FF9F1C',
    incomePerSec: 88000,
    buyBaseCost: 1100000,
    accessory: 'deity',
    scale: 1.2,
  },
];

export const BOARD_THEMES: BoardTheme[] = [
  {
    id: 'ps2_silver',
    name: 'PS2 Silver',
    priceGems: 0,
    bgHex: '#E6EAF2',
    fogHex: '#E6EAF2',
    boardBaseHex: '#C8D0DF',
    tileHex: '#F7F9FC',
    tileAltHex: '#ECEFF6',
    rimHex: '#4E7BFF',
    uiDark: false,
  },
  {
    id: 'shibuya_cream',
    name: 'Shibuya Cream',
    priceGems: 40,
    bgHex: '#F3ECE2',
    fogHex: '#F3ECE2',
    boardBaseHex: '#DDD0BF',
    tileHex: '#FFFDF8',
    tileAltHex: '#F5EDE1',
    rimHex: '#FF6B4A',
    uiDark: false,
  },
  {
    id: 'midnight_indigo',
    name: 'Midnight Tokyo',
    priceGems: 80,
    bgHex: '#151926',
    fogHex: '#151926',
    boardBaseHex: '#22283C',
    tileHex: '#2B334B',
    tileAltHex: '#252C42',
    rimHex: '#00D2D3',
    uiDark: true,
  },
];

export const MISSIONS: MissionDef[] = [
  {
    id: 'merge_5',
    title: 'First Steps: Complete 5 merges',
    target: 5,
    rewardGems: 15,
    type: 'merges',
  },
  {
    id: 'mouse_2',
    title: 'Mouse Hunter: Catch 2 Golden Mice',
    target: 2,
    rewardGems: 25,
    type: 'mice',
  },
  {
    id: 'merge_25',
    title: 'Merge Master: Complete 25 merges',
    target: 25,
    rewardGems: 35,
    type: 'merges',
  },
  {
    id: 'mouse_8',
    title: 'Feline Reflex: Catch 8 Golden Mice',
    target: 8,
    rewardGems: 50,
    type: 'mice',
  },
  {
    id: 'merge_100',
    title: 'Low-Poly Tycoon: Complete 100 merges',
    target: 100,
    rewardGems: 80,
    type: 'merges',
  },
  {
    id: 'level_5',
    title: 'Unlock Shogun Meow (Tier 5)',
    target: 5,
    rewardGems: 30,
    type: 'maxLevel',
  },
  {
    id: 'level_8',
    title: 'Unlock Golden Maneki (Tier 8)',
    target: 8,
    rewardGems: 65,
    type: 'maxLevel',
  },
  {
    id: 'taps_30',
    title: 'Pet your cats 30 times',
    target: 30,
    rewardGems: 20,
    type: 'taps',
  },
  {
    id: 'crates_10',
    title: 'Unbox 10 Mystery Crates',
    target: 10,
    rewardGems: 25,
    type: 'crates',
  },
];

export const DAILY_MISSIONS: DailyMissionDef[] = [
  {
    id: 'dm_merges',
    title: 'Merge cats 15 times',
    target: 15,
    rewardGems: 25,
    type: 'merges',
  },
  {
    id: 'dm_crates',
    title: 'Open 8 Mystery Crates',
    target: 8,
    rewardGems: 20,
    type: 'crates',
  },
  {
    id: 'dm_taps',
    title: 'Pet cats 20 times',
    target: 20,
    rewardGems: 15,
    type: 'taps',
  },
  {
    id: 'dm_asmr',
    title: 'ASMR Break: 12 Soap or Pop-It taps',
    target: 12,
    rewardGems: 20,
    type: 'asmr',
  },
  {
    id: 'dm_ads',
    title: 'Use 2 Video Boosts to speed up',
    target: 2,
    rewardGems: 30,
    rewardTickets: 1,
    type: 'ads',
  },
];

export const CAT_QUIPS: string[] = [
  'Purr! Pet me more!',
  'Where is my fish?',
  'PS2 polygons rule!',
  'Zoomies mode ready!',
  'Merge me to legend!',
  'Catch the Golden Mouse!',
  'I run this board now',
  'Cat-vestor on duty',
  'Paws print cash',
  'Meow Fever is close!',
];

export const WHEEL_SECTORS: WheelSector[] = [
  {
    id: 'coins_small',
    label: '+25s Income',
    color: '#3B66F5',
    textColor: '#FFFFFF',
    kind: 'coins',
    value: 25,
  },
  {
    id: 'gems_15',
    label: '+15 Gems',
    color: '#0FA968',
    textColor: '#FFFFFF',
    kind: 'gems',
    value: 15,
  },
  {
    id: 'boost_3x',
    label: '3x Income 45s',
    color: '#F59E0B',
    textColor: '#171B26',
    kind: 'boost_3x',
    value: 45,
  },
  {
    id: 'auto_merge',
    label: '+2 Auto-Merge',
    color: '#6366F1',
    textColor: '#FFFFFF',
    kind: 'auto_merge',
    value: 2,
  },
  {
    id: 'bonus_cat',
    label: 'Cat +2 Tiers',
    color: '#EC4899',
    textColor: '#FFFFFF',
    kind: 'bonus_cat',
    value: 2,
  },
  {
    id: 'jackpot',
    label: 'JACKPOT +50 G',
    color: '#FFD147',
    textColor: '#171B26',
    kind: 'jackpot',
    value: 50,
  },
];

export const DAILY_REWARDS: DailyRewardDef[] = [
  { day: 1, label: '+250 Coins', kind: 'coins', amount: 250 },
  { day: 2, label: '+20 Gems', kind: 'gems', amount: 20 },
  { day: 3, label: '+2 Auto-Merge', kind: 'auto_merge', amount: 2 },
  { day: 4, label: '+40 Gems', kind: 'gems', amount: 40 },
  { day: 5, label: 'Cat +2 Tiers', kind: 'bonus_cat', amount: 2 },
  { day: 6, label: '+75 Gems', kind: 'gems', amount: 75 },
  { day: 7, label: '+150 Gems', kind: 'gems', amount: 150 },
];

export function formatCoins(value: number): string {
  if (!Number.isFinite(value)) return '0';
  if (value < 1000) return Math.floor(value).toString();
  const units = ['K', 'M', 'B', 'T', 'Qa'];
  let v = value;
  let unitIdx = -1;
  while (v >= 1000 && unitIdx < units.length - 1) {
    v /= 1000;
    unitIdx++;
  }
  const formatted = v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2);
  return `${formatted.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')}${units[unitIdx]}`;
}

export function getCatPurchasePrice(
  level: number,
  timesBought: number,
  flashSaleActive = false,
): number {
  const tier = CAT_TIERS[Math.max(0, Math.min(CAT_TIERS.length - 1, level - 1))];
  const raw = tier.buyBaseCost * Math.pow(1.14, timesBought);
  return Math.max(10, Math.round(flashSaleActive ? raw * 0.7 : raw));
}

export function getUpgradeCost(
  kind: 'spawnLevel' | 'incomeMultiplierLevel' | 'crateSpeedLevel',
  currentLevel: number,
): { currency: 'coins' | 'gems'; amount: number } {
  if (kind === 'spawnLevel') {
    return {
      currency: 'coins',
      amount: Math.round(320 * Math.pow(2.75, currentLevel - 1)),
    };
  }
  if (kind === 'incomeMultiplierLevel') {
    return {
      currency: 'coins',
      amount: Math.round(220 * Math.pow(1.95, currentLevel - 1)),
    };
  }
  return {
    currency: 'gems',
    amount: 15 + (currentLevel - 1) * 12,
  };
}

export function getPendingGoldenFish(highestLevel: number, totalMerges: number): number {
  if (highestLevel < 6) return 0;
  return Math.max(1, (highestLevel - 5) * 2 + Math.floor(totalMerges / 40));
}

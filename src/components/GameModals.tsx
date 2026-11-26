import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  Coins,
  Fish,
  Gem,
  Gift,
  Play,
  RotateCw,
  Sparkles,
  Ticket,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';
import { soundEngine } from '../game/audio';
import {
  BOARD_THEMES,
  CAT_TIERS,
  DAILY_MISSIONS,
  DAILY_REWARDS,
  MISSIONS,
  WHEEL_SECTORS,
  formatCoins,
  getCatPurchasePrice,
  getPendingGoldenFish,
  getUpgradeCost,
} from '../game/catData';
import {
  ActiveModal,
  BoardThemeId,
  GameState,
  RewardedAdOffer,
  WheelSector,
} from '../game/types';

interface GameModalsProps {
  activeModal: ActiveModal;
  state: GameState;
  isDark: boolean;
  offlineCoins: number;
  adOffer: RewardedAdOffer | null;
  canClaimDaily: boolean;
  onClose: () => void;
  onBuyCatLevel: (level: number) => void;
  onBuyUpgrade: (kind: 'spawnLevel' | 'incomeMultiplierLevel' | 'crateSpeedLevel') => void;
  onBuyTheme: (themeId: BoardThemeId) => void;
  onBuyVipPack: () => void;
  onWatchAdForGems: () => void;
  onClaimDiscovery: (level: number) => void;
  onClaimMission: (missionId: string) => void;
  onClaimDailyMission: (missionId: string) => void;
  onClaimDailyChest: () => void;
  onClaimOffline: (doubled: boolean) => void;
  onCompleteAd: () => void;
  onSpinWheelComplete: (sector: WheelSector, method: 'ticket' | 'gems') => void;
  onWatchAdForTicket: () => void;
  onClaimDaily: () => void;
  onPrestige: () => void;
}

export const GameModals: React.FC<GameModalsProps> = ({
  activeModal,
  state,
  isDark,
  offlineCoins,
  adOffer,
  canClaimDaily,
  onClose,
  onBuyCatLevel,
  onBuyUpgrade,
  onBuyTheme,
  onBuyVipPack,
  onWatchAdForGems,
  onClaimDiscovery,
  onClaimMission,
  onClaimDailyMission,
  onClaimDailyChest,
  onClaimOffline,
  onCompleteAd,
  onSpinWheelComplete,
  onWatchAdForTicket,
  onClaimDaily,
  onPrestige,
}) => {
  const [shopTab, setShopTab] = useState<'upgrades' | 'cats' | 'vip'>('upgrades');
  const [fortuneTab, setFortuneTab] = useState<'wheel' | 'daily' | 'prestige'>('wheel');
  const [missionsTab, setMissionsTab] = useState<'daily' | 'achievements'>('daily');
  const [adSecondsLeft, setAdSecondsLeft] = useState(3);

  // Wheel animation state
  const [spinning, setSpinning] = useState(false);
  const [wheelAngle, setWheelAngle] = useState(0);
  const [lastWonSector, setLastWonSector] = useState<WheelSector | null>(null);
  const spinTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (spinTimerRef.current) window.clearTimeout(spinTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (activeModal !== 'ad') return;
    setAdSecondsLeft(3);
    const timer = window.setInterval(() => {
      setAdSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeModal, adOffer?.id]);

  if (!activeModal) return null;

  const surface = isDark
    ? 'bg-[#1B2030] text-[#F1F5F9] border-white/12'
    : 'bg-[#FFFFFF] text-[#171B26] border-slate-900/10';
  const subSurface = isDark
    ? 'bg-[#242B40] border-white/10'
    : 'bg-[#F4F6FA] border-slate-900/8';
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';

  const startWheelSpin = (method: 'ticket' | 'gems') => {
    if (spinning) return;
    if (method === 'ticket' && state.spinTickets <= 0) return;
    if (method === 'gems' && state.gems < 15) return;

    const sectorCount = WHEEL_SECTORS.length;
    const chosenIdx = Math.floor(Math.random() * sectorCount);
    const sectorAngle = 360 / sectorCount;
    const targetSectorCenter = chosenIdx * sectorAngle + sectorAngle / 2;
    const extraTurns = 360 * 5;
    const currentMod = wheelAngle % 360;
    const deltaToZero = 360 - currentMod;
    const finalAngle = wheelAngle + deltaToZero + extraTurns + (360 - targetSectorCenter);

    setLastWonSector(null);
    setSpinning(true);
    setWheelAngle(finalAngle);

    let ticks = 0;
    const tickInterval = window.setInterval(() => {
      ticks++;
      soundEngine.playWheelTick();
      if (ticks >= 14) window.clearInterval(tickInterval);
    }, 180);

    spinTimerRef.current = window.setTimeout(() => {
      window.clearInterval(tickInterval);
      setSpinning(false);
      const won = WHEEL_SECTORS[chosenIdx];
      setLastWonSector(won);
      onSpinWheelComplete(won, method);
    }, 2900);
  };

  const pendingFish = getPendingGoldenFish(
    state.highestUnlockedLevel,
    state.totalMerges,
  );

  const conicStops = WHEEL_SECTORS.map((s, idx) => {
    const start = (idx / WHEEL_SECTORS.length) * 100;
    const end = ((idx + 1) / WHEEL_SECTORS.length) * 100;
    return `${s.color} ${start}% ${end}%`;
  }).join(', ');

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && activeModal !== 'ad' && !spinning) {
          onClose();
        }
      }}
    >
      <div
        className={`w-full max-w-xl rounded-xl border shadow-2xl overflow-hidden ${surface}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-current/10">
          <h2 className="font-display text-lg font-bold tracking-tight">
            {activeModal === 'shop' && 'Shop & Upgrades'}
            {activeModal === 'catalog' && 'Cat Index'}
            {activeModal === 'missions' && 'Missions & Achievements'}
            {activeModal === 'fortune' && 'Luck, Daily & Cat Nirvana'}
            {activeModal === 'offline' && 'Welcome Back!'}
            {activeModal === 'ad' && (adOffer?.title ?? 'Video Bonus')}
          </h2>
          {activeModal !== 'ad' && !spinning && (
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-current/10 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="max-h-[75vh] overflow-y-auto p-5">
          {activeModal === 'fortune' && (
            <div className="space-y-5">
              {/* Tabs */}
              <div className={`grid grid-cols-3 gap-1 rounded-lg p-1 border ${subSurface}`}>
                <button
                  disabled={spinning}
                  onClick={() => setFortuneTab('wheel')}
                  className={`py-2 px-3 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                    fortuneTab === 'wheel'
                      ? 'bg-[#3B66F5] text-white'
                      : `${mutedText} hover:text-current`
                  }`}
                >
                  Lucky Wheel
                </button>
                <button
                  disabled={spinning}
                  onClick={() => setFortuneTab('daily')}
                  className={`py-2 px-3 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                    fortuneTab === 'daily'
                      ? 'bg-[#3B66F5] text-white'
                      : `${mutedText} hover:text-current`
                  }`}
                >
                  Daily Bonus {canClaimDaily ? '· !' : ''}
                </button>
                <button
                  disabled={spinning}
                  onClick={() => setFortuneTab('prestige')}
                  className={`py-2 px-3 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                    fortuneTab === 'prestige'
                      ? 'bg-[#3B66F5] text-white'
                      : `${mutedText} hover:text-current`
                  }`}
                >
                  Cat Nirvana
                </button>
              </div>

              {fortuneTab === 'wheel' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="text-xs font-medium opacity-75">
                    Tickets: <span className="font-mono-num font-bold">{state.spinTickets}</span> ·
                    Catch Golden Mice on the board for free tickets!
                  </div>

                  {/* Wheel Visual */}
                  <div className="relative h-60 w-60 flex items-center justify-center">
                    <div
                      className="absolute -top-2.5 left-1/2 z-10 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-[#171B26] dark:border-t-white drop-shadow"
                    />
                    <div
                      className="h-56 w-56 rounded-full border-4 border-slate-900/20 shadow-lg relative overflow-hidden"
                      style={{
                        background: `conic-gradient(${conicStops})`,
                        transform: `rotate(${wheelAngle}deg)`,
                        transition: spinning
                          ? 'transform 2.85s cubic-bezier(0.12, 0.85, 0.2, 1)'
                          : 'none',
                      }}
                    >
                      {WHEEL_SECTORS.map((sec, idx) => {
                        const deg =
                          (idx * 360) / WHEEL_SECTORS.length +
                          180 / WHEEL_SECTORS.length;
                        return (
                          <div
                            key={sec.id}
                            className="absolute inset-0 flex justify-center pt-4 pointer-events-none"
                            style={{ transform: `rotate(${deg}deg)` }}
                          >
                            <span
                              className="text-[10px] font-extrabold tracking-tight text-center leading-tight max-w-[66px]"
                              style={{ color: sec.textColor }}
                            >
                              {sec.label}
                            </span>
                          </div>
                        );
                      })}
                      <div className="absolute top-1/2 left-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white border-2 border-slate-900/20 shadow flex items-center justify-center">
                        <RotateCw className="h-4 w-4 text-slate-800" />
                      </div>
                    </div>
                  </div>

                  {lastWonSector && (
                    <div className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-4 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      Prize Won: {lastWonSector.label}!
                    </div>
                  )}

                  {/* Spin Controls */}
                  <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
                    <button
                      disabled={spinning || state.spinTickets <= 0}
                      onClick={() => startWheelSpin('ticket')}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                        !spinning && state.spinTickets > 0
                          ? 'bg-[#3B66F5] text-white hover:bg-[#2E55DC]'
                          : 'bg-current/10 opacity-45 cursor-not-allowed'
                      }`}
                    >
                      <Ticket className="h-4 w-4" />
                      <span>Spin (1 Ticket)</span>
                    </button>

                    <button
                      disabled={spinning || state.gems < 15}
                      onClick={() => startWheelSpin('gems')}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                        !spinning && state.gems >= 15
                          ? 'bg-[#0FA968] text-white hover:bg-[#0C8E57]'
                          : 'bg-current/10 opacity-45 cursor-not-allowed'
                      }`}
                    >
                      <Gem className="h-4 w-4" />
                      <span>15 Gems</span>
                    </button>

                    <button
                      disabled={spinning}
                      onClick={onWatchAdForTicket}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-current/15 text-xs font-semibold hover:bg-current/5 transition-colors"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>+1 Ticket (Ad)</span>
                    </button>
                  </div>
                </div>
              )}

              {fortuneTab === 'daily' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {DAILY_REWARDS.map((item, idx) => {
                      const isDone = idx < state.streakDay;
                      const isCurrent = idx === state.streakDay;
                      return (
                        <div
                          key={item.day}
                          className={`rounded-lg border p-3 text-center flex flex-col items-center justify-between gap-2 ${
                            isCurrent && canClaimDaily
                              ? 'border-[#3B66F5] bg-[#3B66F5]/10'
                              : subSurface
                          } ${isDone ? 'opacity-55' : ''}`}
                        >
                          <div className={`text-[11px] font-bold ${mutedText}`}>
                            Day {item.day}
                          </div>
                          <Gift
                            className={`h-5 w-5 ${
                              isCurrent && canClaimDaily
                                ? 'text-[#3B66F5]'
                                : isDone
                                  ? 'text-emerald-500'
                                  : 'opacity-50'
                            }`}
                          />
                          <div className="text-xs font-bold leading-tight">{item.label}</div>
                          {isDone && (
                            <span className="text-[10px] font-semibold text-emerald-500">
                              Claimed
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <button
                    disabled={!canClaimDaily}
                    onClick={onClaimDaily}
                    className={`w-full py-3 rounded-lg text-sm font-bold transition-colors ${
                      canClaimDaily
                        ? 'bg-[#0FA968] text-white hover:bg-[#0C8E57]'
                        : 'bg-current/10 opacity-45 cursor-not-allowed'
                    }`}
                  >
                    {canClaimDaily
                      ? `Claim Day ${state.streakDay + 1} Reward`
                      : 'Today’s reward already claimed'}
                  </button>
                </div>
              )}

              {fortuneTab === 'prestige' && (
                <div className="space-y-4 text-center py-2">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
                    <Fish className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-base">
                      Cat Nirvana (Prestige)
                    </div>
                    <p className={`text-xs mt-1 max-w-md mx-auto ${mutedText}`}>
                      Reset your board and coins to earn Golden Fish. Every Golden Fish
                      permanently boosts all income by <strong className="text-current">+50%</strong>!
                      Gems, board themes, and spin tickets are kept.
                    </p>
                  </div>

                  <div className={`grid grid-cols-2 gap-3 rounded-lg border p-3.5 ${subSurface}`}>
                    <div>
                      <div className={`text-[11px] ${mutedText}`}>Current Fish</div>
                      <div className="font-mono-num font-bold text-lg">
                        {state.goldenFish} (+{state.goldenFish * 50}%)
                      </div>
                    </div>
                    <div>
                      <div className={`text-[11px] ${mutedText}`}>Claim Now</div>
                      <div className="font-mono-num font-bold text-lg text-amber-500">
                        +{pendingFish}
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={pendingFish <= 0}
                    onClick={onPrestige}
                    className={`w-full py-3 rounded-lg text-sm font-bold transition-colors ${
                      pendingFish > 0
                        ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                        : 'bg-current/10 opacity-45 cursor-not-allowed'
                    }`}
                  >
                    {pendingFish > 0
                      ? `Ascend (+${pendingFish} Golden Fish)`
                      : 'Unlock Tier 6 (Cyber Neko) for Cat Nirvana'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeModal === 'shop' && (
            <div className="space-y-4">
              {/* Segmented Tabs */}
              <div className={`grid grid-cols-3 gap-1 rounded-lg p-1 border ${subSurface}`}>
                <button
                  onClick={() => setShopTab('upgrades')}
                  className={`py-2 px-3 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                    shopTab === 'upgrades'
                      ? 'bg-[#3B66F5] text-white'
                      : `${mutedText} hover:text-current`
                  }`}
                >
                  Upgrades
                </button>
                <button
                  onClick={() => setShopTab('cats')}
                  className={`py-2 px-3 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                    shopTab === 'cats'
                      ? 'bg-[#3B66F5] text-white'
                      : `${mutedText} hover:text-current`
                  }`}
                >
                  Buy Cats
                </button>
                <button
                  onClick={() => setShopTab('vip')}
                  className={`py-2 px-3 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                    shopTab === 'vip'
                      ? 'bg-[#3B66F5] text-white'
                      : `${mutedText} hover:text-current`
                  }`}
                >
                  Themes & Packs
                </button>
              </div>

              {shopTab === 'upgrades' && (
                <div className="space-y-3">
                  {/* Spawn Level Upgrade */}
                  {(() => {
                    const cost = getUpgradeCost('spawnLevel', state.upgrades.spawnLevel);
                    const maxed = state.upgrades.spawnLevel >= 8;
                    const canAfford = state.coins >= cost.amount && !maxed;
                    return (
                      <div className={`flex items-center justify-between gap-4 rounded-lg border p-3.5 ${subSurface}`}>
                        <div>
                          <div className="font-semibold text-sm">Spawn Tier</div>
                          <div className={`text-xs mt-0.5 ${mutedText}`}>
                            Current: Tier {state.upgrades.spawnLevel} · New cats spawn stronger
                          </div>
                        </div>
                        <button
                          disabled={!canAfford}
                          onClick={() => onBuyUpgrade('spawnLevel')}
                          className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold font-mono-num transition-colors ${
                            canAfford
                              ? 'bg-[#3B66F5] text-white hover:bg-[#2E55DC]'
                              : 'bg-current/10 opacity-45 cursor-not-allowed'
                          }`}
                        >
                          {maxed ? 'MAX' : `${formatCoins(cost.amount)} C`}
                        </button>
                      </div>
                    );
                  })()}

                  {/* Global Income Multiplier */}
                  {(() => {
                    const cost = getUpgradeCost(
                      'incomeMultiplierLevel',
                      state.upgrades.incomeMultiplierLevel,
                    );
                    const canAfford = state.coins >= cost.amount;
                    const bonusPct = (state.upgrades.incomeMultiplierLevel - 1) * 25;
                    return (
                      <div className={`flex items-center justify-between gap-4 rounded-lg border p-3.5 ${subSurface}`}>
                        <div>
                          <div className="font-semibold text-sm">Income Multiplier (+25%)</div>
                          <div className={`text-xs mt-0.5 ${mutedText}`}>
                            Lv. {state.upgrades.incomeMultiplierLevel} · Current bonus +{bonusPct}%
                          </div>
                        </div>
                        <button
                          disabled={!canAfford}
                          onClick={() => onBuyUpgrade('incomeMultiplierLevel')}
                          className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold font-mono-num transition-colors ${
                            canAfford
                              ? 'bg-[#3B66F5] text-white hover:bg-[#2E55DC]'
                              : 'bg-current/10 opacity-45 cursor-not-allowed'
                          }`}
                        >
                          {formatCoins(cost.amount)} C
                        </button>
                      </div>
                    );
                  })()}

                  {/* Crate Speed */}
                  {(() => {
                    const cost = getUpgradeCost(
                      'crateSpeedLevel',
                      state.upgrades.crateSpeedLevel,
                    );
                    const maxed = state.upgrades.crateSpeedLevel >= 6;
                    const canAfford = state.gems >= cost.amount && !maxed;
                    const interval = Math.max(4, 11 - state.upgrades.crateSpeedLevel);
                    return (
                      <div className={`flex items-center justify-between gap-4 rounded-lg border p-3.5 ${subSurface}`}>
                        <div>
                          <div className="font-semibold text-sm">Crate Delivery Speed</div>
                          <div className={`text-xs mt-0.5 ${mutedText}`}>
                            Free crate drops every {interval} sec
                          </div>
                        </div>
                        <button
                          disabled={!canAfford}
                          onClick={() => onBuyUpgrade('crateSpeedLevel')}
                          className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold font-mono-num transition-colors ${
                            canAfford
                              ? 'bg-[#0FA968] text-white hover:bg-[#0C8E57]'
                              : 'bg-current/10 opacity-45 cursor-not-allowed'
                          }`}
                        >
                          {maxed ? (
                            'MAX'
                          ) : (
                            <>
                              <Gem className="h-3.5 w-3.5" />
                              {cost.amount}
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}

              {shopTab === 'cats' && (
                <div className="space-y-2.5">
                  {state.flashSaleUntil > Date.now() && (
                    <div className="rounded-lg border border-emerald-500/35 bg-emerald-500/12 px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-300">
                      Lucky Coupon Active: -30% off all cat purchases right now!
                    </div>
                  )}
                  {CAT_TIERS.filter((t) => t.level <= state.highestUnlockedLevel).map(
                    (tier) => {
                      const flashSaleOn = state.flashSaleUntil > Date.now();
                      const bought = state.purchasesPerLevel[tier.level] || 0;
                      const price = getCatPurchasePrice(tier.level, bought, flashSaleOn);
                      const canBuy =
                        state.coins >= price && state.board.some((slot) => slot === null);

                      return (
                        <div
                          key={tier.level}
                          className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${subSurface}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className="h-9 w-9 shrink-0 rounded-lg border border-black/15"
                              style={{ backgroundColor: tier.bodyColor }}
                            />
                            <div className="min-w-0">
                              <div className="font-semibold text-sm truncate">
                                Tier {tier.level} · {tier.name}
                              </div>
                              <div className={`text-xs font-mono-num ${mutedText}`}>
                                +{formatCoins(tier.incomePerSec)}/sec
                              </div>
                            </div>
                          </div>
                          <button
                            disabled={!canBuy}
                            onClick={() => onBuyCatLevel(tier.level)}
                            className={`shrink-0 px-3.5 py-2 rounded-lg text-xs font-bold font-mono-num transition-colors ${
                              canBuy
                                ? flashSaleOn
                                  ? 'bg-[#0FA968] text-white hover:bg-[#0C8E57]'
                                  : 'bg-[#3B66F5] text-white hover:bg-[#2E55DC]'
                                : 'bg-current/10 opacity-45 cursor-not-allowed'
                            }`}
                          >
                            {formatCoins(price)} C{flashSaleOn ? ' -30%' : ''}
                          </button>
                        </div>
                      );
                    },
                  )}
                </div>
              )}

              {shopTab === 'vip' && (
                <div className="space-y-4">
                  {/* Starter VIP Pack (Unlocked with Gems) */}
                  <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-display font-bold text-sm text-amber-600 dark:text-amber-400">
                        PS2 VIP Starter Bundle
                      </div>
                      <div className={`text-xs mt-1 ${mutedText}`}>
                        5 Auto-Merges · 3 Spin Tickets · 25,000 Coins
                      </div>
                    </div>
                    <button
                      disabled={state.vipPackOwned || state.gems < 80}
                      onClick={onBuyVipPack}
                      className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                        state.vipPackOwned
                          ? 'bg-current/15 opacity-60 cursor-default'
                          : state.gems >= 80
                            ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                            : 'bg-current/10 opacity-45 cursor-not-allowed'
                      }`}
                    >
                      {state.vipPackOwned ? (
                        'Owned'
                      ) : (
                        <>
                          <Gem className="h-3.5 w-3.5" />
                          <span>80</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Rewarded Ad Free Gem Pouch */}
                  <div className={`rounded-lg border p-3.5 flex items-center justify-between gap-3 ${subSurface}`}>
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-sm">
                        <Gem className="h-4 w-4 text-emerald-500" />
                        <span>Free Gem Pouch (+35 Gems)</span>
                      </div>
                      <div className={`text-xs mt-0.5 ${mutedText}`}>
                        Watch a short rewarded video to claim instant Gems
                      </div>
                    </div>
                    <button
                      onClick={onWatchAdForGems}
                      className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0FA968] text-white text-xs font-bold hover:bg-[#0C8E57] transition-colors whitespace-nowrap"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>+35 Gems (Ad)</span>
                    </button>
                  </div>

                  {/* Board Themes */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wider opacity-60">
                      3D Board Theme
                    </div>
                    <div className="space-y-2">
                      {BOARD_THEMES.map((theme) => {
                        const isActive = state.themeId === theme.id;
                        const canBuy = theme.priceGems === 0 || state.gems >= theme.priceGems;
                        return (
                          <div
                            key={theme.id}
                            className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${subSurface}`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className="h-7 w-7 rounded-md border border-black/20"
                                style={{ backgroundColor: theme.bgHex }}
                              />
                              <span className="text-sm font-semibold">{theme.name}</span>
                            </div>
                            <button
                              disabled={isActive || !canBuy}
                              onClick={() => onBuyTheme(theme.id)}
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                isActive
                                  ? 'bg-[#3B66F5]/20 text-[#3B66F5]'
                                  : canBuy
                                    ? 'bg-[#3B66F5] text-white hover:bg-[#2E55DC]'
                                    : 'bg-current/10 opacity-45 cursor-not-allowed'
                              }`}
                            >
                              {isActive
                                ? 'Active'
                                : theme.priceGems === 0
                                  ? 'Select'
                                  : `${theme.priceGems} G`}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeModal === 'catalog' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CAT_TIERS.map((tier) => {
                const unlocked = tier.level <= state.highestUnlockedLevel;
                const claimed = state.discoveredRewardsClaimed.includes(tier.level);
                return (
                  <div
                    key={tier.level}
                    className={`rounded-lg border p-3.5 flex items-center justify-between gap-3 ${subSurface} ${
                      unlocked ? '' : 'opacity-55'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="h-10 w-10 shrink-0 rounded-lg border border-black/15 flex items-center justify-center font-display font-bold text-xs text-slate-900"
                        style={{ backgroundColor: unlocked ? tier.bodyColor : '#94A3B8' }}
                      >
                        {tier.level}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">
                          {unlocked ? tier.name : 'Undiscovered Cat'}
                        </div>
                        <div className={`text-xs truncate ${mutedText}`}>
                          {unlocked
                            ? `${tier.title} · +${formatCoins(tier.incomePerSec)}/s`
                            : 'Merge cats to unlock'}
                        </div>
                      </div>
                    </div>
                    {unlocked && !claimed && (
                      <button
                        onClick={() => onClaimDiscovery(tier.level)}
                        className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0FA968] text-white text-xs font-bold hover:bg-[#0C8E57] transition-colors"
                      >
                        <Gem className="h-3.5 w-3.5" />
                        +{tier.level * 5}
                      </button>
                    )}
                    {unlocked && claimed && (
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeModal === 'missions' && (
            <div className="space-y-4">
              {/* Segmented Tabs: Daily Missions vs Achievements */}
              <div className={`grid grid-cols-2 gap-1 rounded-lg p-1 border ${subSurface}`}>
                <button
                  onClick={() => setMissionsTab('daily')}
                  className={`py-2 px-3 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                    missionsTab === 'daily'
                      ? 'bg-[#3B66F5] text-white'
                      : `${mutedText} hover:text-current`
                  }`}
                >
                  Daily Missions
                </button>
                <button
                  onClick={() => setMissionsTab('achievements')}
                  className={`py-2 px-3 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                    missionsTab === 'achievements'
                      ? 'bg-[#3B66F5] text-white'
                      : `${mutedText} hover:text-current`
                  }`}
                >
                  Achievements
                </button>
              </div>

              {missionsTab === 'daily' && (() => {
                const completedCount = DAILY_MISSIONS.filter((dm) => {
                  const p = state.dailyProgress[dm.type] || 0;
                  return p >= dm.target;
                }).length;
                const chestReady =
                  completedCount >= DAILY_MISSIONS.length && !state.dailyChestClaimed;

                return (
                  <div className="space-y-3">
                    {/* Grand Daily Bonus Chest */}
                    <div className="rounded-xl border border-amber-500/40 bg-amber-500/12 p-3.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-display font-bold text-sm flex items-center gap-1.5 text-amber-600 dark:text-amber-300">
                          <Gift className="h-4 w-4 shrink-0" />
                          <span>Daily Chest ({completedCount}/{DAILY_MISSIONS.length})</span>
                        </div>
                        <div className={`text-xs mt-0.5 ${mutedText}`}>
                          Complete all daily tasks: +60 Gems & +1 Lucky Ticket
                        </div>
                      </div>
                      <button
                        disabled={!chestReady}
                        onClick={onClaimDailyChest}
                        className={`shrink-0 px-3.5 py-2 rounded-lg text-xs font-bold transition-all active:scale-[0.97] whitespace-nowrap ${
                          state.dailyChestClaimed
                            ? 'bg-current/10 opacity-50'
                            : chestReady
                              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                              : 'bg-current/10 opacity-45 cursor-not-allowed'
                        }`}
                      >
                        {state.dailyChestClaimed
                          ? 'Opened'
                          : chestReady
                            ? 'Claim!'
                            : `${completedCount}/${DAILY_MISSIONS.length}`}
                      </button>
                    </div>

                    {DAILY_MISSIONS.map((dm) => {
                      const progress = state.dailyProgress[dm.type] || 0;
                      const pct = Math.min(100, Math.round((progress / dm.target) * 100));
                      const claimed = state.dailyClaimedIds.includes(dm.id);
                      const ready = progress >= dm.target && !claimed;

                      return (
                        <div
                          key={dm.id}
                          className={`rounded-lg border p-3.5 flex items-center justify-between gap-4 ${subSurface}`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm">{dm.title}</div>
                            <div className="mt-2 h-2 w-full rounded-full bg-current/10 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  ready ? 'bg-[#0FA968]' : 'bg-[#3B66F5]'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <div className={`text-xs font-mono-num mt-1 ${mutedText}`}>
                              {Math.min(progress, dm.target)} / {dm.target}
                            </div>
                          </div>
                          <button
                            disabled={!ready}
                            onClick={() => onClaimDailyMission(dm.id)}
                            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all active:scale-[0.97] ${
                              claimed
                                ? 'bg-current/10 opacity-50'
                                : ready
                                  ? 'bg-[#0FA968] text-white hover:bg-[#0C8E57]'
                                  : 'bg-current/10 opacity-45 cursor-not-allowed'
                            }`}
                          >
                            <Gem className="h-3.5 w-3.5" />
                            {claimed
                              ? 'Claimed'
                              : `+${dm.rewardGems}${dm.rewardTickets ? ` · +${dm.rewardTickets}T` : ''}`}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {missionsTab === 'achievements' && (
                <div className="space-y-3">
                  {MISSIONS.map((m) => {
                    const progress =
                      m.type === 'merges'
                        ? state.totalMerges
                        : m.type === 'maxLevel'
                          ? state.highestUnlockedLevel
                          : m.type === 'taps'
                            ? state.totalTaps
                            : m.type === 'mice'
                              ? state.totalMiceCaught
                              : state.totalCratesOpened;
                    const pct = Math.min(100, Math.round((progress / m.target) * 100));
                    const claimed = state.claimedMissions.includes(m.id);
                    const ready = progress >= m.target && !claimed;

                    return (
                      <div
                        key={m.id}
                        className={`rounded-lg border p-3.5 flex items-center justify-between gap-4 ${subSurface}`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">{m.title}</div>
                          <div className="mt-2 h-2 w-full rounded-full bg-current/10 overflow-hidden">
                            <div
                              className="h-full bg-[#3B66F5] transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className={`text-xs font-mono-num mt-1 ${mutedText}`}>
                            {Math.min(progress, m.target)} / {m.target}
                          </div>
                        </div>
                        <button
                          disabled={!ready}
                          onClick={() => onClaimMission(m.id)}
                          className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all active:scale-[0.97] ${
                            claimed
                              ? 'bg-current/10 opacity-50'
                              : ready
                                ? 'bg-[#0FA968] text-white hover:bg-[#0C8E57]'
                                : 'bg-current/10 opacity-45 cursor-not-allowed'
                          }`}
                        >
                          <Gem className="h-3.5 w-3.5" />
                          {claimed ? 'Claimed' : `+${m.rewardGems}`}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeModal === 'offline' && (
            <div className="text-center space-y-5 py-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
                <Coins className="h-7 w-7" />
              </div>
              <div>
                <div className={`text-sm ${mutedText}`}>
                  While you were away, your 3D cats earned:
                </div>
                <div className="font-display font-extrabold text-3xl font-mono-num mt-1.5">
                  +{formatCoins(offlineCoins)}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onClaimOffline(false)}
                  className="flex-1 py-3 px-4 rounded-lg border border-current/15 font-semibold text-sm hover:bg-current/5 transition-colors"
                >
                  Collect
                </button>
                <button
                  onClick={() => onClaimOffline(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#0FA968] text-white font-bold text-sm hover:bg-[#0C8E57] transition-colors"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Claim 2x (Watch Ad)
                </button>
              </div>
            </div>
          )}

          {activeModal === 'ad' && adOffer && (
            <div className="text-center space-y-5 py-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3B66F5]/15 text-[#3B66F5]">
                {adOffer.id === 'double_income' ? (
                  <TrendingUp className="h-8 w-8" />
                ) : adOffer.id === 'auto_merge' ? (
                  <Zap className="h-8 w-8" />
                ) : adOffer.id === 'crate_frenzy' ? (
                  <Gift className="h-8 w-8" />
                ) : (
                  <Sparkles className="h-8 w-8" />
                )}
              </div>
              <div>
                <div className="font-display font-bold text-base">{adOffer.rewardLabel}</div>
                <p className={`text-sm mt-1 ${mutedText}`}>{adOffer.description}</p>
                <div className="mt-2 inline-flex items-center gap-1 rounded-lg bg-emerald-500/12 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <Gem className="h-3.5 w-3.5" />
                  <span>Bonus Reward: +5 Gems</span>
                </div>
              </div>
              <div className={`rounded-lg border p-3 text-xs font-mono-num ${subSurface}`}>
                {adSecondsLeft > 0
                  ? `Rewarded preview finishing in ${adSecondsLeft}s...`
                  : 'Reward ready to claim!'}
              </div>
              <button
                disabled={adSecondsLeft > 0}
                onClick={onCompleteAd}
                className={`w-full py-3 px-4 rounded-lg font-bold text-sm transition-colors ${
                  adSecondsLeft > 0
                    ? 'bg-current/10 opacity-50 cursor-not-allowed'
                    : 'bg-[#0FA968] text-white hover:bg-[#0C8E57]'
                }`}
              >
                {adSecondsLeft > 0 ? `Please wait (${adSecondsLeft}s)` : 'Claim Reward (+5 G)'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

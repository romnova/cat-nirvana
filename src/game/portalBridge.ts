// CrazyGames SDK v3 Bridge with safe local/standalone fallback
// Handles init(), gameplayStart(), gameplayStop(), happytime(), and requestAd('midgame' | 'rewarded').

export interface CrazyGamesAdCallbacks {
  adStarted?: () => void;
  adFinished?: () => void;
  adError?: (error?: unknown) => void;
}

export interface CrazyGamesSdkV3 {
  init?: () => Promise<void>;
  game?: {
    gameplayStart?: () => void;
    gameplayStop?: () => void;
    happytime?: () => void;
  };
  ad?: {
    requestAd?: (
      type: 'midgame' | 'rewarded',
      callbacks: CrazyGamesAdCallbacks,
    ) => Promise<void> | void;
  };
}

declare global {
  interface Window {
    CrazyGames?: {
      SDK?: CrazyGamesSdkV3;
    };
  }
}

let crazyReady = false;
let crazyInitPromise: Promise<boolean> | null = null;
let gameplayActive = false;
const memoryStorage = new Map<string, string>();

export function safeLoadStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return memoryStorage.get(key) ?? null;
  }
}

export function safeSaveStorage(key: string, value: string): void {
  memoryStorage.set(key, value);
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore restricted iframe storage errors
  }
}

export async function initCrazyGamesSdk(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (crazyReady) return true;
  if (crazyInitPromise) return crazyInitPromise;

  crazyInitPromise = (async () => {
    try {
      const sdk = window.CrazyGames?.SDK;
      if (!sdk) return false;
      if (typeof sdk.init === 'function') {
        await sdk.init();
      }
      crazyReady = true;
      return true;
    } catch {
      crazyReady = false;
      return false;
    }
  })();

  return crazyInitPromise;
}

export function notifyGameplayStart(): void {
  if (gameplayActive) return;
  gameplayActive = true;
  try {
    if (crazyReady) {
      window.CrazyGames?.SDK?.game?.gameplayStart?.();
    }
  } catch {
    // Safe fallback when SDK is unavailable locally
  }
}

export function notifyGameplayStop(): void {
  if (!gameplayActive) return;
  gameplayActive = false;
  try {
    if (crazyReady) {
      window.CrazyGames?.SDK?.game?.gameplayStop?.();
    }
  } catch {
    // Safe fallback when SDK is unavailable locally
  }
}

export function notifyHappyTime(): void {
  try {
    if (crazyReady) {
      window.CrazyGames?.SDK?.game?.happytime?.();
    }
  } catch {
    // Safe fallback when SDK is unavailable locally
  }
}

export async function showCrazyMidgameAd(
  onPauseChange: (paused: boolean) => void,
): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  const requestAd = window.CrazyGames?.SDK?.ad?.requestAd;
  if (!crazyReady || !requestAd) {
    return false;
  }

  return new Promise<boolean>((resolve) => {
    let settled = false;
    const finish = (shown: boolean) => {
      if (settled) return;
      settled = true;
      onPauseChange(false);
      notifyGameplayStart();
      resolve(shown);
    };

    try {
      const maybePromise = requestAd('midgame', {
        adStarted: () => {
          onPauseChange(true);
          notifyGameplayStop();
        },
        adFinished: () => {
          finish(true);
        },
        adError: () => {
          finish(false);
        },
      });
      if (maybePromise && typeof (maybePromise as Promise<void>).catch === 'function') {
        (maybePromise as Promise<void>).catch(() => {
          finish(false);
        });
      }
    } catch {
      finish(false);
    }
  });
}

export async function showCrazyRewardedAd(
  onPauseChange: (paused: boolean) => void,
  onRewarded: () => void,
): Promise<'rewarded' | 'unavailable'> {
  if (typeof window === 'undefined') return 'unavailable';
  const requestAd = window.CrazyGames?.SDK?.ad?.requestAd;
  if (!crazyReady || !requestAd) {
    return 'unavailable';
  }

  return new Promise<'rewarded' | 'unavailable'>((resolve) => {
    let settled = false;
    const finish = (result: 'rewarded' | 'unavailable') => {
      if (settled) return;
      settled = true;
      onPauseChange(false);
      notifyGameplayStart();
      resolve(result);
    };

    try {
      const maybePromise = requestAd('rewarded', {
        adStarted: () => {
          onPauseChange(true);
          notifyGameplayStop();
        },
        adFinished: () => {
          onRewarded();
          finish('rewarded');
        },
        adError: () => {
          finish('unavailable');
        },
      });
      if (maybePromise && typeof (maybePromise as Promise<void>).catch === 'function') {
        (maybePromise as Promise<void>).catch(() => {
          finish('unavailable');
        });
      }
    } catch {
      finish('unavailable');
    }
  });
}

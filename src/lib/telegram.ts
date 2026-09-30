// The subset of the Telegram WebApp API this app uses.
interface TelegramWebApp {
  ready(): void;
  expand(): void;
  isVersionAtLeast(version: string): boolean;
  setHeaderColor(color: string): void;
  setBackgroundColor(color: string): void;
  initDataUnsafe?: { user?: { language_code?: string } };
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

/** The user's Telegram interface language (e.g. "ru"), or undefined outside Telegram. Read only, never stored. */
export function telegramLanguage(): string | undefined {
  return window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code;
}

/**
 * Tell Telegram the app is ready and open it at full height.
 * Does nothing in a normal browser. Theme colours need no code here:
 * telegram-web-app.js exposes them as --tg-theme-* CSS variables and keeps
 * them updated when the user switches theme.
 */
export function initTelegram(): void {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;
  try {
    tg.ready();
    tg.expand();
    if (tg.isVersionAtLeast('6.1')) {
      tg.setHeaderColor('secondary_bg_color');
      tg.setBackgroundColor('secondary_bg_color');
    }
  } catch {
    // Older clients may lack some methods; the app works without them.
  }
}

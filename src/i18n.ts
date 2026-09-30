import { DEFAULT_LANGUAGE } from './config';
import { telegramLanguage } from './lib/telegram';

export type Language = 'en' | 'ru' | 'ro';

interface Strings {
  title: string;
  totalDonations: string;
  allTime: string;
  month: string;
  previousMonth: string;
  nextMonth: string;
  backToCurrentMonth: string;
  /** Receives the month name in lower case, e.g. "september". */
  monthDonations: (monthName: string) => string;
  noDonations: string;
  noDonors: string;
  expenses: string;
  noExpenses: string;
  totalExpenses: string;
  archive: string;
  loading: string;
  errorTitle: string;
  errorText: string;
  retry: string;
  notConfiguredTitle: string;
  notConfiguredText: string;
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const strings: Record<Language, Strings> = {
  en: {
    title: 'Donation statistics',
    totalDonations: 'Total donations',
    allTime: 'All time',
    month: 'Month',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    backToCurrentMonth: 'Back to current month',
    monthDonations: (monthName) => `${capitalize(monthName)} donations`,
    noDonations: 'No donations this month',
    noDonors: 'No donors yet',
    expenses: 'Expenses',
    noExpenses: 'No expenses this month',
    totalExpenses: 'Total expenses',
    archive: 'Archive',
    loading: 'Loading',
    errorTitle: "Couldn't load the statistics",
    errorText: 'Check your internet connection and try again.',
    retry: 'Try again',
    notConfiguredTitle: 'App is not configured',
    notConfiguredText: 'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are missing. See the README.',
  },
  ru: {
    title: 'Статистика пожертвований',
    totalDonations: 'Всего пожертвований',
    allTime: 'За всё время',
    month: 'Месяц',
    previousMonth: 'Предыдущий месяц',
    nextMonth: 'Следующий месяц',
    backToCurrentMonth: 'К текущему месяцу',
    monthDonations: (monthName) => `Пожертвования за ${monthName}`,
    noDonations: 'В этом месяце пожертвований нет',
    noDonors: 'Список доноров пуст',
    expenses: 'Расходы',
    noExpenses: 'В этом месяце расходов нет',
    totalExpenses: 'Всего расходов',
    archive: 'Архив',
    loading: 'Загрузка',
    errorTitle: 'Не удалось загрузить статистику',
    errorText: 'Проверьте подключение к интернету и попробуйте ещё раз.',
    retry: 'Повторить',
    notConfiguredTitle: 'Приложение не настроено',
    notConfiguredText: 'Не заданы VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY. См. README.',
  },
  ro: {
    title: 'Statistica donațiilor',
    totalDonations: 'Total donații',
    allTime: 'Din toate timpurile',
    month: 'Luna',
    previousMonth: 'Luna precedentă',
    nextMonth: 'Luna următoare',
    backToCurrentMonth: 'Înapoi la luna curentă',
    monthDonations: (monthName) => `Donații în ${monthName}`,
    noDonations: 'Nicio donație în această lună',
    noDonors: 'Încă nu există donatori',
    expenses: 'Cheltuieli',
    noExpenses: 'Nicio cheltuială în această lună',
    totalExpenses: 'Total cheltuieli',
    archive: 'Arhivă',
    loading: 'Se încarcă',
    errorTitle: 'Statisticile nu au putut fi încărcate',
    errorText: 'Verificați conexiunea la internet și încercați din nou.',
    retry: 'Încearcă din nou',
    notConfiguredTitle: 'Aplicația nu este configurată',
    notConfiguredText: 'Lipsesc VITE_SUPABASE_URL și VITE_SUPABASE_ANON_KEY. Vezi README.',
  },
};

const locales: Record<Language, string> = { en: 'en-US', ru: 'ru-RU', ro: 'ro-RO' };

/** "ru-RU" -> "ru"; undefined for languages the app has no translation for. */
function toLanguage(code: string | null | undefined): Language | undefined {
  const base = code?.toLowerCase().split(/[-_]/)[0];
  if (base === 'mo') return 'ro';
  return base === 'en' || base === 'ru' || base === 'ro' ? base : undefined;
}

// Order: explicit ?lang= in the URL, the user's Telegram interface language,
// the browser language, then the configured default.
function detectLanguage(): Language {
  return (
    toLanguage(new URLSearchParams(window.location.search).get('lang')) ??
    toLanguage(telegramLanguage()) ??
    toLanguage(navigator.language) ??
    DEFAULT_LANGUAGE
  );
}

// Chosen once per launch; Telegram reopens the app when it is launched again.
export const language = detectLanguage();
/** Locale for number grouping and month names. */
export const locale = locales[language];
/** Interface strings in the current language. */
export const t = strings[language];

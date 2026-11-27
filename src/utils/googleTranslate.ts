import { GoogleLanguageOption, Language } from '../types';

export const GOOGLE_WORLD_LANGUAGES: GoogleLanguageOption[] = [
  { code: 'en', coreCode: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', region: 'Global / US / UK', direction: 'ltr', isPopular: true },
  { code: 'ur', coreCode: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', region: 'Pakistan / South Asia', direction: 'rtl', isPopular: true },
  { code: 'ar', coreCode: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪', region: 'Middle East & North Africa', direction: 'rtl', isPopular: true },
  { code: 'fa', coreCode: 'fa', name: 'Persian (Farsi)', nativeName: 'فارسی', flag: '🇮🇷', region: 'Iran & Central Asia', direction: 'rtl', isPopular: true },
  { code: 'ps', coreCode: 'ps', name: 'Pashto', nativeName: 'پښتو', flag: '🇦🇫', region: 'Afghanistan & Pakistan', direction: 'rtl', isPopular: true },
  { code: 'hi', coreCode: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'India / South Asia', direction: 'ltr', isPopular: true },
  { code: 'es', coreCode: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Spain & Latin America', direction: 'ltr', isPopular: true },
  { code: 'fr', coreCode: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'France & Francophone', direction: 'ltr', isPopular: true },
  { code: 'de', coreCode: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Germany / Austria / Swiss', direction: 'ltr', isPopular: true },
  { code: 'tr', coreCode: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', region: 'Turkey & Eurasia', direction: 'ltr', isPopular: true },
  { code: 'zh-CN', coreCode: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', region: 'China / Singapore', direction: 'ltr', isPopular: true },
  { code: 'zh-TW', coreCode: 'zh', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼', region: 'Taiwan / Hong Kong', direction: 'ltr', isPopular: false },
  { code: 'ru', coreCode: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', region: 'Eastern Europe & CIS', direction: 'ltr', isPopular: true },
  { code: 'pt', coreCode: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', region: 'Brazil & Portugal', direction: 'ltr', isPopular: true },
  { code: 'ms', coreCode: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', region: 'Malaysia & Brunei', direction: 'ltr', isPopular: false },
  { code: 'id', coreCode: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', region: 'Indonesia', direction: 'ltr', isPopular: false },
  { code: 'ja', coreCode: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'Japan', direction: 'ltr', isPopular: false },
  { code: 'ko', coreCode: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', region: 'South Korea', direction: 'ltr', isPopular: false },
  { code: 'it', coreCode: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', region: 'Italy & Switzerland', direction: 'ltr', isPopular: false },
  { code: 'vi', coreCode: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', region: 'Vietnam', direction: 'ltr', isPopular: false },
  { code: 'bn', coreCode: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', region: 'Bangladesh & India', direction: 'ltr', isPopular: false },
  { code: 'th', coreCode: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', region: 'Thailand', direction: 'ltr', isPopular: false },
  { code: 'pl', coreCode: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', region: 'Poland', direction: 'ltr', isPopular: false },
  { code: 'nl', coreCode: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', region: 'Netherlands & Belgium', direction: 'ltr', isPopular: false },
  { code: 'tl', coreCode: 'tl', name: 'Filipino / Tagalog', nativeName: 'Tagalog', flag: '🇵🇭', region: 'Philippines', direction: 'ltr', isPopular: false },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ / پنجابی', flag: '🇮🇳', region: 'India & Pakistan', direction: 'ltr' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', flag: '🇵🇰', region: 'Pakistan', direction: 'rtl' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', region: 'Ukraine', direction: 'ltr' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', region: 'Greece & Cyprus', direction: 'ltr' },
  { code: 'iw', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', region: 'Israel', direction: 'rtl' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', region: 'Sweden', direction: 'ltr' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', region: 'Norway', direction: 'ltr' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', region: 'Denmark', direction: 'ltr' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', region: 'Finland', direction: 'ltr' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', region: 'Czechia', direction: 'ltr' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', region: 'Romania & Moldova', direction: 'ltr' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', region: 'Hungary', direction: 'ltr' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬', region: 'Bulgaria', direction: 'ltr' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸', region: 'Serbia', direction: 'ltr' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷', region: 'Croatia', direction: 'ltr' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰', region: 'Slovakia', direction: 'ltr' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮', region: 'Slovenia', direction: 'ltr' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹', region: 'Lithuania', direction: 'ltr' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻', region: 'Latvia', direction: 'ltr' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪', region: 'Estonia', direction: 'ltr' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿', region: 'Azerbaijan', direction: 'ltr' },
  { code: 'uz', name: 'Uzbek', nativeName: "O'zbek", flag: '🇺🇿', region: 'Uzbekistan', direction: 'ltr' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ тілі', flag: '🇰🇿', region: 'Kazakhstan', direction: 'ltr' },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча', flag: '🇰🇬', region: 'Kyrgyzstan', direction: 'ltr' },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ', flag: '🇹🇯', region: 'Tajikistan', direction: 'ltr' },
  { code: 'tk', name: 'Turkmen', nativeName: 'Türkmençe', flag: '🇹🇲', region: 'Turkmenistan', direction: 'ltr' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', flag: '🇬🇪', region: 'Georgia', direction: 'ltr' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', flag: '🇦🇲', region: 'Armenia', direction: 'ltr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', region: 'India & Sri Lanka', direction: 'ltr' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', region: 'India', direction: 'ltr' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', region: 'India', direction: 'ltr' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', region: 'India', direction: 'ltr' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', region: 'India', direction: 'ltr' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', region: 'India', direction: 'ltr' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵', region: 'Nepal', direction: 'ltr' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰', region: 'Sri Lanka', direction: 'ltr' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ', flag: '🇲🇲', region: 'Myanmar', direction: 'ltr' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ', flag: '🇰🇭', region: 'Cambodia', direction: 'ltr' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ', flag: '🇱🇦', region: 'Laos', direction: 'ltr' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол', flag: '🇲🇳', region: 'Mongolia', direction: 'ltr' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', region: 'East Africa', direction: 'ltr' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', region: 'Ethiopia', direction: 'ltr' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali', flag: '🇸🇴', region: 'Somalia', direction: 'ltr' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬', region: 'West Africa', direction: 'ltr' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬', region: 'Nigeria', direction: 'ltr' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', flag: '🇳🇬', region: 'Nigeria', direction: 'ltr' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦', region: 'South Africa', direction: 'ltr' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦', region: 'South Africa', direction: 'ltr' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', flag: '🇦🇱', region: 'Albania & Kosovo', direction: 'ltr' },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', flag: '🇧🇦', region: 'Bosnia', direction: 'ltr' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', flag: '🇲🇰', region: 'North Macedonia', direction: 'ltr' },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская', flag: '🇧🇾', region: 'Belarus', direction: 'ltr' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', flag: '🇪🇸', region: 'Catalonia & Andorra', direction: 'ltr' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskara', flag: '🇪🇸', region: 'Basque Country', direction: 'ltr' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', flag: '🇪🇸', region: 'Galicia', direction: 'ltr' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', region: 'Wales', direction: 'ltr' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', flag: '🇮🇪', region: 'Ireland', direction: 'ltr' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', flag: '🇮🇸', region: 'Iceland', direction: 'ltr' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', flag: '🇲🇹', region: 'Malta', direction: 'ltr' },
  { code: 'lb', name: 'Luxembourgish', nativeName: 'Lëtzebuergesch', flag: '🇱🇺', region: 'Luxembourg', direction: 'ltr' },
  { code: 'ku', name: 'Kurdish (Kurmanji)', nativeName: 'Kurdî', flag: '🇮🇶', region: 'Middle East', direction: 'ltr' },
  { code: 'ckb', name: 'Kurdish (Sorani)', nativeName: 'کوردی', flag: '🇮🇶', region: 'Middle East', direction: 'rtl' },
  { code: 'ug', name: 'Uyghur', nativeName: 'ئۇيغۇرچە', flag: '🇨🇳', region: 'Central Asia', direction: 'rtl' },
  { code: 'dv', name: 'Dhivehi', nativeName: 'ދިވެހި', flag: '🇲🇻', region: 'Maldives', direction: 'rtl' },
  { code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש', flag: '🌍', region: 'Global', direction: 'rtl' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', region: 'India', direction: 'ltr' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳', region: 'India', direction: 'ltr' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', flag: '🇮🇳', region: 'India & Nepal', direction: 'ltr' },
  { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी', flag: '🇮🇳', region: 'India', direction: 'ltr' },
  { code: 'jv', name: 'Javanese', nativeName: 'Basa Jawa', flag: '🇮🇩', region: 'Indonesia', direction: 'ltr' },
  { code: 'su', name: 'Sundanese', nativeName: 'Basa Sunda', flag: '🇮🇩', region: 'Indonesia', direction: 'ltr' },
  { code: 'ceb', name: 'Cebuano', nativeName: 'Bisaya', flag: '🇵🇭', region: 'Philippines', direction: 'ltr' },
  { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy', flag: '🇲🇬', region: 'Madagascar', direction: 'ltr' },
  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda', flag: '🇷🇼', region: 'Rwanda', direction: 'ltr' },
  { code: 'sn', name: 'Shona', nativeName: 'chiShona', flag: '🇿🇼', region: 'Zimbabwe', direction: 'ltr' },
  { code: 'st', name: 'Sesotho', nativeName: 'Sesotho', flag: '🇱🇸', region: 'Southern Africa', direction: 'ltr' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', flag: '🇿🇦', region: 'South Africa', direction: 'ltr' },
  { code: 'ny', name: 'Chichewa', nativeName: 'Chichewa', flag: '🇲🇼', region: 'Malawi', direction: 'ltr' },
  { code: 'ht', name: 'Haitian Creole', nativeName: 'Kreyòl Ayisyen', flag: '🇭🇹', region: 'Haiti', direction: 'ltr' },
  { code: 'mi', name: 'Maori', nativeName: 'Māori', flag: '🇳🇿', region: 'New Zealand', direction: 'ltr' },
  { code: 'sm', name: 'Samoan', nativeName: 'Gagana Sāmoa', flag: '🇼🇸', region: 'Samoa', direction: 'ltr' },
  { code: 'haw', name: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi', flag: '🇺🇸', region: 'Hawaii', direction: 'ltr' },
  { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto', flag: '🌍', region: 'International', direction: 'ltr' }
];

const RTL_CODES = new Set(['ur', 'ar', 'fa', 'ps', 'he', 'iw', 'sd', 'ug', 'yi', 'ckb', 'dv']);

export const GOOGLE_LANG_STORAGE_KEY = 'tradevortex_google_lang';

export function isRtlLanguageCode(code: string): boolean {
  return RTL_CODES.has(code);
}

export function resolveCoreLanguage(code: string): Language {
  const found = GOOGLE_WORLD_LANGUAGES.find((l) => l.code === code);
  if (found?.coreCode) return found.coreCode;
  const direct = GOOGLE_WORLD_LANGUAGES.find((l) => l.coreCode === (code as Language));
  return direct?.coreCode || 'en';
}

export function getGoogleLanguageOption(code: string): GoogleLanguageOption {
  return (
    GOOGLE_WORLD_LANGUAGES.find((l) => l.code === code || l.coreCode === code) ||
    GOOGLE_WORLD_LANGUAGES[0]
  );
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: new (
          options: {
            pageLanguage: string;
            autoDisplay?: boolean;
            multilanguagePage?: boolean;
            includedLanguages?: string;
            layout?: number;
          },
          elementId: string
        ) => unknown;
      };
    };
  }
}

let scriptRequested = false;

function dispatchComboChange(select: HTMLSelectElement): void {
  select.dispatchEvent(new Event('change', { bubbles: true }));
  try {
    const legacyEvent = document.createEvent('HTMLEvents');
    legacyEvent.initEvent('change', true, true);
    select.dispatchEvent(legacyEvent);
  } catch {
    // ignore if unsupported
  }
}

export function setGoogTransCookie(targetCode: string): void {
  if (typeof document === 'undefined') return;
  const cookieVal = !targetCode || targetCode === 'en' ? '/en/en' : `/en/${targetCode}`;
  document.cookie = `googtrans=${cookieVal}; path=/; SameSite=Lax`;
  try {
    const hostname = window.location.hostname;
    if (hostname && hostname.includes('.')) {
      document.cookie = `googtrans=${cookieVal}; domain=.${hostname}; path=/; SameSite=Lax`;
    }
  } catch {
    // ignore cross-domain cookie warnings in sandboxed previews
  }
}

export function triggerGoogleCombo(targetCode: string, attemptsLeft = 30): void {
  if (typeof document === 'undefined') return;
  const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
  if (select && select.options && select.options.length > 1) {
    if (targetCode === 'en') {
      const enOpt = Array.from(select.options).find(
        (opt) => opt.value === 'en' || opt.value === ''
      );
      select.value = enOpt ? enOpt.value : '';
      dispatchComboChange(select);
      return;
    }

    const baseCode = targetCode.split('-')[0];
    const matchedOpt =
      Array.from(select.options).find((opt) => opt.value === targetCode) ||
      Array.from(select.options).find((opt) => opt.value === baseCode);

    if (matchedOpt) {
      select.value = matchedOpt.value;
      dispatchComboChange(select);
      return;
    }
  }

  if (attemptsLeft > 0) {
    window.setTimeout(() => triggerGoogleCombo(targetCode, attemptsLeft - 1), 200);
  }
}

export function initGoogleTranslateElement(initialLangCode?: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  if (initialLangCode) {
    setGoogTransCookie(initialLangCode);
  }

  window.googleTranslateElementInit = () => {
    const container = document.getElementById('google_translate_element');
    if (!container || !window.google?.translate?.TranslateElement) return;
    container.innerHTML = '';
    try {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false,
          multilanguagePage: true
        },
        'google_translate_element'
      );
      const saved = localStorage.getItem(GOOGLE_LANG_STORAGE_KEY) || initialLangCode || 'en';
      if (saved && saved !== 'en') {
        triggerGoogleCombo(saved, 35);
      }
    } catch {
      // ignore widget initialization issues if blocked offline
    }
  };

  if (window.google?.translate?.TranslateElement) {
    window.googleTranslateElementInit();
    return;
  }

  if (scriptRequested || document.getElementById('google-translate-script')) return;
  scriptRequested = true;

  const script = document.createElement('script');
  script.id = 'google-translate-script';
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

export function retriggerActiveGoogleTranslation(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const activeCode = localStorage.getItem(GOOGLE_LANG_STORAGE_KEY) || 'en';
  if (!activeCode || activeCode === 'en') return;

  window.setTimeout(() => {
    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (!select) {
      initGoogleTranslateElement(activeCode);
      return;
    }

    const baseCode = activeCode.split('-')[0];
    const alreadySelected =
      select.value === activeCode || select.value === baseCode;

    if (!alreadySelected) {
      triggerGoogleCombo(activeCode, 15);
      return;
    }

    // If Google Translate hasn't wrapped newly mounted React <main> nodes yet, briefly reset & re-apply
    const mainHasTranslatedNodes = Boolean(document.querySelector('main font'));
    if (!mainHasTranslatedNodes) {
      select.value = '';
      dispatchComboChange(select);
      window.setTimeout(() => {
        triggerGoogleCombo(activeCode, 10);
      }, 60);
    }
  }, 240);
}

export function applyGoogleTranslation(langCode: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  localStorage.setItem(GOOGLE_LANG_STORAGE_KEY, langCode);
  document.documentElement.dir = isRtlLanguageCode(langCode) ? 'rtl' : 'ltr';
  document.documentElement.lang = langCode;

  setGoogTransCookie(langCode);

  if (langCode === 'en') {
    triggerGoogleCombo('en', 5);
    document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
    return;
  }

  initGoogleTranslateElement(langCode);
  triggerGoogleCombo(langCode, 35);
}

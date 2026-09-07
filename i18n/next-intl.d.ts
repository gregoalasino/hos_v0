import type { routing } from './routing';
import type messages from '../messages/en.json';

// Type augmentation for next-intl: `useTranslations('yoga')` autocompletes
// namespaces and keys from messages/en.json, and a key that isn't in the
// English file is a compile error wherever it is used. `Locale` narrows every
// locale-typed API (`Link locale=`, `getTranslations({locale})`) to 'en' | 'es'.
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}

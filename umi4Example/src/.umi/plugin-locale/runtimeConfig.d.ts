// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
import {
  IntlCache,
  createIntl,
} from '/Volumes/Tools/工作区0/01/Demo00/umi4Example/node_modules/react-intl';
type OptionalIntlConfig = Omit<Parameters<typeof createIntl>[0], 'locale' | 'defaultLocale'>;
export interface IRuntimeConfig {
    locale?: {
      getLocale?: () => string;
      cache?: IntlCache;
    } & OptionalIntlConfig;
};

import type { BotContext } from '../types.js';
import { translations } from '../i18n/index.js';

export function setupI18nMiddleware() {
  return async (ctx: BotContext, next: () => Promise<void>) => {
    const userLang = ctx.dbUser?.language ?? (ctx.from?.language_code === 'en' ? 'en' : 'ru');
    const lang = (userLang === 'en' ? 'en' : 'ru') as 'ru' | 'en';
    const dict = translations[lang] ?? translations['ru'];

    ctx.t = (key: string, params?: Record<string, string | number>): string => {
      let text: string = (dict as Record<string, string>)[key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        }
      }
      return text;
    };

    await next();
  };
}

import type { BotContext } from '../types.js';
import { buildSettingsKeyboard } from '../keyboards/index.js';

export async function settingsCommand(ctx: BotContext) {
  const user = ctx.dbUser!;
  const langName = user.language === 'ru' ? '🇷🇺 Русский' : '🇬🇧 English';

  await ctx.reply(
    [ctx.t('settings.title'), '', ctx.t('settings.language', { lang: langName })].join('\n'),
    { reply_markup: buildSettingsKeyboard(ctx) },
  );
}

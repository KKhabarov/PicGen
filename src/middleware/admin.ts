import type { BotContext } from '../types.js';

export function adminMiddleware() {
  return async (ctx: BotContext, next: () => Promise<void>) => {
    if (!ctx.dbUser?.isAdmin) {
      await ctx.reply(ctx.t('error.not_admin'));
      return;
    }
    await next();
  };
}

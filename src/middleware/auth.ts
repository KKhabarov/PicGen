import type { BotContext } from '../types.js';
import { findOrCreateUser } from '../services/user.js';
import { logger } from '../utils/logger.js';

export function authMiddleware() {
  return async (ctx: BotContext, next: () => Promise<void>) => {
    if (!ctx.from) {
      return next();
    }

    try {
      const user = await findOrCreateUser({
        id: BigInt(ctx.from.id),
        username: ctx.from.username,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name,
        languageCode: ctx.from.language_code,
      });

      if (user.isBanned) {
        await ctx.reply(ctx.t('error.banned'));
        return;
      }

      ctx.dbUser = user;
    } catch (error) {
      logger.error('Auth middleware error', { error });
      await ctx.reply(ctx.t('error.general'));
      return;
    }

    await next();
  };
}

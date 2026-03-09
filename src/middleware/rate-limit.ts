import type { BotContext } from '../types.js';
import { RATE_LIMIT_PER_MINUTE, RATE_LIMIT_PER_HOUR } from '../utils/constants.js';

// In-memory rate limit store (use Redis in production for multi-instance)
const minuteCounters = new Map<number, { count: number; resetAt: number }>();
const hourCounters = new Map<number, { count: number; resetAt: number }>();

export function rateLimitMiddleware() {
  return async (ctx: BotContext, next: () => Promise<void>) => {
    const userId = ctx.dbUser?.id;
    if (!userId) return next();

    const now = Date.now();

    // Check minute limit
    const minuteData = minuteCounters.get(userId);
    if (minuteData && now < minuteData.resetAt) {
      if (minuteData.count >= RATE_LIMIT_PER_MINUTE) {
        await ctx.reply(ctx.t('generate.rate_limit_minute'));
        return;
      }
      minuteData.count++;
    } else {
      minuteCounters.set(userId, { count: 1, resetAt: now + 60_000 });
    }

    // Check hour limit
    const hourData = hourCounters.get(userId);
    if (hourData && now < hourData.resetAt) {
      if (hourData.count >= RATE_LIMIT_PER_HOUR) {
        await ctx.reply(ctx.t('generate.rate_limit_hour'));
        return;
      }
      hourData.count++;
    } else {
      hourCounters.set(userId, { count: 1, resetAt: now + 3_600_000 });
    }

    await next();
  };
}

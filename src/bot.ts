import { Bot, session } from 'grammy';
import type { BotContext, SessionData } from './types.js';
import { config } from './config.js';
import { authMiddleware } from './middleware/auth.js';
import { setupI18nMiddleware } from './middleware/i18n.js';
import { logger } from './utils/logger.js';

import { startCommand } from './commands/start.js';
import { generateCommand } from './commands/generate.js';
import { balanceCommand } from './commands/balance.js';
import { buyCommand } from './commands/buy.js';
import { historyCommand } from './commands/history.js';
import { referralCommand } from './commands/referral.js';
import { settingsCommand } from './commands/settings.js';
import { helpCommand } from './commands/help.js';
import { adminCommand } from './commands/admin.js';

import { createCallbackHandler } from './handlers/callback.js';
import { createMessageHandler } from './handlers/message.js';
import { handlePreCheckoutQuery, handleSuccessfulPayment } from './handlers/payment.js';

export function createBot() {
  const bot = new Bot<BotContext>(config.botToken);

  // Session setup
  bot.use(
    session<SessionData, BotContext>({
      initial: (): SessionData => ({}),
    }),
  );

  // i18n must come before auth so ctx.t is available
  bot.use(setupI18nMiddleware());

  // Auth middleware — loads/creates user
  bot.use(authMiddleware());

  // Commands
  bot.command('start', startCommand);
  bot.command('generate', generateCommand);
  bot.command('balance', balanceCommand);
  bot.command('buy', buyCommand);
  bot.command('history', historyCommand);
  bot.command('referral', referralCommand);
  bot.command('settings', settingsCommand);
  bot.command('help', helpCommand);
  bot.command('admin', adminCommand);

  // Payment handlers
  bot.on('pre_checkout_query', handlePreCheckoutQuery);
  bot.on('message:successful_payment', handleSuccessfulPayment);

  // Callback query handler
  bot.on('callback_query:data', createCallbackHandler(bot));

  // Text message handler
  bot.on('message:text', createMessageHandler(bot));

  // Error handler
  bot.catch((err) => {
    logger.error('Bot error', { error: err.message, ctx: err.ctx?.update });
  });

  return bot;
}

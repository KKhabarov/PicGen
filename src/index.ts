import { createBot } from './bot.js';
import { createGenerationWorker } from './queues/generation.worker.js';
import { prisma } from './services/user.js';
import { logger } from './utils/logger.js';

async function main() {
  logger.info('Starting PicGen bot...');

  // Start BullMQ worker
  const worker = createGenerationWorker();
  logger.info('Generation worker started');

  // Create and start bot
  const bot = createBot();

  // Set bot commands
  await bot.api.setMyCommands([
    { command: 'start', description: 'Начать работу / Start' },
    { command: 'generate', description: 'Создать изображение / Generate image' },
    { command: 'balance', description: 'Проверить баланс / Check balance' },
    { command: 'buy', description: 'Купить кредиты / Buy credits' },
    { command: 'history', description: 'История генераций / Generation history' },
    { command: 'referral', description: 'Реферальная программа / Referral program' },
    { command: 'settings', description: 'Настройки / Settings' },
    { command: 'help', description: 'Справка / Help' },
  ]);

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    await bot.stop();
    await worker.close();
    await prisma.$disconnect();
    logger.info('Shutdown complete');
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // Start polling
  await bot.start({
    onStart: (botInfo) => {
      logger.info(`Bot @${botInfo.username} started successfully`);
    },
  });
}

main().catch((error) => {
  logger.error('Fatal error during startup', { error });
  process.exit(1);
});

import { Worker } from 'bullmq';
import { config } from '../config.js';
import { generateImage } from '../services/image-generator.js';
import { updateGenerationStatus } from '../services/history.js';
import { logger } from '../utils/logger.js';
import type { GenerationOptions } from '../types.js';

export function createGenerationWorker() {
  const worker = new Worker<GenerationOptions>(
    'generation',
    async (job) => {
      const { prompt, style, aspectRatio, resolution, generationId, userId } = job.data;

      logger.info('Processing generation job', { jobId: job.id, generationId, userId });

      await updateGenerationStatus(generationId, 'PROCESSING');

      const imageUrl = await generateImage({
        prompt,
        style,
        aspectRatio,
        resolution,
      });

      await updateGenerationStatus(generationId, 'COMPLETED', { imageUrl });

      logger.info('Generation job completed', { jobId: job.id, generationId, imageUrl });

      return { imageUrl };
    },
    {
      connection: {
        url: config.redisUrl,
      },
      concurrency: 3,
    },
  );

  worker.on('failed', async (job, err) => {
    if (job) {
      logger.error('Generation job failed', { jobId: job.id, error: err.message });
      await updateGenerationStatus(job.data.generationId, 'FAILED', {
        errorMessage: err.message,
      });
    }
  });

  worker.on('error', (err) => {
    logger.error('Worker error', { error: err.message });
  });

  return worker;
}

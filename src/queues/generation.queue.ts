import { Queue } from 'bullmq';
import { config } from '../config.js';
import type { GenerationOptions } from '../types.js';

export const generationQueue = new Queue<GenerationOptions>('generation', {
  connection: {
    url: config.redisUrl,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: 100,
    removeOnFail: 100,
  },
});

export async function addGenerationJob(options: GenerationOptions) {
  return generationQueue.add('generate', options, {
    jobId: `gen-${options.generationId}`,
  });
}

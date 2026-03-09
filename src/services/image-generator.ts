import { config } from '../config.js';
import { logger } from '../utils/logger.js';
import { sleep } from '../utils/helpers.js';
import { GENERATION_POLL_INTERVAL_MS, GENERATION_MAX_POLLS } from '../utils/constants.js';

interface GenerateRequest {
  prompt: string;
  aspect_ratio: string;
  resolution: string;
}

interface GenerateResponse {
  task_id: string;
  status?: string;
}

interface StatusResponse {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  image_url?: string;
  error?: string;
}

export async function submitGeneration(request: GenerateRequest): Promise<string> {
  const response = await fetch(`${config.nanoBanana.apiUrl}/generate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.nanoBanana.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Nano Banana API error: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as GenerateResponse;
  return data.task_id;
}

export async function getGenerationStatus(taskId: string): Promise<StatusResponse> {
  const response = await fetch(
    `${config.nanoBanana.apiUrl}/status?task_id=${encodeURIComponent(taskId)}`,
    {
      headers: {
        Authorization: `Bearer ${config.nanoBanana.apiKey}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Status API error: ${response.status}`);
  }

  return response.json() as Promise<StatusResponse>;
}

export async function generateImage(options: {
  prompt: string;
  style: string;
  aspectRatio: string;
  resolution: string;
}): Promise<string> {
  const fullPrompt = `style: ${options.style}. ${options.prompt}`;

  const taskId = await submitGeneration({
    prompt: fullPrompt,
    aspect_ratio: options.aspectRatio,
    resolution: options.resolution,
  });

  logger.info('Generation task submitted', { taskId });

  // Poll for completion
  for (let i = 0; i < GENERATION_MAX_POLLS; i++) {
    await sleep(GENERATION_POLL_INTERVAL_MS);

    const status = await getGenerationStatus(taskId);

    if (status.status === 'completed' && status.image_url) {
      logger.info('Generation completed', { taskId, imageUrl: status.image_url });
      return status.image_url;
    }

    if (status.status === 'failed') {
      throw new Error(status.error ?? 'Generation failed');
    }
  }

  throw new Error('Generation timed out');
}

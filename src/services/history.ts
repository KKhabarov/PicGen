import { prisma } from './user.js';
import { HISTORY_PAGE_SIZE } from '../utils/constants.js';
import type { GenerationStatus } from '@prisma/client';

export async function createGeneration(data: {
  userId: number;
  prompt: string;
  style?: string;
  aspectRatio: string;
  resolution: string;
  creditsUsed: number;
}) {
  return prisma.generation.create({
    data: {
      userId: data.userId,
      prompt: data.prompt,
      style: data.style,
      aspectRatio: data.aspectRatio,
      resolution: data.resolution,
      creditsUsed: data.creditsUsed,
      status: 'PENDING',
    },
  });
}

export async function updateGenerationStatus(
  id: number,
  status: GenerationStatus,
  options?: {
    imageUrl?: string;
    taskId?: string;
    errorMessage?: string;
  },
) {
  return prisma.generation.update({
    where: { id },
    data: {
      status,
      ...(options?.imageUrl && { imageUrl: options.imageUrl }),
      ...(options?.taskId && { taskId: options.taskId }),
      ...(options?.errorMessage && { errorMessage: options.errorMessage }),
    },
  });
}

export async function getGenerationById(id: number) {
  return prisma.generation.findUnique({
    where: { id },
    include: { user: true },
  });
}

export async function getUserHistory(userId: number, page: number) {
  const skip = (page - 1) * HISTORY_PAGE_SIZE;
  const [items, total] = await Promise.all([
    prisma.generation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: HISTORY_PAGE_SIZE,
      skip,
    }),
    prisma.generation.count({ where: { userId } }),
  ]);

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / HISTORY_PAGE_SIZE),
  };
}

export async function getTotalGenerations(): Promise<number> {
  return prisma.generation.count();
}

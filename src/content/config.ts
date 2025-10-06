import { defineCollection, z } from 'astro:content';

const updatesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    category: z.enum(['plasma-hardware', 'saltwater-dynamics', 'reactive-species']),
    summary: z.string(),
    tags: z.array(z.string()).optional(),
    status: z.enum(['in-progress', 'completed', 'blocked', 'paused']).optional(),
    videoUrl: z.string().url().optional(),
    relatedUpdates: z.array(z.string()).optional(),
  }),
});

export const collections = {
  updates: updatesCollection,
};
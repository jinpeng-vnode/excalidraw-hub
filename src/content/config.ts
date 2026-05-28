// src/content/config.ts — Content Collection Schema 定义
import { defineCollection, z } from 'astro:content'

const templates = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    seoTitle: z.string(),
    seoDescription: z.string(),
    keywords: z.array(z.string()),
    excalidrawData: z.any(),
    locale: z.enum(['en', 'zh']).default('en'),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
})

export const collections = { templates }

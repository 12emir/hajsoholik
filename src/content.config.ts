import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

// Blog — treści poradnikowe. Markdown w src/content/blog, metadane w frontmatter.
// draft: true = szkic, który NIE trafia na stronę (np. temat podatkowy przed konsultacją).
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string(),
    verifiedAt: z.string(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    notice: z.string().optional(),
  }),
})

export const collections = { blog }

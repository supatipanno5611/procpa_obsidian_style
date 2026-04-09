import { defineConfig, defineCollection, s } from 'velite'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkWikiLink from './src/lib/velite/remark-wiki-link'
import { buildGraph } from './src/lib/velite/build-graph'

const computedFields = <T extends { slug: string }>(data: T) => ({
  ...data,
  slugAsParams: data.slug.split('/').slice(1).join('/'),
})

const posts = defineCollection({
  name: 'Post',
  pattern: 'posts/**/*.md',
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(120),
      description: s.string().max(300),
      date: s.isodate(),
      updated: s.isodate().optional(),
      tags: s.array(s.string()).default([]),
      category: s.enum(['accounting', 'ai']).default('accounting'),
      cover: s.string().optional(),
      draft: s.boolean().default(false),
      metadata: s.metadata(),
      body: s.mdx(),
      toc: s.toc(),
    })
    .transform(computedFields),
})

const series = defineCollection({
  name: 'Series',
  pattern: 'series/*/index.md',
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(120),
      description: s.string().max(300),
      date: s.isodate(),
      cover: s.string().optional(),
      tags: s.array(s.string()).default([]),
      category: s.enum(['accounting', 'ai']).default('accounting'),
      order: s.number().default(0),
      draft: s.boolean().default(false),
    })
    .transform((data) => ({
      ...data,
      slugAsParams: data.slug.replace(/^series\//, '').replace(/\/index$/, ''),
    })),
})

const chapters = defineCollection({
  name: 'Chapter',
  pattern: ['series/**/*.md', '!series/**/index.md'],
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(120),
      description: s.string().max(300).optional(),
      series: s.string(),
      order: s.number(),
      draft: s.boolean().default(false),
      metadata: s.metadata(),
      body: s.mdx(),
      toc: s.toc(),
    })
    .transform((data) => ({
      ...data,
      slugAsParams: data.slug.replace(/^series\//, ''),
    })),
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { posts, series, chapters },
  prepare: async (data) => {
    await buildGraph({
      posts: data.posts as unknown as Parameters<typeof buildGraph>[0]['posts'],
      chapters: data.chapters as unknown as Parameters<typeof buildGraph>[0]['chapters'],
      contentRoot: 'content',
      outDir: '.velite',
    })
  },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: { dark: 'github-dark', light: 'github-light' } }],
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
    remarkPlugins: [remarkWikiLink],
  },
  markdown: {
    remarkPlugins: [remarkWikiLink],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: { dark: 'github-dark', light: 'github-light' } }],
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
})

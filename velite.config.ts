import { defineConfig, defineCollection, s } from 'velite'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import remarkWikiLink from './src/lib/velite/remark-wiki-link'
import remarkCallout from './src/lib/velite/remark-callout'
import { buildGraph } from './src/lib/velite/build-graph'

/** Resolve category key from a content folder name (auto-derived via slugify). */
function resolveCategory(folder: string): string {
  return slugify(folder)
}

/** Strip leading number prefix ("00. ", "01. ") from a segment for clean URLs. */
function stripPrefix(str: string): string {
  return str.replace(/^\d+\.\s*/, '')
}

/** Normalize a path segment into a URL-safe slug (keeps Korean, replaces junk). */
function slugify(str: string): string {
  return stripPrefix(str)
    .trim()
    .replace(/[()（）\[\]【】]/g, '')       // drop brackets / parens
    .replace(/&/g, '-')                       // ampersand → hyphen
    .replace(/[.,·:;!?'"]+/g, '')            // drop punctuation
    .replace(/[\s_/\\]+/g, '-')             // whitespace → hyphen
    .replace(/-{2,}/g, '-')                 // collapse multi-hyphens
    .replace(/^-|-$/g, '')                  // trim leading/trailing hyphens
    .replace(/[A-Z]/g, c => c.toLowerCase()) // lowercase ASCII
}

/** Slugify every segment of a `/`-delimited path. */
function slugifyPath(p: string): string {
  return p.split('/').map(slugify).join('/')
}

/**
 * 3-level layout with subcategories:
 *   content/<topic>/<subcategory>/<file>.md                      → Post
 *   content/<topic>/<subcategory>/<series>/index.md|metadata.md  → Series meta
 *   content/<topic>/<subcategory>/<series>/<chapter>.md           → Chapter
 *   content/<topic>/<subcategory>/<series>/<parent>/<child>.md    → Sub-chapter
 *
 * `category` = topic folder, `subcategory` = subcategory folder.
 * `order` auto-derived from filename prefix. WikiDocs frontmatter accepted.
 */

const posts = defineCollection({
  name: 'Post',
  pattern: [
    '*/*.md',             // depth 2: topic/file.md
    '*/*/*.md',           // depth 3: topic/subcategory/file.md
    '!*/index.md', '!*/metadata.md',
    '!*/*/index.md', '!*/*/metadata.md',
    '!downloads/*.md',
  ],
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(120).optional(),
      subject: s.string().optional(),
      description: s.string().max(300),
      date: s.isodate(),
      updated: s.isodate().optional(),
      tags: s.array(s.string()).default([]),
      category: s.string().optional(),
      cover: s.string().optional(),
      draft: s.boolean().default(false),
      metadata: s.metadata(),
      body: s.mdx(),
      toc: s.toc(),
    })
    .transform((data) => {
      const segments = data.slug.split('/')
      const topic = segments[0]
      const subcategory = segments.length >= 3 ? segments[1] : null
      const fileName = segments[segments.length - 1]
      return {
        ...data,
        title: data.title ?? data.subject ?? fileName,
        category: data.category ?? resolveCategory(topic),
        subcategory,
        slugAsParams: slugifyPath(segments.join('/')),
      }
    }),
})

const series = defineCollection({
  name: 'Series',
  pattern: ['*/*/*/index.md', '*/*/*/metadata.md'],
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(120).optional(),
      subject: s.string().optional(),
      description: s.string().max(300).optional().default(''),
      date: s.isodate().optional(),
      cover: s.string().optional(),
      tags: s.array(s.string()).default([]),
      category: s.string().optional(),
      order: s.number().default(0),
      draft: s.boolean().default(false),
      id: s.number().optional(),
      body: s.mdx(),
    })
    .transform((data) => {
      const segments = data.slug.split('/')
      const topic = segments[0]
      const subcategory = segments[1]
      const seriesSlug = segments[2]
      return {
        ...data,
        title: data.title ?? data.subject ?? seriesSlug,
        category: data.category ?? resolveCategory(topic),
        subcategory,
        slugAsParams: slugifyPath(`${topic}/${subcategory}/${seriesSlug}`),
      }
    }),
})

const chapters = defineCollection({
  name: 'Chapter',
  pattern: ['*/*/*/**/*.md', '!*/*/*/index.md', '!*/*/*/metadata.md'],
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(120).optional(),
      subject: s.string().optional(),
      description: s.string().max(300).optional(),
      series: s.string().optional(),
      category: s.string().optional(),
      order: s.number().optional(),
      draft: s.boolean().default(false),
      id: s.number().optional(),
      parent_id: s.number().optional(),
      book_id: s.number().optional(),
      open_yn: s.string().optional(),
      last_synced: s.string().nullable().optional(),
      metadata: s.metadata(),
      body: s.mdx(),
      toc: s.toc(),
    })
    .transform((data) => {
      const segments = data.slug.split('/')
      const topic = segments[0]
      const subcategory = segments[1]
      const seriesSlug = segments[2]
      const withinSeries = segments.slice(3)
      const fileName = withinSeries[withinSeries.length - 1]

      const depth = withinSeries.length - 1
      const parentPath = depth > 0
        ? slugifyPath(withinSeries.slice(0, -1).join('/'))
        : null

      const autoOrder = parseInt(fileName.match(/^(\d+)/)?.[1] ?? '0', 10)
      const resolvedTitle = data.title ?? data.subject ?? fileName

      return {
        ...data,
        title: resolvedTitle,
        series: slugifyPath(`${topic}/${subcategory}/${data.series ?? seriesSlug}`),
        category: data.category ?? resolveCategory(topic),
        subcategory,
        order: data.order ?? autoOrder,
        depth,
        parentPath,
        slugAsParams: slugifyPath(`${topic}/${subcategory}/${seriesSlug}/${withinSeries.join('/')}`),
      }
    }),
})

const downloads = defineCollection({
  name: 'Download',
  pattern: 'downloads/*.md',
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(120),
      description: s.string().max(300).optional(),
      file: s.string(),
      category: s.string().optional(),
      tags: s.array(s.string()).default([]),
      date: s.isodate(),
      draft: s.boolean().default(false),
    })
    .transform((data) => ({
      ...data,
      category: data.category ?? 'etc',
      slugAsParams: data.slug.split('/').pop() ?? data.slug,
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
  collections: { posts, series, chapters, downloads },
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
    remarkPlugins: [remarkGfm, remarkWikiLink, remarkCallout],
  },
  markdown: {
    remarkPlugins: [remarkGfm, remarkWikiLink, remarkCallout],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: { dark: 'github-dark', light: 'github-light' } }],
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
})

import { bundleMDX } from 'mdx-bundler'
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import readingTime from 'reading-time'
import getAllFilesRecursively from './utils/files'

// Remark packages
import remarkGfm from 'remark-gfm'
import remarkFootnotes from 'remark-footnotes'
import remarkMath from 'remark-math'
import remarkExtractFrontmatter from './remark-extract-frontmatter'
import remarkCodeTitles from './remark-code-title'
import remarkTocHeadings from './remark-toc-headings'
import remarkImgToJsx from './remark-img-to-jsx'

// Rehype packages
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeCitation from 'rehype-citation'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypePresetMinify from 'rehype-preset-minify'

const root = process.cwd()

export function getFiles(type) {
  const prefixPaths = path.join(root, 'data', type)
  const files = getAllFilesRecursively(prefixPaths)
  // Only want to return blog/path and ignore root, replace is needed to work on Windows
  return files.map((file) => file.slice(prefixPaths.length + 1).replace(/\\/g, '/'))
}

export function formatSlug(slug) {
  return slug.replace(/\.(mdx|md)/, '')
}

export function dateSortDesc(a, b) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

export async function getFileBySlug(type, slug) {
  // for a single blog post this
  // returns an object with attributes; mdxSource, toc, fronmatter{}
  const mdxPath = path.join(root, 'data', type, `${slug}.mdx`)
  const mdPath = path.join(root, 'data', type, `${slug}.md`)
  const source = fs.existsSync(mdxPath)
    ? fs.readFileSync(mdxPath, 'utf8')
    : fs.readFileSync(mdPath, 'utf8')

  // https://github.com/kentcdodds/mdx-bundler#nextjs-esbuild-enoent
  if (process.platform === 'win32') {
    process.env.ESBUILD_BINARY_PATH = path.join(root, 'node_modules', 'esbuild', 'esbuild.exe')
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(root, 'node_modules', 'esbuild', 'bin', 'esbuild')
  }

  let toc = []

  const { code, frontmatter } = await bundleMDX({
    source,
    // mdx imports can be automatically source from the components directory
    cwd: path.join(root, 'components'),
    xdmOptions(options, frontmatter) {
      // this is the recommended way to add custom remark/rehype plugins:
      // The syntax might look weird, but it protects you in case we add/remove
      // plugins in the future.
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkExtractFrontmatter,
        [remarkTocHeadings, { exportRef: toc }],
        remarkGfm,
        remarkCodeTitles,
        [remarkFootnotes, { inlineNotes: true }],
        remarkMath,
        remarkImgToJsx,
      ]
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeAutolinkHeadings,
        rehypeKatex,
        [rehypeCitation, { path: path.join(root, 'data') }],
        [rehypePrismPlus, { ignoreMissing: true, showLineNumbers: false }],
        rehypePresetMinify,
      ]
      return options
    },
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        '.js': 'jsx',
      }
      return options
    },
  })

  // frontmatter category can be an array or a string
  if (typeof frontmatter.category === 'undefined') {
    frontmatter.category = ['uncategorized']
  } else if (!frontmatter.category) {
    frontmatter.category = ['uncategorized']
  } else if (typeof frontmatter.category == 'string') {
    frontmatter.category = frontmatter.category
      .replaceAll('/', '>')
      .replaceAll(',', '')
      .replaceAll(' >', '>')
      .replaceAll('> ', '>')
      .replaceAll('>', '.')
      .split(' ')
  } else {
    frontmatter.category.map((category) =>
      category
        .replaceAll('/', '>')
        .replaceAll(',', '')
        .replaceAll(' >', '>')
        .replaceAll('> ', '>')
        .replaceAll('>', '.')
    )
  }

  return {
    mdxSource: code,
    toc,
    frontMatter: {
      readingTime: readingTime(code),
      slug: slug || null,
      fileName: fs.existsSync(mdxPath) ? `${slug}.mdx` : `${slug}.md`,
      ...frontmatter,
      date: frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
    },
  }
}

export async function getAllSnippets() {
  const allPosts = await getAllFilesFrontMatter('blog')

  const allSnippets = []

  allPosts.forEach(function (post) {
    if (post.category[0].toLowerCase().includes('snippet')) {
      allSnippets.push(post)
    }
  })

  return allSnippets
}

export async function getAllFilesFrontMatter(folder) {
  // returns an array of objects with unpacked frontmatter attributes, slug, and date
  const prefixPaths = path.join(root, 'data', folder)

  const files = getAllFilesRecursively(prefixPaths)

  const allFrontMatter = []

  files.forEach((file) => {
    // Replace is needed to work on Windows
    const fileName = file.slice(prefixPaths.length + 1).replace(/\\/g, '/')
    // Remove Unexpected File
    if (path.extname(fileName) !== '.md' && path.extname(fileName) !== '.mdx') {
      return
    }
    const source = fs.readFileSync(file, 'utf8')
    const { data: frontmatter } = matter(source)

    // category must be an array.
    if (!frontmatter.category) {
      frontmatter.category = ['uncategorized']
    } else if (typeof frontmatter.category == 'string') {
      frontmatter.category = frontmatter.category
        .replaceAll('/', '>')
        .replaceAll(',', '')
        .replaceAll(' >', '>')
        .replaceAll('> ', '>')
        .replaceAll('>', '.')
        .split(' ')
    } else {
      frontmatter.category.map((category) =>
        category
          .replaceAll('/', '>')
          .replaceAll(',', '')
          .replaceAll(' >', '>')
          .replaceAll('> ', '>')
          .replaceAll('>', '.')
      )
    }

    allFrontMatter.push({
      ...frontmatter,
      slug: formatSlug(fileName),
      date: frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
    })
  })

  return allFrontMatter.sort((a, b) => dateSortDesc(a.date, b.date))
}

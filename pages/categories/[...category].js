import { CategorySEO } from "@/components/SEO"
import siteMetadata from "@/data/siteMetadata"
import ListLayout from "@/layouts/ListLayout"
import generateRss from "@/lib/generate-rss"
import { getAllFilesFrontMatter } from "@/lib/mdx"
import { getAllCategories } from "@/lib/categories"
import kebabCase from "@/lib/utils/kebabCase"
import fs from "fs"
import path from "path"

const root = process.cwd()

export async function getStaticPaths() {
  const categories = await getAllCategories("blog")

  const paths = Object.keys(categories).map((category) => ({
    params: {
      category: category.split("."),
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const allPosts = await getAllFilesFrontMatter("blog")

  // strCategory is a lowercase string of the parent and child category separated by a dot
  const strCategory = params.category.join(".")

  const filteredPosts = allPosts.filter(function (post) {
    // postCategories is an array of lowercased strings with a dot separating parent and child categories
    if (typeof post.category == "string") {
      post.category = post.category.split(" ")
    }
    const postCategories = post.category.map((c) => c.toLowerCase())

    var boolArray = postCategories.map((c) => strCategory.includes(c.toLowerCase()))
    return post.draft !== true && boolArray.includes(true)
  })
  console.log("--- debug filteredPosts: ", filteredPosts)

  // rss
  if (filteredPosts.length > 0) {
    const rss = generateRss(filteredPosts, `categories/${params.category}/feed.xml`)
    const rssPath = path.join(root, "public", "categories", kebabCase(params.category))
    fs.mkdirSync(rssPath, { recursive: true })
    fs.writeFileSync(path.join(rssPath, "feed.xml"), rss)
  }

  return { props: { posts: filteredPosts, category: params.category } }
}

export default function Category({ posts, category }) {
  // Capitalize first letter and convert space to dash
  const title = category[1]
  return (
    <>
      <CategorySEO
        title={`${title} - ${siteMetadata.author}`}
        description={`${title} category - ${siteMetadata.author}`}
      />
      <ListLayout posts={posts} title={title} />
    </>
  )
}

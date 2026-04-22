import Link from "next/link"
import { notFound } from "next/navigation"
import { getCategories, getToolsByCategory, getCategoryName, getAllTools } from "@/lib/tools"
import { ToolSearch } from "../tool-search"

export function generateStaticParams() {
  return getCategories().map((cat) => ({ category: cat.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  return {
    title: `${getCategoryName(category)} Tools — gettingstarted.sh`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const tools = getToolsByCategory(category)
  const categories = getCategories()
  const allTools = getAllTools()

  if (tools.length === 0) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pt-24 pb-16">
      <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
        Registry
      </p>
      <h1 className="text-2xl font-medium md:text-3xl">
        {getCategoryName(category)}
      </h1>

      {/* Category pills */}
      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/browse"
          className="rounded border px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          All ({allTools.length})
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/browse/${cat.slug}`}
            className={`rounded border px-3 py-1 text-xs transition-colors ${
              cat.slug === category
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.name} ({cat.count})
          </Link>
        ))}
      </div>

      {/* Tool list */}
      <ToolSearch tools={tools} />
    </div>
  )
}

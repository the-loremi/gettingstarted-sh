import Link from "next/link"
import { getAllTools, getCategories } from "@/lib/tools"
import { ToolSearch } from "./tool-search"

export const metadata = {
  title: "Browse Tools — gettingstarted.sh",
}

export default function BrowsePage() {
  const tools = getAllTools()
  const categories = getCategories()

  return (
    <div className="mx-auto max-w-2xl px-6 pt-24 pb-16">
      <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
        Registry
      </p>
      <h1 className="text-2xl font-medium md:text-3xl">
        Browse tools
      </h1>

      {/* Category pills */}
      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/browse"
          className="rounded border bg-primary px-3 py-1 text-xs text-primary-foreground"
        >
          All ({tools.length})
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/browse/${cat.slug}`}
            className="rounded border px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {cat.name} ({cat.count})
          </Link>
        ))}
      </div>

      {/* Search + Tool list */}
      <ToolSearch tools={tools} />
    </div>
  )
}

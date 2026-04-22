import { getAllTools, getCategories } from "@/lib/tools"
import { ToolSearch } from "./tool-search"

export const metadata = {
  title: "Browse Tools — gettingstarted.sh",
}

export default function BrowsePage() {
  const tools = getAllTools()
  const categories = getCategories()

  return (
    <div className="mx-auto max-w-4xl px-6 pt-24 pb-16">
      <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
        Registry
      </p>
      <h1 className="text-2xl font-medium md:text-3xl">Browse tools</h1>

      <ToolSearch tools={tools} categories={categories} />
    </div>
  )
}

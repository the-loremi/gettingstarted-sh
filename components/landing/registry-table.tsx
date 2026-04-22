import Link from "next/link"
import { type Tool, type Category } from "@/lib/tools"
import { ToolTable } from "./tool-table"

export function RegistryTable({
  tools,
  categories,
}: {
  tools: Tool[]
  categories: Category[]
}) {
  return (
    <section id="registry" className="border-t px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
          Tools Registry
        </p>
        <h2 className="text-2xl font-medium md:text-3xl">
          The setup registry{" "}
          <span className="text-muted-foreground">for the AI era.</span>
        </h2>

        <div className="mt-12">
          <ToolTable
            tools={tools}
            categories={categories}
            showSearch={false}
            showCategoryTabs={true}
          />
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/browse"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Browse all tools →
          </Link>
        </div>
      </div>
    </section>
  )
}

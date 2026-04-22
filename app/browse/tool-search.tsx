"use client"

import { type Tool, type Category } from "@/lib/tool-types"
import { ToolTable } from "@/components/landing/tool-table"

export function ToolSearch({
  tools,
  categories,
}: {
  tools: Tool[]
  categories: Category[]
}) {
  return (
    <div className="mt-8">
      <ToolTable
        tools={tools}
        categories={categories}
        showSearch={true}
        showCategoryTabs={true}
      />
    </div>
  )
}

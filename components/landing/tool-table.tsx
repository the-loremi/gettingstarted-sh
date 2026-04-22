"use client"

import { useState } from "react"
import Link from "next/link"
import { type Tool, type Category, getCategoryName } from "@/lib/tool-types"
import { CopyButton } from "./copy-button"

type ToolTableProps = {
  tools: Tool[]
  categories?: Category[]
  showSearch?: boolean
  showCategoryTabs?: boolean
}

export function ToolTable({
  tools,
  categories = [],
  showSearch = false,
  showCategoryTabs = false,
}: ToolTableProps) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  let filtered = tools

  if (query) {
    filtered = filtered.filter((t) =>
      t.name.toLowerCase().includes(query.toLowerCase())
    )
  }

  if (activeCategory) {
    filtered = filtered.filter((t) => t.category === activeCategory)
  }

  return (
    <>
      {/* Search */}
      {showSearch && (
        <input
          type="text"
          placeholder="Search tools..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-6 w-full rounded-lg border bg-card px-4 py-2.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      )}

      {/* Category tabs */}
      {showCategoryTabs && categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded border px-3 py-1 text-xs transition-colors ${
              activeCategory === null
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({tools.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() =>
                setActiveCategory(activeCategory === cat.slug ? null : cat.slug)
              }
              className={`rounded border px-3 py-1 text-xs transition-colors ${
                activeCategory === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      )}

      {/* Desktop table */}
      <div className="overflow-hidden rounded-lg border">
        <table className="hidden w-full text-xs md:table">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="w-12 px-4 py-3 text-left font-normal text-muted-foreground">
                #
              </th>
              <th className="px-4 py-3 text-left font-normal text-muted-foreground">
                TOOL
              </th>
              <th className="px-4 py-3 text-left font-normal text-muted-foreground">
                CATEGORY
              </th>
              <th className="px-4 py-3 text-left font-normal text-muted-foreground">
                VERSION
              </th>
              <th className="px-4 py-3 text-left font-normal text-muted-foreground">
                OS
              </th>
              <th className="px-4 py-3 text-right font-normal text-muted-foreground">
                COMMAND
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tool, i) => (
              <tr
                key={tool.slug}
                className="border-b transition-colors last:border-b-0 hover:bg-muted/30"
              >
                <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-3">
                  <Link href={`/${tool.slug}`} className="hover:underline">
                    <span className="font-medium">{tool.name}</span>
                  </Link>{" "}
                  <span className="text-muted-foreground">{tool.slug}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {getCategoryName(tool.category)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {tool.version}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {tool.os.join(" · ")}
                </td>
                <td className="px-4 py-3 text-right">
                  <CopyButton
                    command={`curl gettingstarted.sh/${tool.slug} | sh`}
                  />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  {query
                    ? `No tools found for "${query}"`
                    : "No tools in this category"}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Mobile list */}
        <div className="divide-y md:hidden">
          {filtered.map((tool, i) => (
            <div key={tool.slug} className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/${tool.slug}`}
                      className="text-xs font-medium hover:underline"
                    >
                      {tool.name}
                    </Link>
                    <span className="text-[10px] text-muted-foreground">
                      {getCategoryName(tool.category)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">
                      {tool.version} · {tool.os.join(" · ")}
                    </span>
                    <CopyButton
                      command={`curl gettingstarted.sh/${tool.slug} | sh`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-4 text-center text-xs text-muted-foreground">
              {query
                ? `No tools found for "${query}"`
                : "No tools in this category"}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

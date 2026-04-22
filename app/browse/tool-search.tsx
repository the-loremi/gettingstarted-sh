"use client"

import { useState } from "react"
import Link from "next/link"
import { type Tool, getCategoryName } from "@/lib/tool-types"
import { CopyButton } from "@/components/landing/copy-button"

export function ToolSearch({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = useState("")

  const filtered = query
    ? tools.filter((t) =>
        t.name.toLowerCase().includes(query.toLowerCase())
      )
    : tools

  return (
    <>
      <input
        type="text"
        placeholder="Search tools..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mt-6 w-full rounded-lg border bg-card px-4 py-2.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />

      <div className="mt-6 overflow-hidden rounded-lg border">
        {/* Desktop table */}
        <table className="hidden w-full text-xs md:table">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-normal text-muted-foreground">Tool</th>
              <th className="px-4 py-3 text-left font-normal text-muted-foreground">Category</th>
              <th className="px-4 py-3 text-left font-normal text-muted-foreground">Version</th>
              <th className="px-4 py-3 text-left font-normal text-muted-foreground">OS</th>
              <th className="px-4 py-3 text-right font-normal text-muted-foreground">Command</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tool) => (
              <tr key={tool.slug} className="border-b transition-colors last:border-b-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/${tool.slug}`} className="hover:underline">{tool.name}</Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{getCategoryName(tool.category)}</td>
                <td className="px-4 py-3 text-muted-foreground">{tool.version}</td>
                <td className="px-4 py-3 text-muted-foreground">{tool.os.join(" · ")}</td>
                <td className="px-4 py-3 text-right">
                  <CopyButton command={`curl gettingstarted.sh/${tool.slug} | sh`} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No tools found for &quot;{query}&quot;
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Mobile list */}
        <div className="divide-y md:hidden">
          {filtered.map((tool) => (
            <div key={tool.slug} className="p-4">
              <div className="flex items-center justify-between">
                <Link href={`/${tool.slug}`} className="text-xs font-medium hover:underline">{tool.name}</Link>
                <span className="text-[10px] text-muted-foreground">{getCategoryName(tool.category)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">{tool.version} · {tool.os.join(" · ")}</span>
                <CopyButton command={`curl gettingstarted.sh/${tool.slug} | sh`} />
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-4 text-center text-xs text-muted-foreground">
              No tools found for &quot;{query}&quot;
            </div>
          )}
        </div>
      </div>
    </>
  )
}

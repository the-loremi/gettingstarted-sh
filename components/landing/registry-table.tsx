import Link from "next/link"
import { CopyButton } from "./copy-button"
import { type Tool, getCategoryName } from "@/lib/tools"

export function RegistryTable({ tools }: { tools: Tool[] }) {
  return (
    <section id="registry" className="border-t px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
          Registry
        </p>
        <h2 className="text-2xl font-medium md:text-3xl">
          The setup registry{" "}
          <span className="text-muted-foreground">for the AI era.</span>
        </h2>

        <div className="mt-12 overflow-hidden rounded-lg border">
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
              {tools.map((tool) => (
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
            </tbody>
          </table>

          {/* Mobile list */}
          <div className="divide-y md:hidden">
            {tools.map((tool) => (
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
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link href="/browse" className="text-xs text-muted-foreground hover:text-foreground">
            Browse all tools →
          </Link>
        </div>
      </div>
    </section>
  )
}

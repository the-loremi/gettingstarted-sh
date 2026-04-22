import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllTools, getToolBySlug, getCategoryName } from "@/lib/tools"
import { CopyButton } from "@/components/landing/copy-button"

export function generateStaticParams() {
  return getAllTools().map((tool) => ({ tool: tool.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }) {
  const { tool: slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) return { title: "Tool Not Found — gettingstarted.sh" }
  return {
    title: `${tool.name} — gettingstarted.sh`,
    description: tool.description,
  }
}

type InstallRow = { label: string; command: string }

function getInstallRows(tool: NonNullable<ReturnType<typeof getToolBySlug>>): InstallRow[] {
  const rows: InstallRow[] = []

  // Auto-detect commands first
  if (tool.os.includes("mac") || tool.os.includes("linux")) {
    rows.push({ label: "auto (mac/linux)", command: `curl gettingstarted.sh/${tool.slug} | sh` })
  }
  if (tool.os.includes("win")) {
    rows.push({ label: "auto (windows)", command: `irm gettingstarted.sh/${tool.slug} | iex` })
  }

  // Package managers
  const managers: { key: keyof typeof tool.install; label: string; prefix: string }[] = [
    { key: "brew", label: "brew", prefix: "brew install " },
    { key: "winget", label: "winget", prefix: "winget install " },
    { key: "choco", label: "choco", prefix: "choco install " },
    { key: "scoop", label: "scoop", prefix: "scoop install " },
    { key: "snap", label: "snap", prefix: "snap install " },
    { key: "apt", label: "apt", prefix: "apt install " },
    { key: "npm", label: "npm", prefix: "npm install -g " },
    { key: "pip", label: "pip", prefix: "pip install " },
    { key: "cargo", label: "cargo", prefix: "cargo install " },
  ]

  for (const m of managers) {
    const value = tool.install[m.key]
    if (value) {
      rows.push({ label: m.label, command: `${m.prefix}${value}` })
    }
  }

  return rows
}

export default async function ToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool: slug } = await params
  const tool = getToolBySlug(slug)

  if (!tool) {
    notFound()
  }

  const installRows = getInstallRows(tool)

  return (
    <div className="mx-auto max-w-2xl px-6 pt-24 pb-16">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
            <Link href={`/browse/${tool.category}`} className="hover:text-foreground">
              {getCategoryName(tool.category)}
            </Link>
          </p>
          <h1 className="text-2xl font-medium md:text-3xl">{tool.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{tool.description}</p>
        </div>
      </div>

      {/* Badges */}
      <div className="mt-6 flex flex-wrap gap-2">
        {tool.verified && (
          <span className="rounded border bg-primary/10 px-2 py-1 text-[10px] text-primary">
            Verified
          </span>
        )}
        {tool.os.map((os) => (
          <span
            key={os}
            className="rounded border px-2 py-1 text-[10px] text-muted-foreground"
          >
            {os}
          </span>
        ))}
        <span className="rounded border px-2 py-1 text-[10px] text-muted-foreground">
          {tool.version}
        </span>
      </div>

      {/* Install methods */}
      <div className="mt-10">
        <h2 className="text-sm font-medium">Install</h2>
        <div className="mt-4 overflow-hidden rounded-lg border">
          <table className="w-full text-xs">
            <tbody>
              {installRows.map((row) => (
                <tr key={row.label} className="border-b last:border-b-0 hover:bg-muted/30">
                  <td className="px-4 py-3 text-muted-foreground w-28">{row.label}</td>
                  <td className="px-4 py-3 font-mono text-[11px]">{row.command}</td>
                  <td className="px-4 py-3 text-right">
                    <CopyButton command={row.command} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Links */}
      <div className="mt-8 flex gap-4 text-xs">
        <a
          href={tool.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground"
        >
          Homepage →
        </a>
        <Link
          href={`/${tool.slug}/docs`}
          className="text-muted-foreground hover:text-foreground"
        >
          View docs →
        </Link>
        <Link
          href="/browse"
          className="text-muted-foreground hover:text-foreground"
        >
          Back to registry →
        </Link>
      </div>
    </div>
  )
}

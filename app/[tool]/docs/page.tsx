import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllTools, getToolBySlug } from "@/lib/tools"

export function generateStaticParams() {
  return getAllTools().map((tool) => ({ tool: tool.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }) {
  const { tool: slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) return { title: "Docs Not Found — gettingstarted.sh" }
  return {
    title: `${tool.name} Docs — gettingstarted.sh`,
  }
}

export default async function ToolDocsPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool: slug } = await params
  const tool = getToolBySlug(slug)

  if (!tool) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pt-24 pb-16">
      <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
        Documentation
      </p>
      <h1 className="text-2xl font-medium md:text-3xl">{tool.name}</h1>
      <p className="mt-6 text-sm text-muted-foreground">
        Documentation coming soon.
      </p>
      <div className="mt-8 text-xs">
        <Link
          href={`/${tool.slug}`}
          className="text-muted-foreground hover:text-foreground"
        >
          ← Back to {tool.name}
        </Link>
      </div>
    </div>
  )
}

import { notFound } from "next/navigation"
import {
  getCategories,
  getToolsByCategory,
  getCategoryName,
  getAllTools,
} from "@/lib/tools"
import { ToolSearch } from "../tool-search"

export function generateStaticParams() {
  return getCategories().map((cat) => ({ category: cat.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  return {
    title: `${getCategoryName(category)} Tools — gettingstarted.sh`,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const tools = getToolsByCategory(category)
  const categories = getCategories()

  if (tools.length === 0) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pt-24 pb-16">
      <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
        Registry
      </p>
      <h1 className="text-2xl font-medium md:text-3xl">
        {getCategoryName(category)}
      </h1>

      <ToolSearch tools={tools} categories={categories} />
    </div>
  )
}

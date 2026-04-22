import type { Tool } from "./types"
import toolsData from "../tools.json"

const tools = toolsData as Tool[]

export function loadTool(slug: string): Tool | null {
  return tools.find((t) => t.slug === slug) ?? null
}

export function getAllSlugs(): string[] {
  return tools.map((t) => t.slug)
}

import fs from "fs"
import path from "path"
import yaml from "js-yaml"

// Re-export types and getCategoryName so server components can import from one place
export type { InstallMethods, Tool, Category } from "./tool-types"
export { getCategoryName } from "./tool-types"

import type { Tool, Category } from "./tool-types"
import { getCategoryName } from "./tool-types"

// --- Data loading (server-only, uses fs) ---

function loadTools(): Tool[] {
  const toolsDir = path.join(process.cwd(), "tools")

  if (!fs.existsSync(toolsDir)) {
    return []
  }

  const files = fs.readdirSync(toolsDir).filter((f) => f.endsWith(".yaml"))

  return files.map((file) => {
    const content = fs.readFileSync(path.join(toolsDir, file), "utf-8")
    const data = yaml.load(content) as Record<string, unknown>

    const install = (data.install ?? {}) as Record<string, unknown>

    return {
      name: data.name as string,
      slug: data.slug as string,
      category: data.category as string,
      version: String(data.version ?? "latest"),
      homepage: data.homepage as string,
      description: data.description as string,
      os: data.os as string[],
      verified: (data.verified as boolean) ?? false,
      install: {
        brew: (install.brew as string) ?? null,
        winget: (install.winget as string) ?? null,
        choco: (install.choco as string) ?? null,
        scoop: (install.scoop as string) ?? null,
        snap: (install.snap as string) ?? null,
        apt: (install.apt as string) ?? null,
        npm: (install.npm as string) ?? null,
        pip: (install.pip as string) ?? null,
        cargo: (install.cargo as string) ?? null,
        mac: (install.mac as string) ?? null,
        linux: (install.linux as string) ?? null,
        win: (install.win as string) ?? null,
      },
    }
  })
}

// --- Public API ---

export function getAllTools(): Tool[] {
  return loadTools().sort((a, b) => a.name.localeCompare(b.name))
}

export function getToolBySlug(slug: string): Tool | null {
  return loadTools().find((t) => t.slug === slug) ?? null
}

export function getToolsByCategory(category: string): Tool[] {
  return getAllTools().filter((t) => t.category === category)
}

export function getCategories(): Category[] {
  const tools = loadTools()
  const map = new Map<string, number>()

  for (const tool of tools) {
    map.set(tool.category, (map.get(tool.category) ?? 0) + 1)
  }

  return Array.from(map.entries())
    .map(([slug, count]) => ({
      slug,
      name: getCategoryName(slug),
      count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

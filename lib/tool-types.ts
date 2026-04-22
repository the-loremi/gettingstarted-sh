// Types and utilities safe to import from client components (no fs/path)

export type InstallMethods = {
  brew: string | null
  winget: string | null
  choco: string | null
  scoop: string | null
  snap: string | null
  apt: string | null
  npm: string | null
  pip: string | null
  cargo: string | null
  mac: string | null
  linux: string | null
  win: string | null
}

export type Tool = {
  name: string
  slug: string
  category: string
  version: string
  homepage: string
  description: string
  os: string[]
  verified: boolean
  install: InstallMethods
}

export type Category = {
  slug: string
  name: string
  count: number
}

const categoryNames: Record<string, string> = {
  "ai-coding": "AI Coding",
  "video-gen": "Video Gen",
  "audio-ai": "Audio AI",
  "local-llm": "Local LLM",
  sdks: "SDKs",
  "vibe-coding": "Vibe Coding",
}

export function getCategoryName(slug: string): string {
  return categoryNames[slug] ?? slug
}

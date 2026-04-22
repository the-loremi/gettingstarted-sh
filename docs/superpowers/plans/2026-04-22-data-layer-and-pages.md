# Data Layer & Site Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the YAML data layer and all Phase 0 site pages so gettingstarted.sh is a functional registry with 5 seeded tools.

**Architecture:** YAML files in `tools/` → `lib/tools.ts` reads them at build time → Next.js pages consume typed data via exported functions → static pages generated via `generateStaticParams`. Nav and Footer move to root layout so all pages share them.

**Tech Stack:** Next.js 16 (App Router, SSG), js-yaml, TypeScript, Tailwind CSS 4, shadcn/ui

**Spec:** `docs/superpowers/specs/2026-04-22-data-layer-and-pages-design.md`

---

## File Map

| # | Action | File | Responsibility |
|---|--------|------|----------------|
| 1 | Add dep | `package.json` | js-yaml + @types/js-yaml |
| 2 | Create | `lib/tools.ts` | Types, YAML reader, data functions |
| 3 | Create | `tools/cursor.yaml` | Seed: Cursor manifest |
| 4 | Create | `tools/claude-code.yaml` | Seed: Claude Code manifest |
| 5 | Create | `tools/ollama.yaml` | Seed: Ollama manifest |
| 6 | Create | `tools/elevenlabs.yaml` | Seed: ElevenLabs manifest |
| 7 | Create | `tools/lovable.yaml` | Seed: Lovable manifest |
| 8 | Modify | `app/layout.tsx` | Add Nav + Footer to root layout |
| 9 | Modify | `app/page.tsx` | Remove Nav/Footer, pass real data |
| 10 | Modify | `components/landing/registry-table.tsx` | Accept Tool[] prop |
| 11 | Modify | `components/landing/nav.tsx` | Real route links |
| 12 | Create | `app/browse/page.tsx` | Browse all tools |
| 13 | Create | `app/browse/[category]/page.tsx` | Browse by category |
| 14 | Create | `app/[tool]/page.tsx` | Tool detail page |
| 15 | Create | `app/[tool]/docs/page.tsx` | Docs stub |
| 16 | Create | `app/about/page.tsx` | About page |
| 17 | Create | `app/contribute/page.tsx` | Contribute page |

---

## Task 1: Install js-yaml dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install js-yaml**

```bash
cd "/c/Users/Barnabas Oretan/OneDrive/Desktop/The Loremi/gettingstarted.sh" && pnpm add js-yaml && pnpm add -D @types/js-yaml
```

- [ ] **Step 2: Verify build still passes**

```bash
npx next build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add js-yaml for YAML manifest parsing"
```

---

## Task 2: Create data layer (lib/tools.ts)

**Files:**
- Create: `lib/tools.ts`

- [ ] **Step 1: Create the data layer file**

Write `lib/tools.ts`:

```typescript
import fs from "fs"
import path from "path"
import yaml from "js-yaml"

// --- Types ---

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

// --- Category display names ---

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

// --- Data loading ---

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
```

- [ ] **Step 2: Verify build passes**

```bash
npx next build
```

Expected: `✓ Compiled successfully` (no tools yet, loadTools returns [])

- [ ] **Step 3: Commit**

```bash
git add lib/tools.ts
git commit -m "feat: add YAML data layer for tool manifests"
```

---

## Task 3: Seed 5 tool manifests

**Files:**
- Create: `tools/cursor.yaml`
- Create: `tools/claude-code.yaml`
- Create: `tools/ollama.yaml`
- Create: `tools/elevenlabs.yaml`
- Create: `tools/lovable.yaml`

- [ ] **Step 1: Create tools directory and cursor.yaml**

```bash
mkdir -p tools
```

Write `tools/cursor.yaml`:

```yaml
name: Cursor
slug: cursor
category: ai-coding
version: "0.42.x"
homepage: https://cursor.com
description: AI-first code editor built on VS Code
os:
  - mac
  - win
  - linux
install:
  brew: cursor --cask
  winget: Cursor.Cursor
  choco: cursor
  scoop: extras/cursor
  snap: cursor
  apt: null
  npm: null
  pip: null
  cargo: null
  mac: |
    curl -fsSL https://download.cursor.com/mac/install.sh | sh
  linux: |
    curl -fsSL https://download.cursor.com/linux/install.sh | sh
  win: |
    powershell -c "irm https://download.cursor.com/win/install.ps1 | iex"
verified: true
```

- [ ] **Step 2: Create claude-code.yaml**

Write `tools/claude-code.yaml`:

```yaml
name: Claude Code
slug: claude-code
category: ai-coding
version: latest
homepage: https://docs.anthropic.com/en/docs/claude-code
description: Anthropic's official CLI for Claude, the AI assistant
os:
  - mac
  - linux
install:
  brew: null
  winget: null
  choco: null
  scoop: null
  snap: null
  apt: null
  npm: "@anthropic-ai/claude-code"
  pip: null
  cargo: null
  mac: |
    curl -fsSL https://gettingstarted.sh/scripts/claude-code/mac.sh | sh
  linux: |
    curl -fsSL https://gettingstarted.sh/scripts/claude-code/linux.sh | sh
verified: true
```

- [ ] **Step 3: Create ollama.yaml**

Write `tools/ollama.yaml`:

```yaml
name: Ollama
slug: ollama
category: local-llm
version: "0.6.x"
homepage: https://ollama.com
description: Run large language models locally on your machine
os:
  - mac
  - win
  - linux
install:
  brew: ollama
  winget: Ollama.Ollama
  choco: null
  scoop: null
  snap: null
  apt: null
  npm: null
  pip: ollama
  cargo: null
  mac: |
    curl -fsSL https://ollama.com/install.sh | sh
  linux: |
    curl -fsSL https://ollama.com/install.sh | sh
  win: |
    powershell -c "irm https://ollama.com/download/OllamaSetup.exe -OutFile OllamaSetup.exe; Start-Process OllamaSetup.exe"
verified: true
```

- [ ] **Step 4: Create elevenlabs.yaml**

Write `tools/elevenlabs.yaml`:

```yaml
name: ElevenLabs
slug: elevenlabs
category: audio-ai
version: v3 API
homepage: https://elevenlabs.io
description: AI voice generation and text-to-speech platform
os:
  - mac
  - win
  - linux
install:
  brew: null
  winget: null
  choco: null
  scoop: null
  snap: null
  apt: null
  npm: elevenlabs
  pip: elevenlabs
  cargo: null
  mac: |
    pip install elevenlabs
  linux: |
    pip install elevenlabs
  win: |
    pip install elevenlabs
verified: true
```

- [ ] **Step 5: Create lovable.yaml**

Write `tools/lovable.yaml`:

```yaml
name: Lovable
slug: lovable
category: vibe-coding
version: latest
homepage: https://lovable.dev
description: AI-powered full-stack app builder
os:
  - mac
  - win
  - linux
install:
  brew: null
  winget: null
  choco: null
  scoop: null
  snap: null
  apt: null
  npm: lovable
  pip: null
  cargo: null
  mac: |
    npm install -g lovable
  linux: |
    npm install -g lovable
  win: |
    npm install -g lovable
verified: false
```

- [ ] **Step 6: Verify build passes**

```bash
npx next build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 7: Commit**

```bash
git add tools/
git commit -m "feat: seed 5 tool manifests (cursor, claude-code, ollama, elevenlabs, lovable)"
```

---

## Task 4: Move Nav + Footer to root layout

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Update layout.tsx to include Nav and Footer**

Replace the full contents of `app/layout.tsx`:

```typescript
import { Geist, JetBrains_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Nav } from "@/components/landing/nav"
import { SiteFooter } from "@/components/landing/site-footer"
import { cn } from "@/lib/utils"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: "gettingstarted.sh — Every tool. One command.",
  description:
    "The canonical getting-started registry for AI tools, models, and vibe-coding stacks. One-line setup commands. Always current. Community maintained.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontSans.variable,
        "font-mono",
        jetbrainsMono.variable,
      )}
    >
      <body>
        <ThemeProvider defaultTheme="dark">
          <Nav />
          <main>{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Update page.tsx to remove Nav, main wrapper, and Footer**

Replace the full contents of `app/page.tsx`:

```typescript
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { RegistryTable } from "@/components/landing/registry-table"
import { OpenSourceSection } from "@/components/landing/open-source"

export default function Page() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <RegistryTable />
      <OpenSourceSection />
    </>
  )
}
```

- [ ] **Step 3: Verify build passes**

```bash
npx next build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/page.tsx
git commit -m "refactor: move Nav and Footer to root layout"
```

---

## Task 5: Update Nav with real route links

**Files:**
- Modify: `components/landing/nav.tsx`

- [ ] **Step 1: Replace nav.tsx contents**

Replace the full contents of `components/landing/nav.tsx`:

```typescript
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Nav() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex h-14 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
      <Link href="/" className="text-sm font-medium">
        gettingstarted.sh
      </Link>
      <div className="hidden items-center gap-6 md:flex">
        <Link
          href="/browse"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Registry
        </Link>
        <Link
          href="/about"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          About
        </Link>
        <Link
          href="/contribute"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Contribute
        </Link>
      </div>
      <Button size="sm" asChild>
        <a href="#">Star on GitHub</a>
      </Button>
    </nav>
  )
}
```

- [ ] **Step 2: Verify build passes**

```bash
npx next build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add components/landing/nav.tsx
git commit -m "feat: update nav links to real routes"
```

---

## Task 6: Update registry table to accept props + wire landing page to real data

**Files:**
- Modify: `components/landing/registry-table.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Update registry-table.tsx to accept tools prop**

Replace the full contents of `components/landing/registry-table.tsx`:

```typescript
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
                <th className="px-4 py-3 text-left font-normal text-muted-foreground">
                  Tool
                </th>
                <th className="px-4 py-3 text-left font-normal text-muted-foreground">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-normal text-muted-foreground">
                  Version
                </th>
                <th className="px-4 py-3 text-left font-normal text-muted-foreground">
                  OS
                </th>
                <th className="px-4 py-3 text-right font-normal text-muted-foreground">
                  Command
                </th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => (
                <tr
                  key={tool.slug}
                  className="border-b transition-colors last:border-b-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/${tool.slug}`} className="hover:underline">
                      {tool.name}
                    </Link>
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
            </tbody>
          </table>

          {/* Mobile list */}
          <div className="divide-y md:hidden">
            {tools.map((tool) => (
              <div key={tool.slug} className="p-4">
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
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    {tool.version} · {tool.os.join(" · ")}
                  </span>
                  <CopyButton
                    command={`curl gettingstarted.sh/${tool.slug} | sh`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/browse"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Browse all tools →
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Update page.tsx to pass real data**

Replace the full contents of `app/page.tsx`:

```typescript
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { RegistryTable } from "@/components/landing/registry-table"
import { OpenSourceSection } from "@/components/landing/open-source"
import { getAllTools } from "@/lib/tools"

export default function Page() {
  const tools = getAllTools().slice(0, 5)

  return (
    <>
      <Hero />
      <HowItWorks />
      <RegistryTable tools={tools} />
      <OpenSourceSection />
    </>
  )
}
```

- [ ] **Step 3: Verify build passes**

```bash
npx next build
```

Expected: `✓ Compiled successfully` with routes showing the 5 tools

- [ ] **Step 4: Commit**

```bash
git add components/landing/registry-table.tsx app/page.tsx
git commit -m "feat: wire landing page registry table to real YAML data"
```

---

## Task 7: Browse page (`/browse`)

**Files:**
- Create: `app/browse/page.tsx`

- [ ] **Step 1: Create the browse page**

Write `app/browse/page.tsx`:

```typescript
import Link from "next/link"
import { getAllTools, getCategories, getCategoryName } from "@/lib/tools"
import { CopyButton } from "@/components/landing/copy-button"
import { ToolSearch } from "./tool-search"

export const metadata = {
  title: "Browse Tools — gettingstarted.sh",
}

export default function BrowsePage() {
  const tools = getAllTools()
  const categories = getCategories()

  return (
    <div className="mx-auto max-w-2xl px-6 pt-24 pb-16">
      <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
        Registry
      </p>
      <h1 className="text-2xl font-medium md:text-3xl">
        Browse tools
      </h1>

      {/* Category pills */}
      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/browse"
          className="rounded border bg-primary px-3 py-1 text-xs text-primary-foreground"
        >
          All ({tools.length})
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/browse/${cat.slug}`}
            className="rounded border px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {cat.name} ({cat.count})
          </Link>
        ))}
      </div>

      {/* Search + Tool list */}
      <ToolSearch tools={tools} />
    </div>
  )
}
```

- [ ] **Step 2: Create the client-side search component**

Write `app/browse/tool-search.tsx`:

```typescript
"use client"

import { useState } from "react"
import Link from "next/link"
import { type Tool, getCategoryName } from "@/lib/tools"
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
```

- [ ] **Step 3: Verify build passes**

```bash
npx next build
```

Expected: `✓ Compiled successfully`, route `/browse` listed

- [ ] **Step 4: Commit**

```bash
git add app/browse/
git commit -m "feat: add browse page with search and category pills"
```

---

## Task 8: Browse by category page (`/browse/[category]`)

**Files:**
- Create: `app/browse/[category]/page.tsx`

- [ ] **Step 1: Create the category browse page**

Write `app/browse/[category]/page.tsx`:

```typescript
import Link from "next/link"
import { notFound } from "next/navigation"
import { getCategories, getToolsByCategory, getCategoryName, getAllTools } from "@/lib/tools"
import { ToolSearch } from "../tool-search"

export function generateStaticParams() {
  return getCategories().map((cat) => ({ category: cat.slug }))
}

export function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  // Next.js 16 uses async params
  return params.then(({ category }) => ({
    title: `${getCategoryName(category)} Tools — gettingstarted.sh`,
  }))
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const tools = getToolsByCategory(category)
  const categories = getCategories()
  const allTools = getAllTools()

  if (tools.length === 0) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pt-24 pb-16">
      <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
        Registry
      </p>
      <h1 className="text-2xl font-medium md:text-3xl">
        {getCategoryName(category)}
      </h1>

      {/* Category pills */}
      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/browse"
          className="rounded border px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          All ({allTools.length})
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/browse/${cat.slug}`}
            className={`rounded border px-3 py-1 text-xs transition-colors ${
              cat.slug === category
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.name} ({cat.count})
          </Link>
        ))}
      </div>

      {/* Tool list */}
      <ToolSearch tools={tools} />
    </div>
  )
}
```

- [ ] **Step 2: Verify build passes**

```bash
npx next build
```

Expected: `✓ Compiled successfully`, routes `/browse/ai-coding`, `/browse/local-llm`, `/browse/audio-ai`, `/browse/vibe-coding` listed

- [ ] **Step 3: Commit**

```bash
git add app/browse/[category]/
git commit -m "feat: add browse-by-category page"
```

---

## Task 9: Tool detail page (`/[tool]`)

**Files:**
- Create: `app/[tool]/page.tsx`

- [ ] **Step 1: Create the tool detail page**

Write `app/[tool]/page.tsx`:

```typescript
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
```

- [ ] **Step 2: Verify build passes**

```bash
npx next build
```

Expected: `✓ Compiled successfully`, routes `/cursor`, `/claude-code`, `/ollama`, `/elevenlabs`, `/lovable` listed

- [ ] **Step 3: Commit**

```bash
git add app/[tool]/
git commit -m "feat: add tool detail page with install methods table"
```

---

## Task 10: Tool docs stub page (`/[tool]/docs`)

**Files:**
- Create: `app/[tool]/docs/page.tsx`

- [ ] **Step 1: Create the docs stub page**

Write `app/[tool]/docs/page.tsx`:

```typescript
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
```

- [ ] **Step 2: Verify build passes**

```bash
npx next build
```

Expected: `✓ Compiled successfully`, routes `/cursor/docs`, `/claude-code/docs`, etc. listed

- [ ] **Step 3: Commit**

```bash
git add app/[tool]/docs/
git commit -m "feat: add tool docs stub page"
```

---

## Task 11: About page (`/about`)

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Create the about page**

Write `app/about/page.tsx`:

```typescript
export const metadata = {
  title: "About — gettingstarted.sh",
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 pt-24 pb-16">
      <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
        About
      </p>
      <h1 className="text-2xl font-medium md:text-3xl">
        About gettingstarted.sh
      </h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          gettingstarted.sh is a free, open-source registry that lets you install any
          AI tool with a single command. It figures out the best way to install each
          tool on your computer — whether you&apos;re on Mac, Windows, or Linux — so you
          don&apos;t have to.
        </p>

        <h2 className="text-base font-medium text-foreground">How it works</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Detects your system</strong> — the
            script checks what package managers you have installed (brew, winget, npm,
            pip, snap, and more)
          </li>
          <li>
            <strong className="text-foreground">Picks the best method</strong> — it
            uses the first available package manager that supports the tool
          </li>
          <li>
            <strong className="text-foreground">Installs the tool</strong> — runs the
            install command and configures everything. If no package manager is found,
            it falls back to a direct download
          </li>
        </ol>

        <h2 className="text-base font-medium text-foreground">The Loremi Ltd</h2>
        <p>
          gettingstarted.sh is built by The Loremi Ltd. We&apos;re building
          infrastructure for how people discover and set up AI tools. The registry is
          MIT licensed and community-driven — anyone can add a tool, fix a script, or
          improve docs.
        </p>

        <h2 className="text-base font-medium text-foreground">License</h2>
        <p>
          MIT — see the{" "}
          <a
            href="https://github.com/gettingstarted-sh/gettingstarted.sh/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline"
          >
            LICENSE
          </a>{" "}
          file.
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build passes**

```bash
npx next build
```

Expected: `✓ Compiled successfully`, route `/about` listed

- [ ] **Step 3: Commit**

```bash
git add app/about/
git commit -m "feat: add about page"
```

---

## Task 12: Contribute page (`/contribute`)

**Files:**
- Create: `app/contribute/page.tsx`

- [ ] **Step 1: Create the contribute page**

Write `app/contribute/page.tsx`:

```typescript
import { CopyButton } from "@/components/landing/copy-button"

export const metadata = {
  title: "Contribute — gettingstarted.sh",
}

const manifestTemplate = `name: Your Tool Name
slug: your-tool-name
category: ai-coding
version: "1.0.0"
homepage: https://yourtool.com
description: One-line description (under 120 chars)
os:
  - mac
  - win
  - linux
install:
  brew: null
  winget: null
  choco: null
  scoop: null
  snap: null
  apt: null
  npm: null
  pip: null
  cargo: null
  mac: |
    echo "Add macOS install script here"
  linux: |
    echo "Add Linux install script here"
  win: |
    Write-Host "Add Windows install script here"
verified: false`

export default function ContributePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 pt-24 pb-16">
      <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
        Contribute
      </p>
      <h1 className="text-2xl font-medium md:text-3xl">
        Add a tool
      </h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          Anyone can add a tool to the registry. It takes three steps:
        </p>

        <ol className="list-decimal space-y-4 pl-5">
          <li>
            <strong className="text-foreground">Fork the repo</strong> — go to the{" "}
            <a
              href="https://github.com/gettingstarted-sh/gettingstarted.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline"
            >
              GitHub repository
            </a>{" "}
            and click &quot;Fork&quot;
          </li>
          <li>
            <strong className="text-foreground">Add a YAML manifest</strong> — create
            a file at <code className="rounded bg-muted px-1 py-0.5 text-xs">tools/your-tool-name.yaml</code>{" "}
            using the template below
          </li>
          <li>
            <strong className="text-foreground">Submit a pull request</strong> —
            we&apos;ll review and merge within 48 hours
          </li>
        </ol>

        <h2 className="text-base font-medium text-foreground">Manifest template</h2>

        <div className="relative overflow-hidden rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b px-4 py-2.5">
            <span className="text-[10px] text-muted-foreground">
              tools/your-tool-name.yaml
            </span>
            <CopyButton command={manifestTemplate} />
          </div>
          <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
            {manifestTemplate}
          </pre>
        </div>

        <h2 className="text-base font-medium text-foreground">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "ai-coding",
            "video-gen",
            "audio-ai",
            "local-llm",
            "sdks",
            "vibe-coding",
          ].map((cat) => (
            <span
              key={cat}
              className="rounded border bg-muted px-2 py-1 text-xs text-muted-foreground"
            >
              {cat}
            </span>
          ))}
        </div>

        <p>
          For the full schema reference, naming rules, and examples, see the{" "}
          <a
            href="https://github.com/gettingstarted-sh/gettingstarted.sh/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline"
          >
            Contributing Guide
          </a>{" "}
          on GitHub.
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build passes**

```bash
npx next build
```

Expected: `✓ Compiled successfully`, route `/contribute` listed

- [ ] **Step 3: Commit**

```bash
git add app/contribute/
git commit -m "feat: add contribute page with manifest template"
```

---

## Execution Summary

| Task | What it does | Dependencies |
|------|-------------|--------------|
| 1 | Install js-yaml | — |
| 2 | Create lib/tools.ts data layer | Task 1 |
| 3 | Seed 5 tool YAML manifests | — |
| 4 | Move Nav+Footer to root layout | — |
| 5 | Update Nav with real links | — |
| 6 | Wire registry table to real data | Tasks 2, 3 |
| 7 | Browse page (/browse) | Tasks 2, 3 |
| 8 | Category page (/browse/[category]) | Task 7 |
| 9 | Tool detail page (/[tool]) | Tasks 2, 3 |
| 10 | Docs stub (/[tool]/docs) | Tasks 2, 3 |
| 11 | About page (/about) | — |
| 12 | Contribute page (/contribute) | — |

**Total:** 12 tasks, 17 files, ~40 steps.

**Build verification after every task.** The `next build` command is the test gate — it catches type errors, import errors, and SSG failures.

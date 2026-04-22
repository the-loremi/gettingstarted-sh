# Hero & Registry UI Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revamp the hero section with a platform-aware install widget and logo marquee, and update the registry table to a numbered leaderboard style inspired by Skills.sh.

**Architecture:** Three new client components (install widget, logo marquee, tool table) replace the existing hero terminal demo and registry table. The tool table component is shared across the landing page, browse page, and category page. OS detection uses `navigator.userAgent` client-side.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, shadcn/ui preset theme

**Spec:** `docs/superpowers/specs/2026-04-22-hero-revamp-design.md`

---

## File Map

| # | Action | File | Responsibility |
|---|--------|------|----------------|
| 1 | Create | `components/landing/install-widget.tsx` | Platform dropdown + command + copy |
| 2 | Create | `components/landing/logo-marquee.tsx` | Scrolling tool icon strip |
| 3 | Rewrite | `components/landing/hero.tsx` | Compose widget + marquee |
| 4 | Create | `components/landing/tool-table.tsx` | Shared leaderboard-style table (client) |
| 5 | Rewrite | `components/landing/registry-table.tsx` | Landing page registry section using tool-table |
| 6 | Rewrite | `app/browse/tool-search.tsx` | Browse page using tool-table |
| 7 | Modify | `app/page.tsx` | Pass 10 tools + categories to registry |
| 8 | Modify | `app/browse/page.tsx` | Pass categories to tool-search |
| 9 | Modify | `app/globals.css` | Add marquee keyframes |

---

## Task 1: Add marquee animation to globals.css

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add marquee keyframes**

Add at the end of `app/globals.css`, before the `@layer base` block:

```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

- [ ] **Step 2: Add to @theme inline block**

Inside the `@theme inline` block in `app/globals.css`, add:

```css
  --animate-marquee: marquee 30s linear infinite;
```

- [ ] **Step 3: Verify build**

```bash
npx next build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat: add marquee animation keyframes"
```

---

## Task 2: Install widget component

**Files:**
- Create: `components/landing/install-widget.tsx`

- [ ] **Step 1: Create install-widget.tsx**

Write `components/landing/install-widget.tsx`:

```typescript
"use client"

import { useState, useEffect, useRef } from "react"

const platforms = [
  { id: "macos", label: "macOS" },
  { id: "linux", label: "Linux" },
  { id: "windows", label: "Windows" },
] as const

type Platform = (typeof platforms)[number]["id"]

const commands: Record<Platform, string> = {
  macos: "curl gettingstarted.sh/cursor | sh",
  linux: "curl gettingstarted.sh/cursor | sh",
  windows: "irm gettingstarted.sh/cursor | iex",
}

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "macos"
  const ua = navigator.userAgent
  if (ua.includes("Win")) return "windows"
  if (ua.includes("Mac")) return "macos"
  return "linux"
}

export function InstallWidget() {
  const [platform, setPlatform] = useState<Platform>("macos")
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPlatform(detectPlatform())
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const command = commands[platform]
  const currentLabel = platforms.find((p) => p.id === platform)!.label

  const handleCopy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div
      ref={ref}
      className="relative flex items-stretch overflow-hidden rounded-lg border bg-card"
    >
      {/* Platform dropdown */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border-r px-4 py-3 text-xs transition-colors hover:bg-muted/50"
      >
        <span>{currentLabel}</span>
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute top-full left-0 z-10 mt-1 overflow-hidden rounded-lg border bg-card shadow-lg">
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setPlatform(p.id)
                setOpen(false)
              }}
              className={`block w-full px-4 py-2.5 text-left text-xs transition-colors hover:bg-muted/50 ${
                p.id === platform ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* Command display */}
      <div className="flex-1 px-4 py-3 font-mono text-xs select-all">
        {command}
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="border-l px-4 py-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        {copied ? "✓" : "copy"}
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npx next build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add components/landing/install-widget.tsx
git commit -m "feat: add platform-aware install widget component"
```

---

## Task 3: Logo marquee component

**Files:**
- Create: `components/landing/logo-marquee.tsx`

- [ ] **Step 1: Create logo-marquee.tsx**

Write `components/landing/logo-marquee.tsx`:

```typescript
const tools = [
  { name: "Cursor", icon: "cursor" },
  { name: "Anthropic", icon: "anthropic" },
  { name: "Ollama", icon: "ollama" },
  { name: "Codeium", icon: "codeium" },
  { name: "ElevenLabs", icon: "elevenlabs" },
  { name: "LangChain", icon: "langchain" },
  { name: "Replicate", icon: "replicate" },
  { name: "OpenAI", icon: "openai" },
  { name: "Stability AI", icon: "stability" },
  { name: "Vercel", icon: "vercel" },
  { name: "Midjourney", icon: "midjourney" },
  { name: "ComfyUI", icon: "comfyui" },
]

export function LogoMarquee() {
  return (
    <div className="mt-12">
      <p className="mb-4 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
        Works with every AI tool in your stack
      </p>
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee gap-8 hover:[animation-play-state:paused]">
          {[...tools, ...tools].map((tool, i) => (
            <div
              key={`${tool.icon}-${i}`}
              className="flex items-center gap-2 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0"
            >
              <img
                src={`https://icons.lobehub.com/icons/${tool.icon}.svg`}
                alt={tool.name}
                width={24}
                height={24}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none"
                }}
              />
              <span className="whitespace-nowrap text-[10px] text-muted-foreground">
                {tool.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npx next build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add components/landing/logo-marquee.tsx
git commit -m "feat: add tool logo marquee component"
```

---

## Task 4: Rewrite hero section

**Files:**
- Rewrite: `components/landing/hero.tsx`

- [ ] **Step 1: Rewrite hero.tsx**

Replace the full contents of `components/landing/hero.tsx`:

```typescript
import Link from "next/link"
import { InstallWidget } from "./install-widget"
import { LogoMarquee } from "./logo-marquee"

export function Hero() {
  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] flex-col justify-center px-6 pt-14">
      <div className="mx-auto w-full max-w-2xl">
        <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">
          Open Source Registry
        </p>
        <h1 className="text-3xl font-medium leading-tight md:text-5xl">
          Every tool.{" "}
          <span className="text-muted-foreground">One command.</span>
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
          The getting-started registry for AI tools, models, and vibe-coding
          stacks. Smart install detection. Always current. Community maintained.
        </p>

        <div className="mt-10">
          <InstallWidget />
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Or{" "}
          <Link href="/browse" className="underline hover:text-foreground">
            browse the registry
          </Link>
        </p>

        <LogoMarquee />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npx next build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add components/landing/hero.tsx
git commit -m "feat: revamp hero with install widget and logo marquee"
```

---

## Task 5: Shared tool table component (leaderboard style)

**Files:**
- Create: `components/landing/tool-table.tsx`

- [ ] **Step 1: Create tool-table.tsx**

Write `components/landing/tool-table.tsx`:

```typescript
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
```

- [ ] **Step 2: Verify build**

```bash
npx next build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add components/landing/tool-table.tsx
git commit -m "feat: add shared leaderboard-style tool table component"
```

---

## Task 6: Rewrite landing page registry section

**Files:**
- Rewrite: `components/landing/registry-table.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Rewrite registry-table.tsx**

Replace the full contents of `components/landing/registry-table.tsx`:

```typescript
import Link from "next/link"
import { type Tool, type Category } from "@/lib/tools"
import { ToolTable } from "./tool-table"

export function RegistryTable({
  tools,
  categories,
}: {
  tools: Tool[]
  categories: Category[]
}) {
  return (
    <section id="registry" className="border-t px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
          Tools Registry
        </p>
        <h2 className="text-2xl font-medium md:text-3xl">
          The setup registry{" "}
          <span className="text-muted-foreground">for the AI era.</span>
        </h2>

        <div className="mt-12">
          <ToolTable
            tools={tools}
            categories={categories}
            showSearch={false}
            showCategoryTabs={true}
          />
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

- [ ] **Step 2: Update app/page.tsx to pass 10 tools + categories**

Replace the full contents of `app/page.tsx`:

```typescript
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { RegistryTable } from "@/components/landing/registry-table"
import { OpenSourceSection } from "@/components/landing/open-source"
import { getAllTools, getCategories } from "@/lib/tools"

export default function Page() {
  const tools = getAllTools().slice(0, 10)
  const categories = getCategories()

  return (
    <>
      <Hero />
      <HowItWorks />
      <RegistryTable tools={tools} categories={categories} />
      <OpenSourceSection />
    </>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npx next build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 4: Commit**

```bash
git add components/landing/registry-table.tsx app/page.tsx
git commit -m "feat: revamp landing page registry with leaderboard table"
```

---

## Task 7: Rewrite browse page to use shared tool table

**Files:**
- Rewrite: `app/browse/tool-search.tsx`
- Modify: `app/browse/page.tsx`

- [ ] **Step 1: Rewrite tool-search.tsx**

Replace the full contents of `app/browse/tool-search.tsx`:

```typescript
"use client"

import { type Tool, type Category } from "@/lib/tool-types"
import { ToolTable } from "@/components/landing/tool-table"

export function ToolSearch({
  tools,
  categories,
}: {
  tools: Tool[]
  categories: Category[]
}) {
  return (
    <div className="mt-8">
      <ToolTable
        tools={tools}
        categories={categories}
        showSearch={true}
        showCategoryTabs={true}
      />
    </div>
  )
}
```

- [ ] **Step 2: Update browse page to pass categories**

Replace the full contents of `app/browse/page.tsx`:

```typescript
import { getAllTools, getCategories } from "@/lib/tools"
import { ToolSearch } from "./tool-search"

export const metadata = {
  title: "Browse Tools — gettingstarted.sh",
}

export default function BrowsePage() {
  const tools = getAllTools()
  const categories = getCategories()

  return (
    <div className="mx-auto max-w-4xl px-6 pt-24 pb-16">
      <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
        Registry
      </p>
      <h1 className="text-2xl font-medium md:text-3xl">Browse tools</h1>

      <ToolSearch tools={tools} categories={categories} />
    </div>
  )
}
```

- [ ] **Step 3: Update category page to pass categories**

Read `app/browse/[category]/page.tsx`, then update it to pass categories to ToolSearch and remove the inline category pills (they're now inside ToolTable):

Replace the full contents of `app/browse/[category]/page.tsx`:

```typescript
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
```

- [ ] **Step 4: Verify build**

```bash
npx next build
```

Expected: `✓ Compiled successfully` with all routes

- [ ] **Step 5: Commit**

```bash
git add app/browse/tool-search.tsx app/browse/page.tsx app/browse/[category]/page.tsx
git commit -m "feat: update browse pages to use shared leaderboard table"
```

---

## Execution Summary

| Task | What it does | Dependencies |
|------|-------------|--------------|
| 1 | Add marquee CSS animation | — |
| 2 | Install widget (platform dropdown + command + copy) | — |
| 3 | Logo marquee (scrolling tool icons) | Task 1 (needs animation) |
| 4 | Rewrite hero (compose widget + marquee) | Tasks 2, 3 |
| 5 | Shared tool table component (leaderboard style) | — |
| 6 | Rewrite landing page registry section | Task 5 |
| 7 | Rewrite browse pages to use shared table | Task 5 |

**Parallelism:** Tasks 1, 2, 5 are independent. Task 3 depends on 1. Task 4 depends on 2+3. Tasks 6+7 depend on 5.

**Total:** 7 tasks, 9 files, ~25 steps.

# Data Layer & Site Pages Design — gettingstarted.sh

**Date:** 2026-04-22
**Status:** Approved
**Author:** Barnabas Oretan + Claude

---

## Context

The gettingstarted.sh landing page is built with hardcoded tool data. The documentation suite is complete (14 docs including manifest spec, architecture, sitemap). The next step is building the data layer (YAML → typed tool data) and all site pages so the registry is functional.

## Goal

Make gettingstarted.sh a working registry: seed 5 tools as YAML manifests, build a data utility to read them at build time, create all Phase 0 pages, and update the landing page to use real data.

## Approach

**Raw YAML parsing.** One dependency (`js-yaml`), one utility file (`lib/tools.ts`), pure SSG. No content frameworks, no abstraction layers. When CMS arrives in Phase 1, swap the data source in `lib/tools.ts` and nothing else changes.

---

## Data Layer

### Dependency

Add `js-yaml` (and `@types/js-yaml` as dev dependency) for parsing YAML files.

### Type Definitions

`lib/tools.ts` exports these types:

```typescript
type InstallMethods = {
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

type Tool = {
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

type Category = {
  slug: string
  name: string
  count: number
}
```

### Exported Functions

```
getAllTools(): Tool[]                        — all tools sorted by name
getToolBySlug(slug: string): Tool | null    — single tool lookup
getToolsByCategory(category: string): Tool[] — filtered by category
getCategories(): Category[]                  — unique categories with counts
```

### Implementation

- Reads all `*.yaml` files from `tools/` directory at build time using `fs.readFileSync` + `js-yaml`
- Parses each into a `Tool` object
- Category display names derived from slug: `ai-coding` → `AI Coding`, `local-llm` → `Local LLM`, etc. (simple mapping object in the same file)

### Category Display Name Map

```typescript
const categoryNames: Record<string, string> = {
  "ai-coding": "AI Coding",
  "video-gen": "Video Gen",
  "audio-ai": "Audio AI",
  "local-llm": "Local LLM",
  "sdks": "SDKs",
  "vibe-coding": "Vibe Coding",
}
```

---

## Seed Tools

5 YAML manifests in `tools/` directory, matching the schema in `inspo/technical/manifest-spec.md`:

| File | Tool | Category | Primary install |
|------|------|----------|----------------|
| `tools/cursor.yaml` | Cursor | ai-coding | brew, winget, scoop |
| `tools/claude-code.yaml` | Claude Code | ai-coding | npm |
| `tools/ollama.yaml` | Ollama | local-llm | brew, winget, pip |
| `tools/elevenlabs.yaml` | ElevenLabs | audio-ai | pip, npm |
| `tools/lovable.yaml` | Lovable | vibe-coding | npm |

Content matches the examples in `inspo/technical/manifest-spec.md` and `CONTRIBUTING.md` exactly where applicable (Cursor, Claude Code, Ollama). ElevenLabs and Lovable are new manifests following the same schema.

---

## Pages

### Shared Layout Change

Move `<Nav />` and `<SiteFooter />` from `app/page.tsx` into `app/layout.tsx` so they appear on all pages. Remove them from the landing page component.

### Route: `/browse` — `app/browse/page.tsx`

- Calls `getAllTools()` and `getCategories()`
- **Category pills** at top: clickable links to `/browse/[category]`, one per category, shows count. "All" pill active by default.
- **Tool list** below: table (desktop) / cards (mobile) showing name, category, version, OS, copy button for install command. Same pattern as landing page registry table but with all tools.
- **Client-side search** input at top filters tools by name (simple `useState` + `filter`, no API).
- Metadata: title "Browse Tools — gettingstarted.sh"

### Route: `/browse/[category]` — `app/browse/[category]/page.tsx`

- `generateStaticParams()` returns one entry per category from `getCategories()`
- Same layout as `/browse` but pre-filtered to the category
- Category name as page heading
- Same category pills (current one highlighted)
- Same tool list but filtered
- Metadata: title "[Category Name] Tools — gettingstarted.sh"

### Route: `/[tool]` — `app/[tool]/page.tsx`

- `generateStaticParams()` returns one entry per tool from `getAllTools()`
- `getToolBySlug(params.tool)` for data
- **Header:** tool name, description, version, homepage link (external)
- **Badges:** verified (if true), OS support (mac/win/linux pills)
- **Install methods section:**
  - Auto-detect commands first:
    - `curl gettingstarted.sh/[slug] | sh` (if mac or linux in os)
    - `irm gettingstarted.sh/[slug] | iex` (if win in os)
  - Then every non-null package manager with its full command (e.g., `brew install cursor --cask`)
  - Copy button on each row (reuse `CopyButton` component)
- **Links:** "View docs" → `/[slug]/docs`, "Homepage" → external URL
- Metadata: title "[Tool Name] — gettingstarted.sh", description from tool description

### Route: `/[tool]/docs` — `app/[tool]/docs/page.tsx`

- `generateStaticParams()` same as `/[tool]`
- Stub page: tool name heading, "Documentation coming soon.", link back to `/[slug]`
- Metadata: title "[Tool Name] Docs — gettingstarted.sh"

### Route: `/about` — `app/about/page.tsx`

- Static content, no data fetching
- What gettingstarted.sh is (1 paragraph from README)
- How it works (the 3-step process: detect, pick, install)
- About The Loremi Ltd (1 paragraph)
- MIT licensed, link to GitHub
- Metadata: title "About — gettingstarted.sh"

### Route: `/contribute` — `app/contribute/page.tsx`

- Static content
- Quick start (3 steps: fork, add YAML, submit PR)
- Manifest template (copy-paste ready, same as CONTRIBUTING.md)
- Link to full CONTRIBUTING.md on GitHub
- Metadata: title "Contribute — gettingstarted.sh"

---

## Landing Page Updates

### `components/landing/registry-table.tsx`

Currently has hardcoded `tools` array. Change to accept `tools: Tool[]` as a prop. The landing page passes `getAllTools().slice(0, 5)` (first 5 tools). Category style mapping uses the same neutral theme tokens (primary/foreground/muted-foreground), no brand colors.

### `components/landing/nav.tsx`

Update links from `#` anchors to real routes:
- "How it works" → `#how` (stays, it's on landing page)
- "Registry" → `/browse`
- "Contribute" → `/contribute`
- "Docs" link removed (no standalone docs page)

### `app/page.tsx`

- Import `getAllTools` from `lib/tools`
- Pass first 5 tools to `RegistryTable`
- Remove `<Nav />` and `<SiteFooter />` (moved to layout)

---

## Out of Scope

- Search API or server-side search (client-side filtering is sufficient for <100 tools)
- CMS integration (Phase 1)
- Curl/irm Cloudflare Worker handler (Phase 1)
- CI manifest validation (Phase 2)
- Blog, changelog routes (Phase 2)
- Per-tool og:image generation (Phase 2+)
- Seeding more than 5 tools (separate task)

## File Map

| Action | File |
|--------|------|
| Add dependency | `package.json` (js-yaml, @types/js-yaml) |
| Create | `lib/tools.ts` |
| Create | `tools/cursor.yaml` |
| Create | `tools/claude-code.yaml` |
| Create | `tools/ollama.yaml` |
| Create | `tools/elevenlabs.yaml` |
| Create | `tools/lovable.yaml` |
| Create | `app/browse/page.tsx` |
| Create | `app/browse/[category]/page.tsx` |
| Create | `app/[tool]/page.tsx` |
| Create | `app/[tool]/docs/page.tsx` |
| Create | `app/about/page.tsx` |
| Create | `app/contribute/page.tsx` |
| Modify | `app/layout.tsx` (add Nav + Footer) |
| Modify | `app/page.tsx` (remove Nav/Footer, pass real data) |
| Modify | `components/landing/registry-table.tsx` (accept props) |
| Modify | `components/landing/nav.tsx` (real links) |

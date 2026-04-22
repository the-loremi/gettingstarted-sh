# Hero & Registry UI Revamp Design — gettingstarted.sh

**Date:** 2026-04-22
**Status:** Approved
**Author:** Barnabas Oretan + Claude

---

## Context

The landing page hero section currently has a static terminal demo. The registry table uses a basic 5-column layout. Both need a visual upgrade inspired by Claude Code's install widget and Skills.sh's leaderboard UI.

## Goal

Revamp the hero section with a platform-aware install widget (auto-detect OS, dropdown selector, copy command) and a tool logo marquee. Revamp the registry table to a numbered leaderboard style with search and category tabs.

---

## Hero Section

### Layout (top to bottom)

1. **Eyebrow** — "Open Source Registry" (unchanged)
2. **Headline** — "Every tool. One command." (unchanged)
3. **Subtitle** — (unchanged)
4. **Install widget** — replaces terminal demo
5. **"Or browse the registry" link** — small text below widget
6. **Tool logo marquee** — scrolling strip of tool icons

### Install Widget

A single horizontal bar with three parts:

```
┌──────────────┬──────────────────────────────────────────┬──────┐
│  macOS     ▾ │  curl gettingstarted.sh/cursor | sh     │ copy │
└──────────────┴──────────────────────────────────────────┴──────┘
```

**Platform dropdown (left):**
- Three options: macOS, Linux, Windows
- Auto-detects user's OS on mount via `navigator.userAgent`:
  - Contains `Win` → Windows
  - Contains `Mac` → macOS
  - Else → Linux
- Shows OS name as button text, dropdown on click
- Simple custom dropdown (not a native `<select>`) — styled with preset theme borders/colors

**Command field (center):**
- Read-only monospace text
- macOS selected → `curl gettingstarted.sh/cursor | sh`
- Linux selected → `curl gettingstarted.sh/cursor | sh`
- Windows selected → `irm gettingstarted.sh/cursor | iex`

**Copy button (right):**
- Reuses existing `CopyButton` component pattern
- Copies the displayed command to clipboard

**Implementation:** Client component (`"use client"`), `useState` for selected platform, `useEffect` for OS detection on mount.

### Tool Logo Marquee

Horizontal auto-scrolling strip of tool/company logos below the install widget.

**Icon source:** `https://icons.lobehub.com/icons/{name}.svg` — loaded as `<img>` tags.

**Tools to show (mapped to lobehub icon slugs where available):**
- cursor, anthropic (for Claude Code), ollama, codeium (for Windsurf), elevenlabs
- langchain, replicate, openai (for Whisper), stability (for Stable Diffusion), comfyui
- midjourney, suno, pika, jan, lmstudio, gpt4all, vercel (for Vercel AI SDK)

For tools without a lobehub icon, use a text pill fallback (same as previous marquee pattern).

**Styling:**
- CSS `@keyframes marquee` animation — `translateX(0)` to `translateX(-50%)`
- Content duplicated for seamless loop
- Pauses on hover
- Icons grayscale by default (`filter: grayscale(1) opacity(0.5)`), full color on hover
- Small label above: "Works with every AI tool in your stack"
- Icon size: 24x24px with 32px spacing between

---

## Registry Table Revamp

### Leaderboard Style

Replaces the current table on both the landing page (registry section) and `/browse` page.

**Columns:**

| Column | Content | Alignment |
|--------|---------|-----------|
| `#` | Row number (1, 2, 3...) | Left |
| `TOOL` | Tool name (bold) + slug in muted text | Left |
| `CATEGORY` | Category display name | Left |
| `VERSION` | Version string | Left |
| `OS` | OS list joined by ` · ` | Left |
| `COMMAND` | Copy button with `curl gettingstarted.sh/[slug] \| sh` | Right |

Clicking a tool name navigates to `/[slug]`.

**Layout:**

```
  TOOLS REGISTRY

  ┌─────────────────────────────────────────────────────┐
  │  Search tools...                                /   │
  └─────────────────────────────────────────────────────┘

  All (20)   AI Coding (4)   Local LLM (4)   Audio AI (3)   ...

  #     TOOL                      CATEGORY      VERSION     OS                  COMMAND
  ─────────────────────────────────────────────────────────────────────────────────────────
  1     Cursor  cursor            AI Coding     0.42.x      mac · win · linux   [copy]
  2     Claude Code  claude-code  AI Coding     latest      mac · linux         [copy]
  3     Ollama  ollama            Local LLM     0.6.x       mac · win · linux   [copy]
  ...
```

**Search:** Input field at top, filters by tool name (client-side, same as current).

**Category tabs:** Horizontal pills above the table. "All" active by default. Clicking a category filters the list (client-side on landing page, links to `/browse/[category]` on browse page).

**Row behavior:** Entire row is hoverable (`hover:bg-muted/30`). Tool name is a link to `/[slug]`.

**Mobile:** On small screens, collapse to a card layout (name + slug, category, version · OS on second line). Row numbers still shown.

### Where this applies

- **Landing page** (`components/landing/registry-table.tsx`) — shows first 10 tools, "Browse all tools →" link at bottom
- **Browse page** (`app/browse/page.tsx` + `app/browse/tool-search.tsx`) — shows all tools with search and category tabs
- **Category page** (`app/browse/[category]/page.tsx`) — shows filtered tools

All three use the same table component. The component accepts `tools: Tool[]`, `showSearch: boolean`, and `showCategoryTabs: boolean` props.

---

## Files to Change

| Action | File |
|--------|------|
| Create | `components/landing/install-widget.tsx` (client component) |
| Create | `components/landing/logo-marquee.tsx` |
| Rewrite | `components/landing/hero.tsx` (use new widget + marquee) |
| Rewrite | `components/landing/registry-table.tsx` (leaderboard style) |
| Modify | `app/browse/tool-search.tsx` (match leaderboard style) |
| Modify | `app/page.tsx` (pass more tools to registry, add categories) |

## Out of Scope

- Tool detail page changes
- New tools/manifests
- Backend/Worker changes
- Other landing page sections (HowItWorks, OpenSource, Footer)

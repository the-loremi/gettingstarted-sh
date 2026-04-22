# Sitemap

> Every page and route the gettingstarted.sh website needs, organized by phase.

## Phase 0 Routes (File-Based)

| Route | Description | Status | Data Source |
|-------|-------------|--------|-------------|
| `/` | Landing page — hero, how it works, registry preview, OSS section | Built | Static |
| `/browse` | Full registry with search and category filter | Not built | `tools/*.yaml` |
| `/browse/[category]` | Registry filtered by category | Not built | `tools/*.yaml` |
| `/[tool]` | Individual tool page — description, all install methods, OS support | Not built | `tools/*.yaml` |
| `/[tool]/docs` | Tool-specific getting-started guide | Not built | `tools/*.yaml` |
| `/about` | About the project, The Loremi Ltd, team | Not built | Static |
| `/contribute` | Contributor guide (renders CONTRIBUTING.md content) | Not built | Static |

## Phase 1+ Routes (CMS-Backed)

All Phase 0 routes continue to work, but data source changes from YAML files to Loremi CMS API (fetched at build time via SSG).

| Route | Description | Data Source |
|-------|-------------|-------------|
| `/api/install/[tool]` | Cloudflare Worker endpoint — serves install script for `curl`/`irm` | CMS API |
| `/changelog` | Version history and release notes | CMS API |
| `/blog` | Announcements, contributor spotlights, launch updates | CMS API |
| `/blog/[slug]` | Individual blog post | CMS API |

## Categories

These are the category slugs used in `/browse/[category]` routes and tool manifests:

| Slug | Display Name | Description |
|------|-------------|-------------|
| `ai-coding` | AI Coding | Code editors, coding assistants, dev tools with AI |
| `video-gen` | Video Gen | AI video generation and editing tools |
| `audio-ai` | Audio AI | Text-to-speech, music generation, audio processing |
| `local-llm` | Local LLM | Run language models locally on your machine |
| `sdks` | SDKs | AI SDKs, frameworks, and developer libraries |
| `vibe-coding` | Vibe Coding | AI-powered app builders and no-code/low-code tools |

## Individual Tool Page (`/[tool]`)

Each tool page displays:

- Tool name, description, version, homepage link
- Verified badge (if `verified: true`)
- OS support indicators (mac, win, linux)
- Category tag
- **Install methods table** — every available method:
  - Auto-detect command: `curl gettingstarted.sh/[tool] | sh` / `irm gettingstarted.sh/[tool] | iex`
  - Each package manager with its command (brew, winget, npm, etc.)
  - Copy button for each command
- Link to docs page

## SEO Requirements

Each page needs:

| Element | Format |
|---------|--------|
| `<title>` | `[Tool Name] — gettingstarted.sh` (tool pages) or `gettingstarted.sh — Every tool. One command.` (home) |
| `<meta description>` | Tool description (tool pages) or site tagline (other pages) |
| `og:title` | Same as `<title>` |
| `og:description` | Same as `<meta description>` |
| `og:image` | Site-wide social preview image (Phase 0), per-tool generated images (Phase 2+) |
| `og:url` | Canonical URL for the page |

## Data Source Transition

| Phase | Source | Build Mechanism |
|-------|--------|----------------|
| Phase 0 | `tools/*.yaml` files in repo | Next.js reads files at build time |
| Phase 1+ | Loremi CMS API | Next.js fetches API at build time (SSG), `getStaticProps` / `generateStaticParams` |

The YAML schema and CMS content type schema are intentionally identical so the migration is a data-source swap, not a restructure.
